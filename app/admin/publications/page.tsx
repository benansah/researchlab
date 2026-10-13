import Link from "next/link";
import { createClient } from "../../../lib/supabase/server";
import { AdminPageShell, requireAdmin } from "../admin-page-shell";
import AdminNotice, { MissingTablesNotice } from "../notice";
import { createPublication } from "./actions";

export default async function PublicationsAdminPage(props: PageProps<"/admin/publications">) {
  await requireAdmin();
  const { saved, error } = (await props.searchParams) as { saved?: string; error?: string };

  const supabase = await createClient();
  const { data: publications, error: loadError } = await supabase
    .from("publications")
    .select("id, title, authors, venue, year, featured, published")
    .order("year", { ascending: false, nullsFirst: false })
    .order("title");

  return (
    <AdminPageShell eyebrow="Content / Publications" title="Publications" intro="Keep the research record current, searchable and useful to collaborators. Changes appear on the public site as soon as you save.">
      <section className="admin-editor-grid">
        <div className="admin-stack">
          <AdminNotice saved={saved} error={error} />
          {loadError ? (
            loadError.code === "PGRST205" ? <MissingTablesNotice migration="0004_publications_news.sql" /> : <p className="admin-error admin-notice">{loadError.message}</p>
          ) : (
            <ul className="admin-lab-list">
              {(publications ?? []).map((pub) => (
                <li key={pub.id}>
                  <Link href={`/admin/publications/${pub.id}`}>
                    <span>
                      <strong className="admin-list-title">{pub.title}</strong>
                      <small>{[pub.authors, pub.venue, pub.year].filter(Boolean).join(" · ") || "No details yet"}</small>
                    </span>
                    <span className="admin-lab-meta">
                      {pub.featured && <em className="is-live">Featured</em>}
                      <em className={pub.published ? "is-live" : ""}>{pub.published ? "Published" : "Draft"}</em>→
                    </span>
                  </Link>
                </li>
              ))}
              {publications?.length === 0 && <li className="admin-muted">No publications yet — add the first one.</li>}
            </ul>
          )}
        </div>

        <form action={createPublication} className="admin-editor-card admin-editor-side-form">
          <span className="admin-card-index">New publication</span>
          <label htmlFor="publication-title">Title</label>
          <textarea id="publication-title" name="title" rows={3} placeholder="Full publication title" required />
          <label htmlFor="publication-year">Year</label>
          <input id="publication-year" name="year" type="number" min={1950} max={2100} placeholder={String(new Date().getFullYear())} />
          <p className="admin-hint">You can add authors, the journal, a DOI and the lab on the next screen.</p>
          <button type="submit">Add publication</button>
        </form>
      </section>
    </AdminPageShell>
  );
}
