import { AdminPageShell, DraftNotice, requireAdmin } from "../admin-page-shell";

export default async function PublicationsAdminPage() {
  await requireAdmin();

  return (
    <AdminPageShell eyebrow="Content / Publications" title="Publications" intro="Keep the research record current, searchable and useful to collaborators.">
      <section className="admin-editor-grid">
        <form className="admin-editor-card">
          <DraftNotice />
          <label htmlFor="publication-title">Publication title</label>
          <input id="publication-title" name="title" placeholder="Full publication title" />
          <label htmlFor="publication-authors">Authors</label>
          <input id="publication-authors" name="authors" placeholder="Author names, separated by commas" />
          <div className="admin-form-row"><div><label htmlFor="publication-year">Year</label><input id="publication-year" name="year" inputMode="numeric" placeholder="2026" /></div><div><label htmlFor="publication-doi">DOI or URL</label><input id="publication-doi" name="doi" placeholder="https://doi.org/..." /></div></div>
          <label htmlFor="publication-abstract">Abstract or short description</label>
          <textarea id="publication-abstract" name="abstract" rows={5} placeholder="Add a concise description..." />
          <button type="button" disabled>Save publication</button>
        </form>
        <aside className="admin-editor-side"><span className="admin-card-index">Record details</span><h2>Evidence should be discoverable.</h2><p>Use the canonical title, complete author list and a working DOI link so visitors can find the original work.</p></aside>
      </section>
    </AdminPageShell>
  );
}
