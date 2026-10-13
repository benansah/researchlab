import Link from "next/link";
import { notFound } from "next/navigation";
import type { Lab } from "../../../../lib/labs";
import { createClient } from "../../../../lib/supabase/server";
import { AdminPageShell, requireAdmin } from "../../admin-page-shell";
import { addMember, deleteLab, deleteMember, updateLab, updateMember } from "../actions";
import ConfirmButton from "../../confirm-button";
import AdminNotice from "../../notice";

export default async function EditLabPage(props: PageProps<"/admin/lab-profiles/[id]">) {
  await requireAdmin();
  const { id } = await props.params;
  const { saved, error } = (await props.searchParams) as { saved?: string; error?: string };

  const supabase = await createClient();
  const { data, error: loadError } = await supabase.from("labs").select("*, lab_members(*)").eq("id", id).maybeSingle();
  if (loadError) throw new Error(loadError.message);
  if (!data) notFound();

  const lab = data as Lab;
  const members = [...lab.lab_members].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <AdminPageShell eyebrow="Content / Lab profiles" title={lab.name} intro="Everything on this page appears on the lab's public profile.">
      <section className="admin-editor-grid">
        <div className="admin-stack">
          <AdminNotice saved={saved} error={error} />

          <form action={updateLab} className="admin-editor-card">
            <input type="hidden" name="id" value={lab.id} />

            <h2 className="admin-form-heading">Overview</h2>
            <div className="admin-form-row">
              <div><label htmlFor="name">Lab name</label><input id="name" name="name" defaultValue={lab.name} required /></div>
              <div><label htmlFor="slug">Web address</label><input id="slug" name="slug" defaultValue={lab.slug} pattern="[a-z0-9\-]+" required /></div>
            </div>
            <label htmlFor="tagline">Tagline</label>
            <input id="tagline" name="tagline" defaultValue={lab.tagline} placeholder="One line on what the lab does" />
            <label htmlFor="objective">Research objective</label>
            <textarea id="objective" name="objective" rows={3} defaultValue={lab.objective} placeholder="The lab's overarching goal, in a sentence or two" />
            <label htmlFor="summary">Summary</label>
            <textarea id="summary" name="summary" rows={4} defaultValue={lab.summary} placeholder="A short paragraph introducing the lab" />

            <h2 className="admin-form-heading">Research</h2>
            <label htmlFor="aims">Specific aims <span>one per line</span></label>
            <textarea id="aims" name="aims" rows={4} defaultValue={lab.aims.join("\n")} />
            <div className="admin-form-row admin-form-row--even">
              <div>
                <label htmlFor="research_areas">Research areas <span>one per line</span></label>
                <textarea id="research_areas" name="research_areas" rows={4} defaultValue={lab.research_areas.join("\n")} />
              </div>
              <div>
                <label htmlFor="techniques">Techniques &amp; capabilities <span>one per line</span></label>
                <textarea id="techniques" name="techniques" rows={4} defaultValue={lab.techniques.join("\n")} />
              </div>
            </div>

            <h2 className="admin-form-heading">Lab lead</h2>
            <div className="admin-form-row admin-form-row--even">
              <div><label htmlFor="lead_name">Name</label><input id="lead_name" name="lead_name" defaultValue={lab.lead_name} placeholder="Dr. Jane Doe" /></div>
              <div><label htmlFor="lead_title">Title</label><input id="lead_title" name="lead_title" defaultValue={lab.lead_title} placeholder="Senior Lecturer, Pharmacognosy" /></div>
            </div>
            <label htmlFor="lead_bio">Short bio</label>
            <textarea id="lead_bio" name="lead_bio" rows={3} defaultValue={lab.lead_bio} />
            <div className="admin-form-row admin-form-row--even">
              <div><label htmlFor="lead_email">Email</label><input id="lead_email" name="lead_email" type="email" defaultValue={lab.lead_email} /></div>
              <div><label htmlFor="lead_photo_url">Photo URL</label><input id="lead_photo_url" name="lead_photo_url" type="url" defaultValue={lab.lead_photo_url} placeholder="https://…" /></div>
            </div>

            <h2 className="admin-form-heading">Details</h2>
            <div className="admin-form-row admin-form-row--even">
              <div><label htmlFor="contact_email">Lab contact email</label><input id="contact_email" name="contact_email" type="email" defaultValue={lab.contact_email} /></div>
              <div><label htmlFor="location">Location</label><input id="location" name="location" defaultValue={lab.location} placeholder="School of Pharmacy, Block B" /></div>
            </div>
            <div className="admin-form-row admin-form-row--even">
              <div><label htmlFor="sort_order">Display order</label><input id="sort_order" name="sort_order" type="number" defaultValue={lab.sort_order} /></div>
              <div className="admin-checkbox">
                <input id="published" name="published" type="checkbox" defaultChecked={lab.published} />
                <label htmlFor="published">Published on the public site</label>
              </div>
            </div>

            <div className="admin-actions">
              <button type="submit">Save lab profile</button>
              <ConfirmButton formAction={deleteLab} message={`Delete ${lab.name} and all of its members? This cannot be undone.`} className="admin-danger">
                Delete lab
              </ConfirmButton>
            </div>
          </form>

          <div id="members" className="admin-editor-card">
            <h2 className="admin-form-heading">Students &amp; researchers <span>{members.length}</span></h2>
            {members.map((member) => (
              <form key={member.id} action={updateMember} className="admin-member-row">
                <input type="hidden" name="id" value={member.id} />
                <input type="hidden" name="lab_id" value={lab.id} />
                <input name="name" aria-label="Name" defaultValue={member.name} required />
                <input name="role" aria-label="Role" defaultValue={member.role} placeholder="Role, e.g. PhD Candidate" />
                <input name="research_topic" aria-label="Research topic" defaultValue={member.research_topic} placeholder="Research topic" className="admin-member-wide" />
                <input name="email" aria-label="Email" type="email" defaultValue={member.email} placeholder="Email" />
                <input name="photo_url" aria-label="Photo URL" type="url" defaultValue={member.photo_url} placeholder="Photo URL" />
                <input name="sort_order" aria-label="Order" type="number" defaultValue={member.sort_order} className="admin-member-order" />
                <div className="admin-member-buttons">
                  <button type="submit">Save</button>
                  <ConfirmButton formAction={deleteMember} message={`Remove ${member.name} from ${lab.name}?`} className="admin-danger">Remove</ConfirmButton>
                </div>
              </form>
            ))}

            <form action={addMember} className="admin-member-row admin-member-row--new">
              <input type="hidden" name="lab_id" value={lab.id} />
              <span className="admin-card-index">Add a member</span>
              <input name="name" aria-label="Name" placeholder="Full name" required />
              <input name="role" aria-label="Role" placeholder="Role, e.g. MPhil Student" />
              <input name="research_topic" aria-label="Research topic" placeholder="Research topic" className="admin-member-wide" />
              <input name="email" aria-label="Email" type="email" placeholder="Email (optional)" />
              <input name="photo_url" aria-label="Photo URL" type="url" placeholder="Photo URL (optional)" />
              <input name="sort_order" aria-label="Order" type="number" defaultValue={members.length + 1} className="admin-member-order" />
              <div className="admin-member-buttons"><button type="submit">Add member</button></div>
            </form>
          </div>
        </div>

        <aside className="admin-editor-side">
          <span className="admin-card-index">{lab.published ? "Published" : "Draft"}</span>
          <h2>{lab.published ? "This lab is live." : "Not visible yet."}</h2>
          <p>
            {lab.published
              ? "Visitors can see this profile, and it appears in the Labs menu and on the homepage."
              : "Tick “Published” and save when the profile is ready for visitors."}
          </p>
          {lab.published && <p><Link className="admin-side-link" href={`/labs/${lab.slug}`} target="_blank">View public page ↗</Link></p>}
          <p>Lists such as aims and techniques take one item per line. Photos can be any public image link.</p>
          <p><Link className="admin-side-link" href="/admin/lab-profiles">← All labs</Link></p>
        </aside>
      </section>
    </AdminPageShell>
  );
}
