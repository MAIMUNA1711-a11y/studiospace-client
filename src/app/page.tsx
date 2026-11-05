import { getFeaturedStudios } from "@/lib/api";

export default async function Home() {
  let studios: Awaited<ReturnType<typeof getFeaturedStudios>> = [];
  let error = "";
  try {
    studios = await getFeaturedStudios();
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold text-primary">StudioSpace setup check</h1>
      {error ? (
        <p className="mt-4 text-error">{error}</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {studios.map((s) => (
            <li key={s._id} className="card bg-base-200 p-4">
              {s.title} · {s.category} · ${s.hourlyRate}/hr
            </li>
          ))}
        </ul>
      )}
      <button className="btn btn-primary mt-6">DaisyUI button</button>
    </main>
  );
}