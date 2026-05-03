"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <div>
        <label className="mb-1 block text-sm">Name</label>
        <input className="w-full rounded-lg border border-slate-300 px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </div>
      <div>
        <label className="mb-1 block text-sm">Email</label>
        <input type="email" className="w-full rounded-lg border border-slate-300 px-3 py-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      </div>
      <div>
        <label className="mb-1 block text-sm">Password</label>
        <input type="password" className="w-full rounded-lg border border-slate-300 px-3 py-2" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button disabled={loading} className="w-full rounded-lg bg-sky-600 px-4 py-2 text-white">
        {loading ? "Submitting..." : "Register"}
      </button>
    </form>
  );
}
