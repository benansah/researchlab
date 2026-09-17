import { AdminPageShell, DraftNotice, requireAdmin } from "../admin-page-shell";

export default async function ResearchUpdatesAdminPage() {
  await requireAdmin();

  return (
    <AdminPageShell eyebrow="Content / Research updates" title="Research updates" intro="Prepare stories, field notes and announcements for the public research feed.">
      <section className="admin-editor-grid">
        <form className="admin-editor-card">
          <DraftNotice />
          <label htmlFor="update-title">Title</label>
          <input id="update-title" name="title" placeholder="A clear headline for the update" />
          <label htmlFor="update-type">Content type</label>
          <select id="update-type" name="type" defaultValue="field-note"><option value="field-note">Field note</option><option value="announcement">Announcement</option><option value="lab-news">Lab news</option></select>
          <label htmlFor="update-summary">Summary</label>
          <textarea id="update-summary" name="summary" rows={5} placeholder="Write a short introduction..." />
          <button type="button" disabled>Save draft</button>
        </form>
        <aside className="admin-editor-side"><span className="admin-card-index">Publishing checklist</span><h2>Make the work easy to follow.</h2><ul><li>Use a specific, descriptive title.</li><li>Lead with what changed or was learned.</li><li>Add a publication or lab link where useful.</li></ul></aside>
      </section>
    </AdminPageShell>
  );
}
