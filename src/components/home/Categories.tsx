import Link from "next/link";
import { CATEGORY_META } from "@/lib/constants";
import SectionHeading from "@/components/ui/SectionHeading";
import { STUDIO_CATEGORIES } from "@/types";

export default function Categories() {
  return (
    <section className="bg-base-200 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          title="Browse by Category"
          subtitle="Pick the kind of space your project needs."
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {STUDIO_CATEGORIES.map((c) => {
            const { icon: Icon, blurb } = CATEGORY_META[c];
            return (
              <Link
                key={c}
                href={`/studios?category=${encodeURIComponent(c)}`}
                className="flex h-full flex-col items-center gap-3 rounded-box border border-base-300 bg-base-100 p-6 text-center transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-2xl text-primary">
                  <Icon />
                </span>
                <h3 className="font-bold">{c}</h3>
                <p className="text-xs opacity-70">{blurb}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}