import { TbAperture } from "react-icons/tb";

export default function Loading() {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-3"
      role="status"
    >
      <TbAperture className="animate-spin text-6xl text-primary" />
      <p className="text-sm opacity-70">Setting up the lights…</p>
    </div>
  );
}