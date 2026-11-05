import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FaCheck, FaLocationDot, FaStar } from "react-icons/fa6";
import { ApiRequestError, getReviews, getStudio } from "@/lib/api";
import StudioGallery from "@/components/studio/StudioGallery";
import BookingPanel from "@/components/studio/BookingPanel";
import Reviews from "@/components/studio/Reviews";
import Avatar from "@/components/ui/Avatar";

type Props = { params: Promise<{ id: string }> };

async function load(id: string) {
  try {
    const [studio, reviews] = await Promise.all([getStudio(id), getReviews(id)]);
    return { studio, reviews };
  } catch (e) {
    if (e instanceof ApiRequestError && (e.status === 404 || e.status === 400)) {
      notFound();
    }
    throw e;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const studio = await getStudio(id);
    return { title: studio.title, description: studio.overview.slice(0, 150) };
  } catch {
    return { title: "Studio details" };
  }
}

export default async function StudioDetailsPage({ params }: Props) {
  const { id } = await params;
  const { studio, reviews } = await load(id);
  const images = [studio.imageUrl, ...studio.gallery].filter(Boolean);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0 space-y-8">
          <StudioGallery images={images} title={studio.title} />

          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-primary">{studio.category}</span>
              <span className="badge badge-outline gap-1">
                <FaStar className="text-warning" />
                {studio.rating > 0
                  ? `${studio.rating.toFixed(1)} (${studio.reviewCount})`
                  : "New"}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-primary sm:text-4xl">
              {studio.title}
            </h1>
            <p className="flex items-center gap-2 opacity-70">
              <FaLocationDot className="text-primary" />
              {studio.location}
            </p>
          </header>

          <section>
            <h2 className="mb-3 text-2xl font-bold">Overview</h2>
            <p className="whitespace-pre-line leading-relaxed opacity-80">
              {studio.overview}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold">Amenities</h2>
            {studio.amenities.length === 0 ? (
              <p className="text-sm opacity-70">The host has not listed amenities yet.</p>
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2">
                {studio.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2">
                    <FaCheck className="shrink-0 text-success" />
                    {a}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold">Hosted by</h2>
            <div className="flex items-center gap-4 rounded-box border border-base-300 bg-base-100 p-4">
              <Avatar
                name={studio.ownerName}
                image={studio.ownerImage}
                className="h-14 w-14 text-xl"
              />
              <div>
                <p className="font-bold">{studio.ownerName}</p>
                <p className="text-sm opacity-70">
                  Listed on{" "}
                  {new Date(studio.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </p>
              </div>
            </div>
          </section>

          <Reviews
            studioId={studio._id}
            ownerEmail={studio.ownerEmail}
            reviews={reviews}
          />
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BookingPanel studio={studio} />
        </aside>
      </div>
    </main>
  );
}