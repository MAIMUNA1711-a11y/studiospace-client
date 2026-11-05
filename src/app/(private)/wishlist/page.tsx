"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { privateRequest } from "@/lib/privateApi";
import { useWishlist } from "@/providers/WishlistProvider";
import StudioCard from "@/components/studio/StudioCard";
import StudioCardSkeleton from "@/components/studio/StudioCardSkeleton";
import type { Studio } from "@/types";

export default function WishlistPage() {
  const { has } = useWishlist();
  const [studios, setStudios] = useState<Studio[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    privateRequest<Studio[]>("/wishlist")
      .then((list) => {
        if (!cancelled) setStudios(list);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load your wishlist.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = (studios ?? []).filter((s) => has(s._id));

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold text-primary sm:text-4xl">Saved Studios</h1>
      <p className="mb-8 mt-2 opacity-70">Spaces you have bookmarked for later.</p>

      {error ? (
        <div role="alert" className="alert alert-error alert-soft">
          {error}
        </div>
      ) : studios === null ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <StudioCardSkeleton key={i} />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-box border border-dashed border-base-300 p-12 text-center">
          <h2 className="text-xl font-bold">Your wishlist is empty</h2>
          <p className="mx-auto mt-2 max-w-md text-sm opacity-70">
            Tap the heart on any studio card to save it here.
          </p>
          <Link href="/studios" className="btn btn-primary mt-6">
            Explore Studios
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((s) => (
            <StudioCard key={s._id} studio={s} />
          ))}
        </div>
      )}
    </main>
  );
}