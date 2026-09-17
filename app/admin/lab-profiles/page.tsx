import { AdminPageShell, DraftNotice, requireAdmin } from "../admin-page-shell";

export default async function LabProfilesAdminPage() {
  await requireAdmin();

  return (
    <AdminPageShell eyebrow="Content / Lab profiles" title="Lab profiles" intro="Keep each lab's focus, people and contact details ready for the public site.">
      <section className="admin-editor-grid">
        <form className="admin-editor-card">
          <DraftNotice />
          <label htmlFor="lab-name">Lab name</label>
          <input id="lab-name" name="name" placeholder="Harley Lab" />
          <label htmlFor="lab-focus">Research focus</label>
          <input id="lab-focus" name="focus" placeholder="Phytomedicine" />
          <label htmlFor="lab-summary">Public summary</label>
          <textarea id="lab-summary" name="summary" rows={5} placeholder="Describe the lab's work..." />
          <label htmlFor="lab-contact">Contact email</label>
          <input id="lab-contact" name="contact" type="email" placeholder="lab@uhas.edu.gh" />
          <button type="button" disabled>Save lab profile</button>
        </form>
        <aside className="admin-editor-side"><span className="admin-card-index">Profile guidance</span><h2>Give every lab a clear point of view.</h2><p>Keep the summary specific enough to distinguish the lab, while showing how it connects to the Centre&apos;s wider work.</p></aside>
      </section>
    </AdminPageShell>
  );
}
