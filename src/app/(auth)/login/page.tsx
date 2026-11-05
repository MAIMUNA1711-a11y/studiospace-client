"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { authClient } from "@/lib/auth-client";
import { safeRedirect } from "@/lib/validators";

function LoginForm() {
  const router = useRouter();
  const redirectTo = safeRedirect(useSearchParams().get("redirect"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: authError } = await authClient.signIn.email({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (authError) {
      const msg = authError.message || "Invalid email or password.";
      setError(msg);
      toast.error(msg);
      return;
    }
    toast.success("Welcome back to StudioSpace!");
    router.replace(redirectTo);
    router.refresh();
  }

  async function handleGoogle() {
    const { error: authError } = await authClient.signIn.social({
      provider: "google",
      callbackURL: redirectTo,
    });
    if (authError) toast.error(authError.message || "Google sign-in failed.");
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4 py-10">
      <div className="card w-full border border-base-300 bg-base-100 shadow-xl">
        <div className="card-body gap-4">
          <h1 className="text-3xl font-bold text-primary">Log in</h1>
          <p className="text-sm opacity-70">
            Pick up where you left off and book your next studio session.
          </p>

          {error && (
            <div role="alert" className="alert alert-error alert-soft text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="form-control w-full">
              <span className="mb-1 block text-sm font-medium">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input input-bordered w-full"
                autoComplete="email"
              />
            </label>

            <label className="form-control w-full">
              <span className="mb-1 block text-sm font-medium">Password</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="input input-bordered w-full pr-11"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </label>

            <div className="text-right">
              <button
                type="button"
                onClick={() =>
                  toast("Password reset is coming soon.", { icon: "🛠️" })
                }
                className="link link-hover text-sm"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? <span className="loading loading-spinner" /> : "Log in"}
            </button>
          </form>

          <div className="divider my-0 text-xs">OR</div>

          <button onClick={handleGoogle} className="btn btn-outline w-full">
            <FcGoogle className="text-xl" /> Continue with Google
          </button>

          <p className="text-center text-sm">
            New to StudioSpace?{" "}
            <Link href="/register" className="link link-primary font-semibold">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}