"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaFilePdf } from "react-icons/fa6";
import { privateRequest } from "@/lib/privateApi";
import { downloadInvoice } from "@/lib/invoice";
import { formatDate, formatMoney } from "@/lib/format";
import ConfirmModal from "@/components/ui/ConfirmModal";
import StatusBadge from "@/components/ui/StatusBadge";
import StudioImage from "@/components/ui/StudioImage";
import type { Booking, BookingStatus } from "@/types";

type Tab = "mine" | "requests";
type HostStatus = Exclude<BookingStatus, "Pending">;

interface PendingAction {
  booking: Booking;
  mode: "guest-cancel" | "host-status";
  status?: HostStatus;
}

function BookingRow({
  booking,
  children,
  guestInfo,
}: {
  booking: Booking;
  children: React.ReactNode;
  guestInfo?: boolean;
}) {
  return (
    <article className="flex flex-col gap-4 rounded-box border border-base-300 bg-base-100 p-4 sm:flex-row">
      <StudioImage
        src={booking.studioImage}
        alt={booking.studioTitle}
        className="h-32 w-full shrink-0 rounded-box sm:w-44"
      />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link
            href={`/studios/${booking.studioId}`}
            className="line-clamp-1 text-lg font-bold hover:text-primary"
          >
            {booking.studioTitle}
          </Link>
          <StatusBadge status={booking.status} />
        </div>
        <p className="text-sm opacity-70">{booking.studioLocation}</p>
        <p className="text-sm">
          <b>{formatDate(booking.bookingDate)}</b>, {booking.startTime} to {booking.endTime} (
          {booking.durationHours} hr)
        </p>
        <p className="text-sm">
          Total <b className="text-primary">{formatMoney(booking.totalPrice)}</b>
          <span className="opacity-60"> plus {formatMoney(booking.securityDeposit)} deposit</span>
        </p>
        {guestInfo && (
          <p className="text-sm opacity-70">
            Guest: {booking.userName} ({booking.userEmail})
          </p>
        )}
        {booking.notes && (
          <p className="line-clamp-2 text-sm italic opacity-70">&ldquo;{booking.notes}&rdquo;</p>
        )}
        {booking.cancelReason && booking.status === "Cancelled" && (
          <p className="text-xs text-error">{booking.cancelReason}</p>
        )}
        <div className="flex flex-wrap gap-2 pt-2">{children}</div>
      </div>
    </article>
  );
}

function EmptyBookings({
  title,
  text,
  href,
  cta,
}: {
  title: string;
  text: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-box border border-dashed border-base-300 p-12 text-center">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm opacity-70">{text}</p>
      <Link href={href} className="btn btn-primary mt-6">
        {cta}
      </Link>
    </div>
  );
}

