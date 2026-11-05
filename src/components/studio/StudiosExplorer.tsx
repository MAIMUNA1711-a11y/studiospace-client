"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { getStudios } from "@/lib/api";
import StudioCard from "@/components/studio/StudioCard";
import StudioCardSkeleton from "@/components/studio/StudioCardSkeleton";
import Pagination from "@/components/ui/Pagination";
import {
  STUDIO_CATEGORIES,
  type Pagination as PaginationInfo,
  type Studio,
  type StudioFilters,
} from "@/types";

const PAGE_SIZE = 9;

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "rating", label: "Top rated" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "oldest", label: "Oldest first" },
] as const;

const RATINGS = [
  { value: "", label: "Any rating" },
  { value: "3", label: "3.0 and up" },
  { value: "4", label: "4.0 and up" },
  { value: "4.5", label: "4.5 and up" },
];

type FilterKey =
  | "search"
  | "category"
  | "minPrice"
  | "maxPrice"
  | "minRating"
  | "sort"
  | "page";

/** URL-er query theke sudhu valid value-gulo nei, jate backend-e 400 na jay. */
function parseFilters(sp: URLSearchParams): StudioFilters {
  const num = (key: FilterKey) => {
    const raw = sp.get(key);
    if (!raw) return undefined;
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : undefined;
  };
  const category = sp.get("category") ?? "";
  const sort = sp.get("sort") ?? "newest";
  return {
    search: sp.get("search")?.trim() || undefined,
    category: (STUDIO_CATEGORIES as readonly string[]).includes(category)
      ? category
      : undefined,
    minPrice: num("minPrice"),
    maxPrice: num("maxPrice"),
    minRating: Math.min(num("minRating") ?? 0, 5) || undefined,
    sort: SORTS.some((s) => s.value === sort)
      ? (sort as StudioFilters["sort"])
      : "newest",
    page: Math.max(1, Math.floor(num("page") ?? 1)),
    limit: PAGE_SIZE,
  };
}

function hasActiveFilters(f: StudioFilters) {
  return !!(
    f.search ||
    f.category ||
    f.minPrice !== undefined ||
    f.maxPrice !== undefined ||
    f.minRating
  );
}

interface Result {
  key: string;
  studios: Studio[];
  pagination: PaginationInfo | null;
  error: string;
}

function FilterForm({
  initial,
  onApply,
  onReset,
}: {
  initial: StudioFilters;
  onApply: (values: Record<string, string>) => void;
  onReset: () => void;
}) {
  const [search, setSearch] = useState(initial.search ?? "");
  const [category, setCategory] = useState(initial.category ?? "");
  const [sort, setSort] = useState(initial.sort ?? "newest");
  const [minPrice, setMinPrice] = useState(
    initial.minPrice !== undefined ? String(initial.minPrice) : "",
  );
  const [maxPrice, setMaxPrice] = useState(
    initial.maxPrice !== undefined ? String(initial.maxPrice) : "",
  );
  const [minRating, setMinRating] = useState(
    initial.minRating ? String(initial.minRating) : "",
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      toast.error("Minimum price cannot be higher than maximum price.");
      return;
    }
    onApply({ search: search.trim(), category, sort, minPrice, maxPrice, minRating });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-box border border-base-300 bg-base-100 p-5"
    >
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Search</span>
        <div className="relative">
          <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Title, location or amenity"
            className="input input-bordered w-full pl-9"
            maxLength={100}
          />
        </div>
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Category</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="select select-bordered w-full"
        >
          <option value="">All categories</option>
          {STUDIO_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <div>
        <span className="mb-1 block text-sm font-medium">Hourly rate ($)</span>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="input input-bordered w-full"
            aria-label="Minimum hourly rate"
          />
          <input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="input input-bordered w-full"
            aria-label="Maximum hourly rate"
          />
        </div>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Rating</span>
        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="select select-bordered w-full"
        >
          {RATINGS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Sort by</span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="select select-bordered w-full"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-2">
        <button type="submit" className="btn btn-primary">
          Apply
        </button>
        <button type="button" onClick={onReset} className="btn btn-outline">
          Reset
        </button>
      </div>
    </form>
  );
}

export default function StudiosExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const filters = parseFilters(searchParams);

  const [result, setResult] = useState<Result | null>(null);
  const loading = result?.key !== queryString;

  useEffect(() => {
    let cancelled = false;
    getStudios(parseFilters(new URLSearchParams(queryString)))
      .then((r) => {
        if (cancelled) return;
        setResult({
          key: queryString,
          studios: r.studios,
          pagination: r.pagination,
          error: "",
        });
      })
      .catch((e) => {
        if (cancelled) return;
        const message =
          e instanceof Error ? e.message : "Could not load studios.";
        toast.error(message);
        setResult({ key: queryString, studios: [], pagination: null, error: message });
      });
    return () => {
      cancelled = true;
    };
  }, [queryString]);

  function navigate(values: Record<string, string>) {
    const sp = new URLSearchParams();
    Object.entries(values).forEach(([k, v]) => {
      if (v && !(k === "sort" && v === "newest") && !(k === "page" && v === "1")) {
        sp.set(k, v);
      }
    });
    const qs = sp.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function goToPage(page: number) {
    const sp = new URLSearchParams(queryString);
    if (page <= 1) sp.delete("page");
    else sp.set("page", String(page));
    const qs = sp.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const studios = result?.studios ?? [];
  const pagination = result?.pagination;
  const active = hasActiveFilters(filters);

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <FilterForm
          key={queryString}
          initial={filters}
          onApply={navigate}
          onReset={() => router.push(pathname, { scroll: false })}
        />
      </aside>

      <section aria-live="polite">
        {!loading && pagination && studios.length > 0 && (
          <p className="mb-4 text-sm opacity-70">
            Showing {studios.length} of {pagination.total} studio
            {pagination.total === 1 ? "" : "s"}
            {filters.category ? ` in ${filters.category}` : ""}
          </p>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <StudioCardSkeleton key={i} />
            ))}
          </div>
        ) : result?.error ? (
          <div role="alert" className="alert alert-error alert-soft">
            <span>{result.error}</span>
            <button
              className="btn btn-sm"
              onClick={() => router.refresh()}
            >
              Try again
            </button>
          </div>
        ) : studios.length === 0 ? (
          <div className="rounded-box border border-dashed border-base-300 p-12 text-center">
            <FaMagnifyingGlass className="mx-auto mb-4 text-4xl text-primary opacity-70" />
            <h2 className="text-xl font-bold">
              {active ? "No studios match your filters" : "No studios listed yet"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm opacity-70">
              {active
                ? "Try a different keyword, widen your price range or clear the filters to see every space."
                : "Be the first host on StudioSpace and share your creative space."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {active && (
                <button
                  className="btn btn-primary"
                  onClick={() => router.push(pathname, { scroll: false })}
                >
                  Clear filters
                </button>
              )}
              <Link
                href="/add-studio"
                className={`btn ${active ? "btn-outline" : "btn-primary"}`}
              >
                Host Your Space
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {studios.map((s) => (
                <StudioCard key={s._id} studio={s} />
              ))}
            </div>
            <Pagination
              page={pagination?.page ?? 1}
              totalPages={pagination?.totalPages ?? 1}
              onChange={goToPage}
            />
          </>
        )}
      </section>
    </div>
  );
}