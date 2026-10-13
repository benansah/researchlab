import Link from "next/link";
import { createClient } from "../../../lib/supabase/server";
import { AdminPageShell, requireAdmin } from "../admin-page-shell";
import AdminNotice, { MissingTablesNotice } from "../notice";
import { createPlant } from "./actions";

export default async function GardenAdminPage(props: PageProps<"/admin/garden">) {
  await requireAdmin();
  const { saved, error } = (await props.searchParams) as { saved?: string; error?: string };

  const supabase = await createClient();
  const { data: plants, error: loadError } = await supabase
    .from("garden_plants")
    .select("id, botanical_name, common_name, family, category, published")
    .order("sort_order")
    .order("botanical_name");

  return (
    <AdminPageShell eyebrow="Content / Physic garden" title="Physic garden" intro="Manage the plants shown in the garden catalogue. Changes appear on the public site as soon as you save.">
      <section className="admin-editor-grid">
        <div className="admin-stack">
          <AdminNotice saved={saved} error={error} />
          {loadError ? (
            loadError.code === "PGRST205" ? <MissingTablesNotice migration="0002_garden.sql" /> : <p className="admin-error admin-notice">{loadError.message}</p>
          ) : (
            <ul className="admin-lab-list">
              {(plants ?? []).map((plant) => (
                <li key={plant.id}>
                  <Link href={`/admin/garden/${plant.id}`}>
                    <span>
                      <strong><i>{plant.botanical_name}</i></strong>
                      <small>{[plant.common_name, plant.family, plant.category].filter(Boolean).join(" · ") || "No details yet"}</small>
                    </span>
                    <span className="admin-lab-meta">
                      <em className={plant.published ? "is-live" : ""}>{plant.published ? "Published" : "Draft"}</em>→
                    </span>
                  </Link>
                </li>
              ))}
              {plants?.length === 0 && <li className="admin-muted">No plants yet — add the first one.</li>}
            </ul>
          )}
        </div>

        <form action={createPlant} className="admin-editor-card admin-editor-side-form">
          <span className="admin-card-index">New plant</span>
          <label htmlFor="botanical_name">Botanical name</label>
          <input id="botanical_name" name="botanical_name" placeholder="e.g. Moringa oleifera" required />
          <label htmlFor="common_name">Common name</label>
          <input id="common_name" name="common_name" placeholder="e.g. Moringa" />
          <p className="admin-hint">You can add uses, photos and research links on the next screen.</p>
          <button type="submit">Add plant</button>
        </form>
      </section>
    </AdminPageShell>
  );
}
