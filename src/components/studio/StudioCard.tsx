import Link from "next/link";
import { FaLocationDot, FaStar } from "react-icons/fa6";
import StudioImage from "@/components/ui/StudioImage";
import WishlistButton from "@/components/studio/WishlistButton";
import type { Studio } from "@/types";

export default function StudioCard({ studio }: { studio: Studio }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative">
        <StudioImage
          src={studio.imageUrl}
          alt={studio.title}
          className="h-52 w-full"
        />
        <span className="badge badge-primary absolute left-3 top-3">
          {studio.category}
        </span>
        <span className="badge absolute right-3 top-3 gap-1 border-0 bg-base-100/90">
          <FaStar className="text-warning" />
          {studio.rating > 0 ? studio.rating.toFixed(1) : "New"}
        </span>
        <WishlistButton studioId={studio._id} />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-1 text-lg font-bold">{studio.title}</h3>
        <p className="flex items-center gap-2 text-sm opacity-70">
          <FaLocationDot className="shrink-0 text-primary" />
          <span className="line-clamp-1">{studio.location}</span>
        </p>
        <p className="text-xl font-bold text-primary">
          ${studio.hourlyRate}
          <span className="text-sm font-normal opacity-70"> / hr</span>
        </p>
        <Link
          href={`/studios/${studio._id}`}
          className="btn btn-primary mt-auto w-full"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}