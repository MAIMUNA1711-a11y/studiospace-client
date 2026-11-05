"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { privateRequest } from "@/lib/privateApi";
import { formatMoney } from "@/lib/format";

interface Stats {
  listings: number;
  wishlist: number;
  bookingsMade: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    totalSpent: number;
  };
  hosting: {
    incoming: number;
    pending: number;
    confirmed: number;
    completed: number;
    earnings: number;
  };
}

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="flex h-full flex-col gap-1 rounded-box border border-base-300 bg-base-100 p-5">
      <span className="text-sm opacity-70">{label}</span>
      <span className="text-3xl font-bold text-primary">{value}</span>
      {hint && <span className="text-xs opacity-60">{hint}</span>}
    </div>
  );
}

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    privateRequest<Stats>("/dashboard/stats")
      .then((s) => {
        if (!cancelled) setStats(s);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load your dashboard.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-primary sm:text-4xl">
        Welcome back{session?.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}
      </h1>
      <p className="mb-8 mt-2 opacity-70">Here is how your bookings and listings are doing.</p>

      {error ? (
        <div role="alert" className="alert alert-error alert-soft">
          {error}
        </div>
      ) : !stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-28 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-xl font-bold">As a creator</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Bookings made" value={stats.bookingsMade.total} />
              <StatCard label="Pending" value={stats.bookingsMade.pending} hint="Waiting for host approval" />
              <StatCard label="Confirmed" value={stats.bookingsMade.confirmed} />
              <StatCard label="Total spent" value={formatMoney(stats.bookingsMade.totalSpent)} hint="Cancelled bookings excluded" />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold">As a host</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Active listings" value={stats.listings} />
              <StatCard label="Incoming requests" value={stats.hosting.incoming} />
              <StatCard label="Awaiting your reply" value={stats.hosting.pending} />
              <StatCard label="Earnings" value={formatMoney(stats.hosting.earnings)} hint="Confirmed and completed" />
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <Link href="/add-studio" className="btn btn-primary">
              Add New Studio
            </Link>
            <Link href="/my-listings" className="btn btn-outline">
              My Studio Listings
            </Link>
            <Link href="/my-bookings" className="btn btn-outline">
              My Bookings
            </Link>
            <Link href="/wishlist" className="btn btn-outline">
              Saved Studios ({stats.wishlist})
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}