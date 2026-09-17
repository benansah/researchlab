import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

async function signOut() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <main className="admin-dashboard">
      <header className="admin-dashboard-header">
        <Link className="admin-dashboard-brand" href="/">R<span>/</span>L <strong>RESEARCH LAB</strong></Link>
        <form action={signOut}><button className="admin-signout" type="submit">Sign out</button></form>
      </header>
      <section className="admin-dashboard-intro">
        <p className="admin-kicker">Admin workspace</p>
        <h1>Good to see you.</h1>
        <p className="admin-muted">You are signed in as {user.email}.</p>
      </section>
      <section className="admin-dashboard-grid">
        <article><span className="admin-card-index">01</span><h2>Research updates</h2><p>Prepare the next story from the lab for publication.</p><Link className="admin-card-link" href="/admin/research-updates">Open workspace ↗</Link></article>
        <article><span className="admin-card-index">02</span><h2>Publications</h2><p>Keep the research record current and easy to explore.</p><Link className="admin-card-link" href="/admin/publications">Open workspace ↗</Link></article>
        <article><span className="admin-card-index">03</span><h2>Lab profiles</h2><p>Update people, focus areas and opportunities.</p><Link className="admin-card-link" href="/admin/lab-profiles">Open workspace ↗</Link></article>
      </section>
    </main>
  );
}
