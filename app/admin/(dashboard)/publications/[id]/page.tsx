import { notFound } from "next/navigation";
import type { Publication } from "../../../../../lib/publications";
import { createClient } from "../../../../../lib/supabase/server";
import { EditorForm, PublishPanel, Row, Section, SelectField, SwitchField, TextAreaField, TextField } from "../../../_components/editor";
import PageHeader from "../../../_components/page-header";
import { requireAdmin } from "../../../auth";
import { deletePublication, updatePublication } from "../actions";

export default async function EditPublicationPage(props: PageProps<"/admin/publications/[id]">) {
  await requireAdmin();
  const { id } = await props.params;

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
    <>
      <PageHeader
        crumbs={[{ name: "Admin", href: "/admin" }, { name: "Publications", href: "/admin/publications" }, { name: pub.title }]}
        title="Edit publication"
        description="Everything here appears in the publications list on the Research page and the linked lab's profile."
      />
      <div className="p-4 md:p-8">
        <EditorForm
          action={updatePublication}
          id={pub.id}
          aside={
            <PublishPanel
              published={pub.published}
              publishLabel="Published"
              publishHint="Show on the Research page and in site search."
              viewHref="/research#publications"
              saveLabel="Save publication"
              extra={<SwitchField name="featured" label="Featured" hint="Feature on the home page." defaultChecked={pub.featured} />}
              remove={{ action: deletePublication, fields: { id: pub.id }, title: "Delete this publication?", description: "It will be removed from the site. This cannot be undone.", label: "Delete publication" }}
              notes={<><p>Use the <strong>canonical title</strong>, the complete author list and a working DOI.</p><p>You can paste a bare DOI (10.xxxx/…); it becomes a link automatically.</p></>}
            />
          }
        >
          <Section title="Citation">
            <TextAreaField name="title" label="Title" rows={2} defaultValue={pub.title} required />
            <TextField name="authors" label="Authors" defaultValue={pub.authors} placeholder="A. Mensah, K. Boateng, E. Owusu" />
            <div className="grid gap-5 sm:grid-cols-[140px_1fr]">
              <TextField name="year" label="Year" type="number" min={1950} max={2100} defaultValue={pub.year ?? ""} />
              <TextField name="venue" label="Journal or venue" defaultValue={pub.venue} placeholder="e.g. Journal of Ethnopharmacology" />
            </div>
            <TextAreaField name="abstract" label="Abstract or short description" rows={5} defaultValue={pub.abstract} placeholder="Optional — visitors can expand it under the citation" />
          </Section>

          <Section title="Links">
            <Row>
              <TextField name="doi_url" label="DOI or article link" defaultValue={pub.doi_url} placeholder="10.1016/… or https://…" />
              <TextField name="pdf_url" label="PDF link" defaultValue={pub.pdf_url} placeholder="https://… (optional)" hint="Only if the paper is open access or you may share it." />
            </Row>
          </Section>

          <Section title="Classification">
            <Row>
              <div>
                <TextField name="tag" label="Topic" list="publication-tags" defaultValue={pub.tag} placeholder="e.g. Pharmacology" hint="Topics become the filter buttons on the Research page." />
                <datalist id="publication-tags">{tags.map((tag) => <option key={tag} value={tag} />)}</datalist>
              </div>
              <SelectField
                name="lab_id"
                label="Lab"
                defaultValue={pub.lab_id ?? ""}
                emptyLabel="Not linked to a lab"
                options={(labs ?? []).map((lab) => ({ value: lab.id, label: lab.name }))}
                hint="Linked papers also appear on the lab's profile."
              />
            </Row>
          </Section>
        </EditorForm>
      </div>
    </>
  );
}
