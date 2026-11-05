export default function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-3"
      role="status"
    >
      <span className="loading loading-ring loading-lg text-primary" />
      <span className="text-sm opacity-70">{label}…</span>
    </div>
  );
}