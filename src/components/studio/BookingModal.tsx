"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ApiRequestError, getAvailability } from "@/lib/api";
import { privateRequest } from "@/lib/privateApi";
import type { Booking, Studio, TimeSlot } from "@/types";

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

function todayLocal() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

interface SlotsResult {
  key: string;
  slots: TimeSlot[];
}

function BookingForm({
  studio,
  onClose,
}: {
  studio: Studio;
  onClose: () => void;
}) {
  const router = useRouter();
  const [today] = useState(todayLocal);
  const [date, setDate] = useState(today);
  const [start, setStart] = useState("10:00");
  const [end, setEnd] = useState("12:00");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [slotsResult, setSlotsResult] = useState<SlotsResult | null>(null);

  useEffect(() => {
    if (!date) return;
    let cancelled = false;
    getAvailability(studio._id, date)
      .then((slots) => {
        if (!cancelled) setSlotsResult({ key: date, slots });
      })
      .catch(() => {
        if (!cancelled) setSlotsResult({ key: date, slots: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [date, studio._id]);

  const loadingSlots = !!date && slotsResult?.key !== date;
  const slots = slotsResult?.key === date ? slotsResult.slots : [];

  const startM = start ? toMinutes(start) : 0;
  const endM = end ? toMinutes(end) : 0;
  const hours = start && end && endM > startM ? (endM - startM) / 60 : 0;
  const total = Math.round(studio.hourlyRate * hours * 100) / 100;
  const conflicts = slots.filter(
    (s) => toMinutes(s.startTime) < endM && toMinutes(s.endTime) > startM,
  );

  function validate(): string | null {
    if (!date) return "Please choose a booking date.";
    if (!start || !end) return "Please choose a start and end time.";
    if (endM <= startM) return "End time must be after start time.";
    if (hours < 1) return "The minimum booking is 1 hour.";
    if (hours > 12) return "The maximum booking is 12 hours.";
    if (conflicts.length > 0)
      return "This time overlaps a confirmed booking. Please pick a different slot.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const problem = validate();
    if (problem) {
      setError(problem);
      toast.error(problem);
      return;
    }

    setSubmitting(true);
    try {
      await privateRequest<Booking>("/bookings", {
        method: "POST",
        body: JSON.stringify({
          studioId: studio._id,
          bookingDate: date,
          startTime: start,
          endTime: end,
          ...(notes.trim() ? { notes: notes.trim() } : {}),
        }),
      });
            toast.success("Booking request sent! It is now Pending host approval.");
      onClose();
      router.push("/my-bookings");
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        router.push(`/login?redirect=${encodeURIComponent(`/studios/${studio._id}`)}`);
        return;
      }
      const message =
        err instanceof Error ? err.message : "Could not create the booking.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-xl font-bold text-primary">Book this workspace</h3>
        <p className="text-sm opacity-70">{studio.title}</p>
      </div>

      {error && (
        <div role="alert" className="alert alert-error alert-soft text-sm">
          {error}
        </div>
      )}

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Date</span>
        <input
          type="date"
          required
          min={today}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input input-bordered w-full"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Start time</span>
          <input
            type="time"
            required
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="input input-bordered w-full"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">End time</span>
          <input
            type="time"
            required
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="input input-bordered w-full"
          />
        </label>
      </div>

      <div className="rounded-box bg-base-200 p-3 text-sm">
        <p className="font-semibold">Already confirmed on this date</p>
        {loadingSlots ? (
          <p className="mt-1 opacity-70">Checking availability…</p>
        ) : slots.length === 0 ? (
          <p className="mt-1 text-success">No confirmed bookings. The day is open.</p>
        ) : (
          <ul className="mt-1 flex flex-wrap gap-2">
            {slots.map((s) => (
              <li key={`${s.startTime}-${s.endTime}`} className="badge badge-warning">
                {s.startTime} to {s.endTime}
              </li>
            ))}
          </ul>
        )}
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">
          Notes for the host <span className="opacity-60">(optional)</span>
        </span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Tell the host about your shoot, crew size or gear needs"
          className="textarea textarea-bordered w-full"
        />
      </label>

      <div className="space-y-1 rounded-box border border-base-300 p-3 text-sm">
        <div className="flex justify-between">
          <span>
            ${studio.hourlyRate} x {hours} hr
          </span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between opacity-70">
          <span>Security deposit</span>
          <span>${studio.securityDeposit.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t border-base-300 pt-2 text-base font-bold">
          <span>Session total</span>
          <span className="text-primary">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="modal-action mt-2">
        <button type="button" onClick={onClose} className="btn btn-ghost">
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="btn btn-primary">
          {submitting ? (
            <span className="loading loading-spinner" />
          ) : (
            "Send Booking Request"
          )}
        </button>
      </div>
    </form>
  );
}

export default function BookingModal({
  studio,
  open,
  onClose,
}: {
  studio: Studio;
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} className="modal" onClose={onClose}>
      <div className="modal-box max-w-lg">
        {open && <BookingForm studio={studio} onClose={onClose} />}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button aria-label="Close booking dialog">close</button>
      </form>
    </dialog>
  );
}