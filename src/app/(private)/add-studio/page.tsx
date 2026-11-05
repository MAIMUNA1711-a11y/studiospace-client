"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { privateRequest } from "@/lib/privateApi";
import StudioForm, { type StudioPayload } from "@/components/studio/StudioForm";
import type { Studio } from "@/types";

export default function AddStudioPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  async function handleCreate(payload: StudioPayload) {
    await privateRequest<Studio>("/studios", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    toast.success("Your studio is now listed!");
    router.push("/my-listings");
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-primary sm:text-4xl">Add New Studio</h1>
      <p className="mb-8 mt-2 opacity-70">
        Share your creative space with filmmakers, photographers, podcasters and musicians.
      </p>
      <StudioForm
        hostName={session?.user.name ?? ""}
        hostEmail={session?.user.email ?? ""}
        submitLabel="Publish Studio"
        onSubmit={handleCreate}
      />
    </main>
  );
}