export default function MyBookingsPage() {
  const [tab, setTab] = useState<Tab>("mine");
  const [mine, setMine] = useState<Booking[] | null>(null);
  const [requests, setRequests] = useState<Booking[] | null>(null);
  const [error, setError] = useState("");
  const [action, setAction] = useState<PendingAction | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      privateRequest<Booking[]>("/bookings/mine"),
      privateRequest<Booking[]>("/bookings/host"),
    ])
      .then(([m, h]) => {
        if (cancelled) return;
        setMine(m);
        setRequests(h);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load bookings.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const replace = (list: Booking[] | null, updated: Booking) =>
    (list ?? []).map((b) => (b._id === updated._id ? { ...b, ...updated } : b));

  async function runAction() {
    if (!action) return;
    setBusy(true);
    try {
      if (action.mode === "guest-cancel") {
        const updated = await privateRequest<Booking>(
          `/bookings/${action.booking._id}/cancel`,
          { method: "PATCH" },
        );
        setMine((l) => replace(l, updated));
        setRequests((l) => replace(l, updated));
        toast.success("Booking cancelled.");
      } else {
        const updated = await privateRequest<Booking>(
          `/bookings/${action.booking._id}/status`,
          { method: "PATCH", body: JSON.stringify({ status: action.status }) },
        );
        setRequests((l) => replace(l, updated));
        setMine((l) => replace(l, updated));
        toast.success(`Booking marked as ${action.status}.`);
      }
      setAction(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Action failed.");
      setAction(null);
    } finally {
      setBusy(false);
    }
  }

  async function handleInvoice(b: Booking) {
    try {
      await downloadInvoice(b);
      toast.success("Invoice downloaded.");
    } catch {
      toast.error("Could not generate the invoice.");
    }
  }

  const pendingRequests = (requests ?? []).filter((b) => b.status === "Pending").length;
  const loading = mine === null && !error;

  const modalCopy = (() => {
    if (!action) return { title: "", message: "", label: "", danger: false };
    if (action.mode === "guest-cancel")
      return {
        title: "Cancel this booking?",
        message: `Your pending request for "${action.booking.studioTitle}" on ${formatDate(action.booking.bookingDate)} will be cancelled.`,
        label: "Cancel booking",
        danger: true,
      };
    if (action.status === "Cancelled")
      return {
        title: "Decline this booking?",
        message: `${action.booking.userName}'s booking will be cancelled and the guest will see it as Cancelled.`,
        label: "Yes, cancel it",
        danger: true,
      };
    if (action.status === "Confirmed")
      return {
        title: "Confirm this booking?",
        message: "The time slot will be reserved. Other requests overlapping this time can no longer be confirmed.",
        label: "Confirm booking",
        danger: false,
      };
    return {
      title: "Mark as completed?",
      message: "Use this once the session has finished.",
      label: "Mark completed",
      danger: false,
    };
  })();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-primary sm:text-4xl">My Bookings</h1>
      <p className="mb-6 mt-2 opacity-70">Track your reservations and manage requests for your own studios.</p>

      <div role="tablist" className="mb-6 flex gap-2 border-b border-base-300">
        {(
          [
            ["mine", "My Bookings"],
            ["requests", "Requests for My Studios"],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold ${
              tab === key ? "border-primary text-primary" : "border-transparent opacity-70"
            }`}
          >
            {label}
            {key === "requests" && pendingRequests > 0 && (
              <span className="badge badge-warning badge-sm ml-2">{pendingRequests}</span>
            )}
          </button>
        ))}
      </div>

      {error ? (
        <div role="alert" className="alert alert-error alert-soft">
          {error}
        </div>
      ) : loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-40 w-full" />
          ))}
        </div>
      ) : tab === "mine" ? (
        (mine ?? []).length === 0 ? (
          <EmptyBookings
            title="No bookings yet"
            text="When you reserve a studio, it will show up here with its status."
            href="/studios"
            cta="Explore Studios"
          />
        ) : (
          <div className="space-y-4">
            {(mine ?? []).map((b) => (
              <BookingRow key={b._id} booking={b}>
                {b.status === "Pending" && (
                  <button
                    className="btn btn-sm btn-error btn-outline"
                    onClick={() => setAction({ booking: b, mode: "guest-cancel" })}
                  >
                    Cancel Booking
                  </button>
                )}
                {(b.status === "Confirmed" || b.status === "Completed") && (
                  <button className="btn btn-sm btn-outline" onClick={() => handleInvoice(b)}>
                    <FaFilePdf /> Download Invoice
                  </button>
                )}
              </BookingRow>
            ))}
          </div>
        )
      ) : (requests ?? []).length === 0 ? (
        <EmptyBookings
          title="No booking requests yet"
          text="When creators book one of your studios, their requests will appear here for you to confirm."
          href="/add-studio"
          cta="List a Studio"
        />
      ) : (
        <div className="space-y-4">
          {(requests ?? []).map((b) => (
            <BookingRow key={b._id} booking={b} guestInfo>
              {b.status === "Pending" && (
                <>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setAction({ booking: b, mode: "host-status", status: "Confirmed" })}
                  >
                    Confirm
                  </button>
                  <button
                    className="btn btn-sm btn-error btn-outline"
                    onClick={() => setAction({ booking: b, mode: "host-status", status: "Cancelled" })}
                  >
                    Decline
                  </button>
                </>
              )}
              {b.status === "Confirmed" && (
                <>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => setAction({ booking: b, mode: "host-status", status: "Completed" })}
                  >
                    Mark Completed
                  </button>
                  <button
                    className="btn btn-sm btn-error btn-outline"
                    onClick={() => setAction({ booking: b, mode: "host-status", status: "Cancelled" })}
                  >
                    Cancel
                  </button>
                </>
              )}
            </BookingRow>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!action}
        title={modalCopy.title}
        message={modalCopy.message}
        confirmLabel={modalCopy.label}
        danger={modalCopy.danger}
        loading={busy}
        onConfirm={runAction}
        onCancel={() => !busy && setAction(null)}
      />
    </main>
  );
}