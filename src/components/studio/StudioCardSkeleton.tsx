export default function StudioCardSkeleton() {
  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-box border border-base-300 bg-base-100"
      aria-hidden="true"
    >
      <div className="skeleton h-52 w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-6 w-1/3" />
        <div className="skeleton mt-auto h-10 w-full" />
      </div>
    </div>
  );
}