"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaShieldHalved, FaUsers } from "react-icons/fa6";
import { authClient } from "@/lib/auth-client";
import BookingModal from "@/components/studio/BookingModal";
import type { Studio } from "@/types";

export default function BookingPanel({ studio }: { studio: Studio }) {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);

  const isOwner = session?.user.email?.toLowerCase() === studio.ownerEmail.toLowerCase();

  return (
    <div className="space-y-4 rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
      <p className="text-3xl font-bold text-primary">
        ${studio.hourlyRate}
        <span className="text-base font-normal opacity-70"> / hour</span>
      </p>

      <ul className="space-y-2 text-sm">
        <li className="flex items-center gap-2">
          <FaShieldHalved className="text-primary" />
          Security deposit: ${studio.securityDeposit}
        </li>
        <li className="flex items-center gap-2">
          <FaUsers className="text-primary" />
          Up to {studio.maxCapacity} people
        </li>
      </ul>

      {isPending ? (
        <div className="skeleton h-12 w-full" />
      ) : !session ? (
        <Link
          href={`/login?redirect=${encodeURIComponent(pathname)}`}
          className="btn btn-primary w-full"
        >
          Log in to Book
        </Link>
      ) : isOwner ? (
        <div className="space-y-2">
          <button className="btn w-full" disabled>
            This is your listing
          </button>
          <Link
            href={`/studios/edit/${studio._id}`}
            className="btn btn-outline w-full"
          >
            Edit Listing
          </Link>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="btn btn-primary w-full">
          Book Workspace Now
        </button>
      )}

      <p className="text-xs opacity-60">
        Your request stays Pending until the host confirms it.
      </p>

      <BookingModal studio={studio} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}