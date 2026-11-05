import type { Metadata } from "next";
import { Suspense } from "react";
import StudiosExplorer from "@/components/studio/StudiosExplorer";
import StudioCardSkeleton from "@/components/studio/StudioCardSkeleton";

export const metadata: Metadata = { title: "Explore Studios" };

export default function StudiosPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary sm:text-4xl">
          Explore Studios
        </h1>
        <p className="mt-2 max-w-2xl opacity-70">
          Search photo studios, sound stages, podcast rooms, music suites and
          art workshops, then book the hours you need.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <StudioCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <StudiosExplorer />
      </Suspense>
    </main>
  );
}