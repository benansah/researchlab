import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return user;
}

export function AdminPageShell({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: React.ReactNode }) {
  return (
    <main className="admin-dashboard">
      <header className="admin-dashboard-header">
        <Link className="admin-dashboard-brand" href="/admin">R<span>/</span>L <strong>RESEARCH LAB / ADMIN</strong></Link>
        <nav className="admin-subnav" aria-label="Admin navigation">
          <Link href="/admin">Overview</Link><Link href="/admin/news">News</Link><Link href="/admin/publications">Publications</Link><Link href="/admin/lab-profiles">Labs</Link><Link href="/admin/garden">Garden</Link>
        </nav>
      </header>
      <section className="admin-dashboard-intro admin-section-intro">
        <Link className="admin-back-link" href="/admin">← Overview</Link>
        <p className="admin-kicker">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="admin-muted">{intro}</p>
      </section>
      {children}
    </main>
  );
}
