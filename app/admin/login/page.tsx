"use client";

import { useState, FormEvent } from "react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Use window.location for full page reload so the cookie is picked up
        window.location.href = "/admin";
      } else {
        setError(data.error || data.message || "Login failed.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      if (!loading) return;
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">KP</div>
          <h1 className="mt-4 text-xl font-bold text-slate-900">Admin Login</h1>
          <p className="mt-1 text-sm text-slate-500">KaKa Patches</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm"
              placeholder="Enter username"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm"
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          <a href="/" className="hover:text-blue-600">← Back to website</a>
        </p>
      </div>
    </main>
  );
}
