import Link from "next/link";
import { notFound } from "next/navigation";
import type { GardenPlant } from "../../../../lib/garden";
import { createClient } from "../../../../lib/supabase/server";
import { AdminPageShell, requireAdmin } from "../../admin-page-shell";
import ConfirmButton from "../../confirm-button";
import AdminNotice from "../../notice";
import { deletePlant, updatePlant } from "../actions";

export default async function EditPlantPage(props: PageProps<"/admin/garden/[id]">) {
  await requireAdmin();
  const { id } = await props.params;
  const { saved, error } = (await props.searchParams) as { saved?: string; error?: string };

  const supabase = await createClient();
  const [{ data, error: loadError }, { data: labs }, { data: categoryRows }] = await Promise.all([
    supabase.from("garden_plants").select("*").eq("id", id).maybeSingle(),
    supabase.from("labs").select("id, name").order("sort_order"),
    supabase.from("garden_plants").select("category"),
  ]);
  if (loadError) throw new Error(loadError.message);
  if (!data) notFound();

  const plant = data as GardenPlant;
  const categories = [...new Set((categoryRows ?? []).map((row) => row.category as string).filter(Boolean))].sort();

  return (
    <AdminPageShell eyebrow="Content / Physic garden" title={plant.botanical_name} intro="Everything on this page appears on the plant's card in the garden catalogue.">
      <section className="admin-editor-grid">
        <div className="admin-stack">
          <AdminNotice saved={saved} error={error} />

          <form action={updatePlant} className="admin-editor-card">
            <input type="hidden" name="id" value={plant.id} />

            <h2 className="admin-form-heading">Identification</h2>
            <div className="admin-form-row admin-form-row--even">
              <div><label htmlFor="botanical_name">Botanical name</label><input id="botanical_name" name="botanical_name" defaultValue={plant.botanical_name} required /></div>
              <div><label htmlFor="family">Family</label><input id="family" name="family" defaultValue={plant.family} placeholder="e.g. Moringaceae" /></div>
            </div>
            <div className="admin-form-row admin-form-row--even">
              <div><label htmlFor="common_name">Common name</label><input id="common_name" name="common_name" defaultValue={plant.common_name} /></div>
              <div><label htmlFor="local_names">Local names</label><input id="local_names" name="local_names" defaultValue={plant.local_names} placeholder="e.g. Nibima (Twi)" /></div>
            </div>
            <label htmlFor="category">Category</label>
            <input id="category" name="category" list="plant-categories" defaultValue={plant.category} placeholder="e.g. Antimalarial & fever" />
            <datalist id="plant-categories">
              {categories.map((category) => <option key={category} value={category} />)}
            </datalist>
            <p className="admin-hint">Categories become the filter buttons on the public catalogue. Reuse an existing one where possible.</p>

            <h2 className="admin-form-heading">Medicinal use</h2>
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" rows={4} defaultValue={plant.description} placeholder="What the plant is and how it is used" />
            <div className="admin-form-row admin-form-row--even">
              <div>
                <label htmlFor="parts_used">Parts used <span>one per line</span></label>
                <textarea id="parts_used" name="parts_used" rows={4} defaultValue={plant.parts_used.join("\n")} />
              </div>
              <div>
                <label htmlFor="traditional_uses">Traditional uses <span>one per line</span></label>
                <textarea id="traditional_uses" name="traditional_uses" rows={4} defaultValue={plant.traditional_uses.join("\n")} />
              </div>
            </div>

            <h2 className="admin-form-heading">Research</h2>
            <label htmlFor="lab_id">Studied by</label>
            <select id="lab_id" name="lab_id" defaultValue={plant.lab_id ?? ""}>
              <option value="">Not linked to a lab</option>
              {(labs ?? []).map((lab) => <option key={lab.id} value={lab.id}>{lab.name}</option>)}
            </select>
            <label htmlFor="research_notes">Research notes</label>
            <textarea id="research_notes" name="research_notes" rows={3} defaultValue={plant.research_notes} placeholder="How the plant features in current research (optional)" />

            <h2 className="admin-form-heading">Display</h2>
            <label htmlFor="photo_url">Photo</label>
            <input id="photo_url" name="photo_url" defaultValue={plant.photo_url} placeholder="https://… or /garden/my-photo.jpg" />
            <div className="admin-form-row admin-form-row--even">
              <div><label htmlFor="photo_credit">Photo credit</label><input id="photo_credit" name="photo_credit" defaultValue={plant.photo_credit ?? ""} placeholder="Photographer / licence" /></div>
              <div><label htmlFor="photo_credit_url">Credit link</label><input id="photo_credit_url" name="photo_credit_url" type="url" defaultValue={plant.photo_credit_url ?? ""} placeholder="https://…" /></div>
            </div>
            <div className="admin-form-row admin-form-row--even">
              <div><label htmlFor="sort_order">Display order</label><input id="sort_order" name="sort_order" type="number" defaultValue={plant.sort_order} /></div>
              <div className="admin-checkbox">
                <input id="published" name="published" type="checkbox" defaultChecked={plant.published} />
                <label htmlFor="published">Published in the catalogue</label>
              </div>
            </div>

            <div className="admin-actions">
              <button type="submit">Save plant</button>
              <ConfirmButton formAction={deletePlant} message={`Delete ${plant.botanical_name}? This cannot be undone.`} className="admin-danger">
                Delete plant
              </ConfirmButton>
            </div>
          </form>
        </div>

        <aside className="admin-editor-side">
          <span className="admin-card-index">{plant.published ? "Published" : "Draft"}</span>
          <h2>{plant.published ? "In the catalogue." : "Not visible yet."}</h2>
          <p>
            {plant.published
              ? "Visitors can find this plant in the Physic Garden catalogue."
              : "Tick “Published” and save when the entry is ready for visitors."}
          </p>
          {plant.published && plant.slug && <p><Link className="admin-side-link" href={`/physicgarden/${plant.slug}`} target="_blank">View the plant page ↗</Link></p>}
          <p>Use the accepted botanical name; it is shown in italics automatically and sets the page address. Credit the photographer whenever you use someone else&apos;s photo. Traditional uses are displayed with a note that they are not medical advice.</p>
          <p><Link className="admin-side-link" href="/admin/garden">← All plants</Link></p>
        </aside>
      </section>
    </AdminPageShell>
  );
}
