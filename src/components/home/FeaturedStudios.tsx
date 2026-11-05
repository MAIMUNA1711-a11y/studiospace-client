import Link from "next/link";
import { getFeaturedStudios } from "@/lib/api";
import StudioCard from "@/components/studio/StudioCard";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Studio } from "@/types";

export default async function FeaturedStudios() {
  let studios: Studio[] = [];
  let error = "";
  try {
    studios = await getFeaturedStudios();
  } catch (e) {
    error = e instanceof Error ? e.message : "Something went wrong.";
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeading
        title="Featured Studios"
        subtitle="Top-rated spaces creators are booking right now."
      />

      {error ? (
        <div role="alert" className="alert alert-error alert-soft mx-auto max-w-xl">
          {error}
        </div>
      ) : studios.length === 0 ? (
        <div className="mx-auto max-w-md rounded-box border border-dashed border-base-300 p-10 text-center">
          <p className="font-semibold">No studios listed yet</p>
          <p className="mt-2 text-sm opacity-70">
            Be the first host on StudioSpace and share your creative space.
          </p>
          <Link href="/add-studio" className="btn btn-primary mt-5">
            Host Your Space
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((s) => (
              <StudioCard key={s._id} studio={s} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/studios" className="btn btn-outline">
              View All Studios
            </Link>
          </div>
        </>
      )}
    </section>
  );
}