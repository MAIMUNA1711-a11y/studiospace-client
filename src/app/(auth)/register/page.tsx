"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { authClient } from "@/lib/auth-client";
import { validatePassword } from "@/lib/validators";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", photo: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (key === "password") setPasswordError("");
    };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const pwError = validatePassword(form.password);
    if (pwError) {
      setPasswordError(pwError);
      toast.error(pwError);
      return;
    }

    setLoading(true);
    try {
      const photo = form.photo.trim();
      const { error: authError } = await authClient.signUp.email({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        ...(photo ? { image: photo } : {}),
      });

      if (authError) {
        const msg =
          authError.message || "Registration failed. Please try again.";
        setError(msg);
        toast.error(msg);
        return;
      }

      toast.success("Account created! Please log in.");
      router.push("/login");
    } catch (err) {
      console.error("Register error:", err);
      const msg = "Could not reach the auth server. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    const { error: authError } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
    if (authError) toast.error(authError.message || "Google sign-in failed.");
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4 py-10">
      <div className="card w-full border border-base-300 bg-base-100 shadow-xl">
        <div className="card-body gap-4">
          <h1 className="text-3xl font-bold text-primary">Create your account</h1>
          <p className="text-sm opacity-70">
            Join StudioSpace to book creative spaces or host your own.
          </p>

          {error && (
            <div role="alert" className="alert alert-error alert-soft text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Name</span>
              <input
                required
                value={form.name}
                onChange={update("name")}
                placeholder="Your full name"
                className="input input-bordered w-full"
                autoComplete="name"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">Email</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={update("email")}
                placeholder="you@example.com"
                className="input input-bordered w-full"
                autoComplete="email"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">
                Photo URL <span className="opacity-60">(optional)</span>
              </span>
              <input
                type="url"
                value={form.photo}
                onChange={update("photo")}
                placeholder="https://example.com/your-photo.jpg"
                className="input input-bordered w-full"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">Password</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={update("password")}
                  placeholder="Min 6 chars, upper and lower case"
                  className={`input input-bordered w-full pr-11 ${passwordError ? "input-error" : ""}`}
                  autoComplete="new-password"
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
              {passwordError && (
                <span className="mt-1 block text-sm text-error">{passwordError}</span>
              )}
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? <span className="loading loading-spinner" /> : "Register"}
            </button>
          </form>

          <div className="divider my-0 text-xs">OR</div>

          <button onClick={handleGoogle} className="btn btn-outline w-full">
            <FcGoogle className="text-xl" /> Continue with Google
          </button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="link link-primary font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}