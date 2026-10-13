"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setError("Supabase is not configured yet. Add the values from .env.example to .env.local.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("The email or password was not recognised.");
      setLoading(false);
      return;
    }

    const requestedPath = new URLSearchParams(window.location.search).get("next");
    router.push(requestedPath?.startsWith("/") ? requestedPath : "/admin");
    router.refresh();
  }

  return (
    <main className="admin-auth-page">
      <section className="admin-auth-card">
        <div className="admin-mark">R<span>/</span>L</div>
        <p className="admin-kicker">Research Lab / Secure area</p>
        <h1>Welcome back.</h1>
        <p className="admin-muted">Sign in to manage research updates, publications and lab content.</p>
        <form onSubmit={handleSubmit} className="admin-form">
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {error && <p className="admin-error" role="alert">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"} <span>↗</span></button>
        </form>
        <Link className="admin-back-link" href="/">← Return to public site</Link>
      </section>
    </main>
  );
}
