"use client";

export default function StudioDetailsError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-bold text-primary">Could not load this studio</h1>
      <p className="opacity-70">
        We could not reach the server. Check your connection and try again.
      </p>
      <button onClick={reset} className="btn btn-primary">
        Try again
      </button>
    </div>
  );
}