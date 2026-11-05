export default function StudioDetailsLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10" aria-busy="true">
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <div className="skeleton h-72 w-full sm:h-[26rem]" />
          <div className="skeleton h-5 w-40" />
          <div className="skeleton h-10 w-3/4" />
          <div className="skeleton h-4 w-1/3" />
          <div className="skeleton h-32 w-full" />
        </div>
        <div className="skeleton h-64 w-full" />
      </div>
    </main>
  );
}