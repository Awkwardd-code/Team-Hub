"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { useAuthStore } from "../../store/authStore";

export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setUser(data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-2xl font-semibold">Login</h1>
      <div>
        <label className="mb-1 block text-sm">Email</label>
        <input type="email" className="w-full rounded-lg border border-slate-300 px-3 py-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      </div>
      <div>
        <label className="mb-1 block text-sm">Password</label>
        <input type="password" className="w-full rounded-lg border border-slate-300 px-3 py-2" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button disabled={loading} className="w-full rounded-lg bg-sky-600 px-4 py-2 text-white">
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
