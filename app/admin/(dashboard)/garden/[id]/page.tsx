import { notFound } from "next/navigation";
import { ImageIcon } from "lucide-react";
import type { GardenPlant } from "../../../../../lib/garden";
import { createClient } from "../../../../../lib/supabase/server";
import { EditorForm, ListField, PublishPanel, Row, Section, SelectField, TextAreaField, TextField } from "../../../_components/editor";
import PageHeader from "../../../_components/page-header";
import { requireAdmin } from "../../../auth";
import { deletePlant, updatePlant } from "../actions";

export default async function EditPlantPage(props: PageProps<"/admin/garden/[id]">) {
  await requireAdmin();
  const { id } = await props.params;

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
    <>
      <PageHeader
        crumbs={[{ name: "Admin", href: "/admin" }, { name: "Physic garden", href: "/admin/garden" }, { name: plant.botanical_name }]}
        title={<i>{plant.botanical_name}</i>}
        description="Everything here appears on the plant's card in the garden catalogue and on its own page."
      />
      <div className="p-4 md:p-8">
        <EditorForm
          action={updatePlant}
          id={plant.id}
          aside={
            <PublishPanel
              published={plant.published}
              publishLabel="Published"
              publishHint="Show this plant in the Physic Garden catalogue."
              viewHref={`/physicgarden/${plant.slug}`}
              saveLabel="Save plant"
              remove={{ action: deletePlant, fields: { id: plant.id }, title: `Delete ${plant.botanical_name}?`, description: "The plant will be removed from the catalogue. This cannot be undone.", label: "Delete plant" }}
              notes={
                <>
                  <p>Use the <strong>accepted botanical name</strong>; it is italicised automatically and sets the page address.</p>
                  <p>Credit the photographer whenever you use someone else&apos;s photo.</p>
                  <p>Traditional uses are shown with a note that they are not medical advice.</p>
                </>
              }
            />
          }
        >
          <Section title="Identification">
            <Row>
              <TextField name="botanical_name" label="Botanical name" defaultValue={plant.botanical_name} required className="italic" />
              <TextField name="family" label="Family" defaultValue={plant.family} placeholder="e.g. Moringaceae" />
            </Row>
            <Row>
              <TextField name="common_name" label="Common name" defaultValue={plant.common_name} />
              <TextField name="local_names" label="Local names" defaultValue={plant.local_names} placeholder="e.g. Nibima (Twi)" />
            </Row>
            <div>
              <TextField name="category" label="Category" list="plant-categories" defaultValue={plant.category} placeholder="e.g. Antimalarial & fever" hint="Categories become the filter buttons on the catalogue. Reuse an existing one where possible." />
              <datalist id="plant-categories">{categories.map((category) => <option key={category} value={category} />)}</datalist>
            </div>
          </Section>

          <Section title="Medicinal use">
            <TextAreaField name="description" label="Description" rows={4} defaultValue={plant.description} placeholder="What the plant is and how it is used" />
            <Row>
              <ListField name="parts_used" label="Parts used" values={plant.parts_used} />
              <ListField name="traditional_uses" label="Traditional uses" values={plant.traditional_uses} />
            </Row>
          </Section>

          <Section title="Research">
            <SelectField name="lab_id" label="Studied by" defaultValue={plant.lab_id ?? ""} emptyLabel="Not linked to a lab" options={(labs ?? []).map((lab) => ({ value: lab.id, label: lab.name }))} />
            <TextAreaField name="research_notes" label="Research notes" rows={3} defaultValue={plant.research_notes} placeholder="How the plant features in current research (optional)" />
          </Section>

          <Section title="Photo & display">
            <div className="grid gap-5 sm:grid-cols-[160px_1fr]">
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-muted ring-1 ring-foreground/10">
                {plant.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={plant.photo_url} alt="" className="size-full object-cover" />
                ) : (
                  <ImageIcon className="size-8 text-muted-foreground" />
                )}
              </div>
              <div className="grid content-start gap-5">
                <TextField name="photo_url" label="Photo" defaultValue={plant.photo_url} placeholder="https://… or /garden/my-photo.jpg" hint="Save to update the preview." />
                <Row>
                  <TextField name="photo_credit" label="Photo credit" defaultValue={plant.photo_credit ?? ""} placeholder="Photographer / licence" />
                  <TextField name="photo_credit_url" label="Credit link" type="url" defaultValue={plant.photo_credit_url ?? ""} placeholder="https://…" />
                </Row>
              </div>
            </div>
            <Row>
              <TextField name="sort_order" label="Display order" type="number" defaultValue={plant.sort_order} hint="Lower numbers appear first." />
            </Row>
          </Section>
        </EditorForm>
      </div>
    </>
  );
}
