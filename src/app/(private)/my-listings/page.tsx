"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaPenToSquare, FaTrash } from "react-icons/fa6";
import { privateRequest } from "@/lib/privateApi";
import ConfirmModal from "@/components/ui/ConfirmModal";
import StudioImage from "@/components/ui/StudioImage";
import { formatMoney } from "@/lib/format";
import type { Studio } from "@/types";

export default function MyListingsPage() {
  const [studios, setStudios] = useState<Studio[] | null>(null);
  const [error, setError] = useState("");
  const [target, setTarget] = useState<Studio | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    privateRequest<Studio[]>("/studios/mine")
      .then((list) => {
        if (!cancelled) setStudios(list);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load your listings.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function confirmDelete() {
    if (!target) return;
    setDeleting(true);
    try {
      await privateRequest(`/studios/${target._id}`, { method: "DELETE" });
      setStudios((list) => (list ?? []).filter((s) => s._id !== target._id));
      toast.success("Studio deleted.");
      setTarget(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete the studio.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-primary sm:text-4xl">My Studio Listings</h1>
          <p className="mt-2 opacity-70">Manage the spaces you host on StudioSpace.</p>
        </div>
        <Link href="/add-studio" className="btn btn-primary">
          Add New Studio
        </Link>
      </div>

      {error ? (
        <div role="alert" className="alert alert-error alert-soft">
          {error}
        </div>
      ) : studios === null ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-20 w-full" />
          ))}
        </div>
      ) : studios.length === 0 ? (
        <div className="rounded-box border border-dashed border-base-300 p-12 text-center">
          <h2 className="text-xl font-bold">You have not listed any studios yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm opacity-70">
            List your photo studio, sound stage, podcast room or workshop and start
            earning when it sits idle.
          </p>
          <Link href="/add-studio" className="btn btn-primary mt-6">
            Add Your First Studio
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-base-200 text-xs uppercase">
              <tr>
                <th className="px-4 py-3">Studio</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Rate</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {studios.map((s) => (
                <tr key={s._id} className="border-t border-base-300">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <StudioImage
                        src={s.imageUrl}
                        alt={s.title}
                        className="h-14 w-20 shrink-0 rounded-md"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/studios/${s._id}`}
                          className="line-clamp-1 font-semibold hover:text-primary"
                        >
                          {s.title}
                        </Link>
                        <p className="line-clamp-1 text-xs opacity-60">{s.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge badge-primary badge-outline">{s.category}</span>
                  </td>
                  <td className="px-4 py-3">{formatMoney(s.hourlyRate)}/hr</td>
                  <td className="px-4 py-3">
                    {s.rating > 0 ? `${s.rating.toFixed(1)} (${s.reviewCount})` : "New"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/studios/edit/${s._id}`}
                        className="btn btn-sm btn-outline"
                      >
                        <FaPenToSquare /> Update
                      </Link>
                      <button
                        onClick={() => setTarget(s)}
                        className="btn btn-sm btn-error btn-outline"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!target}
        title="Delete this studio?"
        message={`"${target?.title ?? ""}" will be removed permanently and any open booking requests for it will be cancelled. This cannot be undone.`}
        confirmLabel="Yes, delete"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setTarget(null)}
      />
    </main>
  );
}