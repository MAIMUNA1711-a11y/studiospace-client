"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { ApiRequestError, getStudio } from "@/lib/api";
import { privateRequest } from "@/lib/privateApi";
import StudioForm, { type StudioPayload } from "@/components/studio/StudioForm";
import Spinner from "@/components/ui/Spinner";
import type { Studio } from "@/types";

interface Loaded {
  id: string;
  studio: Studio | null;
  error: string;
}

export default function EditStudioPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    let cancelled = false;
    getStudio(id)
      .then((studio) => {
        if (!cancelled) setLoaded({ id, studio, error: "" });
      })
      .catch((e) => {
        if (cancelled) return;
        const notFound = e instanceof ApiRequestError && (e.status === 404 || e.status === 400);
        setLoaded({
          id,
          studio: null,
          error: notFound ? "This studio could not be found." : "Could not load the studio.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleUpdate(payload: StudioPayload) {
    await privateRequest<Studio>(`/studios/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    toast.success("Studio updated successfully.");
    router.push("/my-listings");
  }

  if (!loaded || loaded.id !== id) return <Spinner label="Loading studio" />;

  const studio = loaded.studio;
  const isOwner =
    !!studio && session?.user.email?.toLowerCase() === studio.ownerEmail.toLowerCase();

  if (!studio || !isOwner) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-3xl font-bold text-primary">
          {studio ? "You cannot edit this studio" : "Studio unavailable"}
        </h1>
        <p className="opacity-70">
          {studio ? "Only the host who listed this space can update it." : loaded.error}
        </p>
        <Link href="/my-listings" className="btn btn-primary">
          Back to My Listings
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-primary sm:text-4xl">Update Studio</h1>
      <p className="mb-8 mt-2 opacity-70">Edit the details of {studio.title}.</p>
      <StudioForm
        initial={studio}
        hostName={studio.ownerName}
        hostEmail={studio.ownerEmail}
        submitLabel="Save Changes"
        onSubmit={handleUpdate}
      />
    </main>
  );
}