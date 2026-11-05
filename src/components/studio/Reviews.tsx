"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa6";
import { authClient } from "@/lib/auth-client";
import { privateRequest } from "@/lib/privateApi";
import Avatar from "@/components/ui/Avatar";
import type { Review } from "@/types";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

function Stars({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <FaStar
          key={n}
          className={n <= value ? "text-warning" : "opacity-20"}
        />
      ))}
    </span>
  );
}

export default function Reviews({
  studioId,
  ownerEmail,
  reviews,
}: {
  studioId: string;
  ownerEmail: string;
  reviews: Review[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isOwner = session?.user.email?.toLowerCase() === ownerEmail.toLowerCase();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      toast.error("Please select a star rating.");
      return;
    }
    if (comment.trim().length < 5) {
      toast.error("Your review must be at least 5 characters long.");
      return;
    }
    setSubmitting(true);
    try {
      await privateRequest(`/studios/${studioId}/reviews`, {
        method: "POST",
        body: JSON.stringify({ rating, comment: comment.trim() }),
      });
      toast.success("Thanks for your review!");
      setRating(0);
      setComment("");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not post your review.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">Reviews ({reviews.length})</h2>

      {reviews.length === 0 ? (
        <p className="rounded-box border border-dashed border-base-300 p-6 text-center text-sm opacity-70">
          No reviews yet. Book this studio and be the first to share your experience.
        </p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li
              key={r._id}
              className="flex gap-3 rounded-box border border-base-300 bg-base-100 p-4"
            >
              <Avatar name={r.userName} image={r.userImage} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{r.userName}</p>
                  <span className="text-xs opacity-60">{formatDate(r.createdAt)}</span>
                </div>
                <Stars value={r.rating} />
                <p className="mt-2 break-words text-sm opacity-80">{r.comment}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 rounded-box border border-base-300 bg-base-100 p-5">
        <h3 className="mb-3 font-bold">Leave a review</h3>
        {!session ? (
          <p className="text-sm">
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className="link link-primary font-semibold"
            >
              Log in
            </Link>{" "}
            to share your experience.
          </p>
        ) : isOwner ? (
          <p className="text-sm opacity-70">You cannot review your own studio.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-1" role="radiogroup" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={rating === n}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  onClick={() => setRating(n)}
                  className="text-2xl"
                >
                  <FaStar className={n <= rating ? "text-warning" : "opacity-25"} />
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="How was the space, the gear and the host?"
              className="textarea textarea-bordered w-full"
            />
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? <span className="loading loading-spinner" /> : "Post Review"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}