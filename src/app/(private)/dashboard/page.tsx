"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { privateRequest } from "@/lib/privateApi";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  async function testApi() {
    try {
      await privateRequest("/auth/verify");
      toast.success("Express verified your JWT successfully.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "API test failed");
    }
  }

  async function logout() {
    await authClient.signOut();
    toast.success("Logged out.");
    router.replace("/login");
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold text-primary">Dashboard (test)</h1>
      <p className="mt-3">
        Logged in as <b>{session?.user.name}</b> ({session?.user.email})
      </p>
      <div className="mt-6 flex gap-3">
        <button onClick={testApi} className="btn btn-primary">
          Test JWT with Express
        </button>
        <button onClick={logout} className="btn btn-outline">
          Logout
        </button>
      </div>
    </main>
  );
}