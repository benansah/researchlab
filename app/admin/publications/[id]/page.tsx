import Link from "next/link";
import { notFound } from "next/navigation";
import type { Publication } from "../../../../lib/publications";
import { createClient } from "../../../../lib/supabase/server";
import { AdminPageShell, requireAdmin } from "../../admin-page-shell";
import ConfirmButton from "../../confirm-button";
import AdminNotice from "../../notice";
import { deletePublication, updatePublication } from "../actions";

export default async function EditPublicationPage(props: PageProps<"/admin/publications/[id]">) {
  await requireAdmin();
  const { id } = await props.params;
  const { saved, error } = (await props.searchParams) as { saved?: string; error?: string };

  const supabase = await createClient();
  const [{ data, error: loadError }, { data: labs }, { data: tagRows }] = await Promise.all([
    supabase.from("publications").select("*").eq("id", id).maybeSingle(),
    supabase.from("labs").select("id, name").order("sort_order"),
    supabase.from("publications").select("tag"),
  ]);
  if (loadError) throw new Error(loadError.message);
  if (!data) notFound();

  const pub = data as Publication;
  const tags = [...new Set((tagRows ?? []).map((row) => row.tag as string).filter(Boolean))].sort();

  return (
    <AdminPageShell eyebrow="Content / Publications" title="Edit publication" intro="Everything on this page appears in the publications list on the Research page.">
      <section className="admin-editor-grid">
        <div className="admin-stack">
          <AdminNotice saved={saved} error={error} />

          <form action={updatePublication} className="admin-editor-card">
            <input type="hidden" name="id" value={pub.id} />

            <h2 className="admin-form-heading">Citation</h2>
            <label htmlFor="title">Title</label>
            <textarea id="title" name="title" rows={2} defaultValue={pub.title} required />
            <label htmlFor="authors">Authors</label>
            <input id="authors" name="authors" defaultValue={pub.authors} placeholder="A. Mensah, K. Boateng, E. Owusu" />
            <div className="admin-form-row">
              <div><label htmlFor="year">Year</label><input id="year" name="year" type="number" min={1950} max={2100} defaultValue={pub.year ?? ""} /></div>
              <div><label htmlFor="venue">Journal or venue</label><input id="venue" name="venue" defaultValue={pub.venue} placeholder="e.g. Journal of Ethnopharmacology" /></div>
            </div>
            <label htmlFor="abstract">Abstract or short description</label>
            <textarea id="abstract" name="abstract" rows={5} defaultValue={pub.abstract} placeholder="Optional — shown when visitors expand the entry" />

            <h2 className="admin-form-heading">Links</h2>
            <div className="admin-form-row admin-form-row--even">
              <div><label htmlFor="doi_url">DOI or article link</label><input id="doi_url" name="doi_url" defaultValue={pub.doi_url} placeholder="10.1016/… or https://…" /></div>
              <div><label htmlFor="pdf_url">PDF link</label><input id="pdf_url" name="pdf_url" defaultValue={pub.pdf_url} placeholder="https://… (optional)" /></div>
            </div>
            <p className="admin-hint">Only add a PDF link if the paper is open access or you have the right to share it.</p>

            <h2 className="admin-form-heading">Classification</h2>
            <div className="admin-form-row admin-form-row--even">
              <div>
                <label htmlFor="tag">Topic</label>
                <input id="tag" name="tag" list="publication-tags" defaultValue={pub.tag} placeholder="e.g. Pharmacology" />
                <datalist id="publication-tags">
                  {tags.map((tag) => <option key={tag} value={tag} />)}
                </datalist>
              </div>
              <div>
                <label htmlFor="lab_id">Lab</label>
                <select id="lab_id" name="lab_id" defaultValue={pub.lab_id ?? ""}>
                  <option value="">Not linked to a lab</option>
                  {(labs ?? []).map((lab) => <option key={lab.id} value={lab.id}>{lab.name}</option>)}
                </select>
              </div>
            </div>
            <p className="admin-hint">Topics become the filter buttons on the Research page. Linked papers also appear on the lab&apos;s profile.</p>
            <div className="admin-form-row admin-form-row--even">
              <div className="admin-checkbox">
                <input id="featured" name="featured" type="checkbox" defaultChecked={pub.featured} />
                <label htmlFor="featured">Feature on the home page</label>
              </div>
              <div className="admin-checkbox">
                <input id="published" name="published" type="checkbox" defaultChecked={pub.published} />
                <label htmlFor="published">Published on the site</label>
              </div>
            </div>

            <div className="admin-actions">
              <button type="submit">Save publication</button>
              <ConfirmButton formAction={deletePublication} message="Delete this publication? This cannot be undone." className="admin-danger">
                Delete publication
              </ConfirmButton>
            </div>
          </form>
        </div>

        <aside className="admin-editor-side">
          <span className="admin-card-index">{pub.published ? "Published" : "Draft"}</span>
          <h2>{pub.published ? "On the record." : "Not visible yet."}</h2>
          <p>
            {pub.published
              ? "Visitors can find this paper on the Research page and in site search."
              : "Tick “Published” and save when the entry is ready for visitors."}
          </p>
          {pub.published && <p><Link className="admin-side-link" href="/research#publications" target="_blank">View publications ↗</Link></p>}
          <p>Use the canonical title, the complete author list and a working DOI so visitors can find the original work. You can paste a bare DOI; it is turned into a link automatically.</p>
          <p><Link className="admin-side-link" href="/admin/publications">← All publications</Link></p>
        </aside>
      </section>
    </AdminPageShell>
  );
}
