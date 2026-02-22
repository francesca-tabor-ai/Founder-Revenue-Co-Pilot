"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Invalid email or password");
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-white text-center mb-6">
          Sign in to Founder Revenue Co-Pilot
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          <div>
            <label htmlFor="email" className="block text-sm text-zinc-400 mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-zinc-400 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <p className="text-center text-sm text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-emerald-400 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
        <Link href="/" className="block text-center text-zinc-500 text-sm mt-4 hover:text-zinc-400">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-400">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
