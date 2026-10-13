import Link from "next/link";
import { createClient } from "../../../lib/supabase/server";
import { AdminPageShell, requireAdmin } from "../admin-page-shell";
import { createLab } from "./actions";
import AdminNotice, { MissingTablesNotice } from "../notice";

export default async function LabProfilesAdminPage(props: PageProps<"/admin/lab-profiles">) {
  await requireAdmin();
  const { saved, error } = (await props.searchParams) as { saved?: string; error?: string };

  const supabase = await createClient();
  const { data: labs, error: loadError } = await supabase
    .from("labs")
    .select("id, slug, name, tagline, lead_name, published, lab_members(count)")
    .order("sort_order");

  return (
    <AdminPageShell eyebrow="Content / Lab profiles" title="Lab profiles" intro="Keep each lab's objective, lead and students up to date. Changes appear on the public site as soon as you save.">
      <section className="admin-editor-grid">
        <div className="admin-stack">
          <AdminNotice saved={saved} error={error} />
          {loadError ? (
            loadError.code === "PGRST205" ? <MissingTablesNotice migration="0001_labs.sql" /> : <p className="admin-error admin-notice">{loadError.message}</p>
          ) : (
            <ul className="admin-lab-list">
              {(labs ?? []).map((lab) => (
                <li key={lab.id}>
                  <Link href={`/admin/lab-profiles/${lab.id}`}>
                    <span>
                      <strong>{lab.name}</strong>
                      <small>{[lab.lead_name, lab.tagline].filter(Boolean).join(" · ") || "No details yet"}</small>
                    </span>
                    <span className="admin-lab-meta">
                      <em className={lab.published ? "is-live" : ""}>{lab.published ? "Published" : "Draft"}</em>
                      {(lab.lab_members as unknown as { count: number }[])[0]?.count ?? 0} members →
                    </span>
                  </Link>
                </li>
              ))}
              {labs?.length === 0 && <li className="admin-muted">No labs yet — create the first one.</li>}
            </ul>
          )}
        </div>

        <form action={createLab} className="admin-editor-card admin-editor-side-form">
          <span className="admin-card-index">New lab</span>
          <label htmlFor="lab-name">Lab name</label>
          <input id="lab-name" name="name" placeholder="e.g. Mensah Lab" required />
          <label htmlFor="lab-slug">Web address (optional)</label>
          <input id="lab-slug" name="slug" placeholder="mensah-lab" pattern="[a-z0-9\-]*" />
          <p className="admin-hint">The lab will live at /labs/&lt;address&gt;. Leave blank to generate it from the name.</p>
          <button type="submit">Create lab</button>
        </form>
      </section>
    </AdminPageShell>
  );
}
