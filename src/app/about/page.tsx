import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-4xl font-bold text-primary">About StudioSpace</h1>
      <p className="mt-5 leading-relaxed opacity-80">
        StudioSpace started with a simple frustration: finding a good space to
        shoot, record or rehearse should not take longer than the creative work
        itself. We built a peer-to-peer marketplace where hosts list their
        studios and creators book them by the hour, with clear pricing and
        real-time availability.
      </p>
      <p className="mt-4 leading-relaxed opacity-80">
        Whether you run a photography cyc wall, a cinema sound stage, a podcast
        lounge or an art workshop, StudioSpace helps your space earn while it
        sits idle, and helps the next creator make something worth sharing.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/studios" className="btn btn-primary">
          Explore Studios
        </Link>
        <Link href="/add-studio" className="btn btn-outline">
          Host Your Space
        </Link>
      </div>
    </main>
  );
}