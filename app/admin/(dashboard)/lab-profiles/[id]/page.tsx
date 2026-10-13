import { notFound } from "next/navigation";
import { PencilIcon, Trash2Icon, UserPlusIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { initials, type Lab, type LabMember } from "../../../../../lib/labs";
import { createClient } from "../../../../../lib/supabase/server";
import { EditorForm, ListField, PublishPanel, Row, Section, TextAreaField, TextField } from "../../../_components/editor";
import { ConfirmDelete, FormDialog } from "../../../_components/form-controls";
import PageHeader from "../../../_components/page-header";
import { requireAdmin } from "../../../auth";
import { addMember, deleteLab, deleteMember, updateLab, updateMember } from "../actions";

function MemberFields({ member, nextOrder }: { member?: LabMember; nextOrder: number }) {
  return (
    <div className="grid gap-5">
      <Row>
        <TextField name="name" label="Full name" defaultValue={member?.name} required autoFocus />
        <TextField name="role" label="Role" defaultValue={member?.role} placeholder="e.g. PhD Candidate" />
      </Row>
      <TextField name="research_topic" label="Research topic" defaultValue={member?.research_topic} />
      <Row>
        <TextField name="email" label="Email" type="email" defaultValue={member?.email} placeholder="Optional" />
        <TextField name="sort_order" label="Display order" type="number" defaultValue={member?.sort_order ?? nextOrder} />
      </Row>
      <TextField name="photo_url" label="Photo URL" type="url" defaultValue={member?.photo_url} placeholder="https://… (optional)" />
    </div>
  );
}

export default async function EditLabPage(props: PageProps<"/admin/lab-profiles/[id]">) {
  await requireAdmin();
  const { id } = await props.params;

  const supabase = await createClient();
  const { data, error: loadError } = await supabase.from("labs").select("*, lab_members(*)").eq("id", id).maybeSingle();
  if (loadError) throw new Error(loadError.message);
  if (!data) notFound();

  const lab = data as Lab;
  const members = [...lab.lab_members].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Admin", href: "/admin" }, { name: "Lab profiles", href: "/admin/lab-profiles" }, { name: lab.name }]}
        title={lab.name}
        description="Everything on this page appears on the lab's public profile."
      />
      <div className="grid gap-6 p-4 md:p-8">
        <EditorForm
          action={updateLab}
          id={lab.id}
          aside={
            <PublishPanel
              published={lab.published}
              publishLabel="Published"
              publishHint="Show this lab on the site, in the Labs menu and on the home page."
              viewHref={`/labs/${lab.slug}`}
              saveLabel="Save lab profile"
              remove={{ action: deleteLab, fields: { id: lab.id }, title: `Delete ${lab.name}?`, description: "The lab and all of its members will be removed. This cannot be undone.", label: "Delete lab" }}
              notes={<><p>Lists such as aims and techniques take <strong>one item per line</strong>.</p><p>Photos can be any public image link.</p></>}
            />
          }
        >
          <Section title="Overview" description="How the lab is introduced on its page and in lists.">
            <Row>
              <TextField name="name" label="Lab name" defaultValue={lab.name} required />
              <TextField name="slug" label="Web address" defaultValue={lab.slug} pattern="[a-z0-9\-]+" required hint={`/labs/${lab.slug}`} />
            </Row>
            <TextField name="tagline" label="Tagline" defaultValue={lab.tagline} placeholder="One line on what the lab does" />
            <TextAreaField name="objective" label="Research objective" rows={3} defaultValue={lab.objective} placeholder="The lab's overarching goal, in a sentence or two" />
            <TextAreaField name="summary" label="Summary" rows={4} defaultValue={lab.summary} placeholder="A short paragraph introducing the lab" />
          </Section>

          <Section title="Research">
            <ListField name="aims" label="Specific aims" values={lab.aims} />
            <Row>
              <ListField name="research_areas" label="Research areas" values={lab.research_areas} />
              <ListField name="techniques" label="Techniques & capabilities" values={lab.techniques} />
            </Row>
          </Section>

          <Section title="Lab lead">
            <Row>
              <TextField name="lead_name" label="Name" defaultValue={lab.lead_name} placeholder="Dr. Jane Doe" />
              <TextField name="lead_title" label="Title" defaultValue={lab.lead_title} placeholder="Senior Lecturer, Pharmacognosy" />
            </Row>
            <TextAreaField name="lead_bio" label="Short bio" rows={3} defaultValue={lab.lead_bio} />
            <Row>
              <TextField name="lead_email" label="Email" type="email" defaultValue={lab.lead_email} />
              <TextField name="lead_photo_url" label="Photo URL" type="url" defaultValue={lab.lead_photo_url} placeholder="https://…" />
            </Row>
          </Section>

          <Section title="Contact & display">
            <Row>
              <TextField name="contact_email" label="Lab contact email" type="email" defaultValue={lab.contact_email} />
              <TextField name="location" label="Location" defaultValue={lab.location} placeholder="School of Pharmacy, Block B" />
            </Row>
            <Row>
              <TextField name="sort_order" label="Display order" type="number" defaultValue={lab.sort_order} hint="Lower numbers appear first." />
            </Row>
          </Section>
        </EditorForm>

        {/* Members save individually, so they live outside the lab form. */}
        <section id="members" className="scroll-mt-20 lg:max-w-[calc(100%-344px)]">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Students &amp; researchers</h2>
              <p className="text-sm text-muted-foreground">{members.length} {members.length === 1 ? "member" : "members"} · changes save immediately</p>
            </div>
            <FormDialog
              action={addMember}
              fields={{ lab_id: lab.id }}
              title="Add a member"
              description={`Add a student or researcher to the ${lab.name}.`}
              submitLabel="Add member"
              trigger={<Button variant="outline"><UserPlusIcon />Add member</Button>}
            >
              <MemberFields nextOrder={members.length + 1} />
            </FormDialog>
          </div>
          <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Name</TableHead>
                  <TableHead className="hidden md:table-cell">Research topic</TableHead>
                  <TableHead className="hidden w-16 sm:table-cell">Order</TableHead>
                  <TableHead className="w-24 pr-4 text-right"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          {member.photo_url && <AvatarImage src={member.photo_url} alt="" />}
                          <AvatarFallback className="text-xs">{initials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{member.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{[member.role, member.email].filter(Boolean).join(" · ") || "—"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden max-w-xs truncate text-muted-foreground md:table-cell">{member.research_topic || "—"}</TableCell>
                    <TableCell className="hidden tabular-nums text-muted-foreground sm:table-cell">{member.sort_order}</TableCell>
                    <TableCell className="pr-4 text-right">
                      <div className="flex justify-end gap-1">
                        <FormDialog
                          action={updateMember}
                          fields={{ id: member.id, lab_id: lab.id }}
                          title={`Edit ${member.name}`}
                          submitLabel="Save member"
                          trigger={<Button variant="ghost" size="icon" aria-label={`Edit ${member.name}`}><PencilIcon /></Button>}
                        >
                          <MemberFields member={member} nextOrder={member.sort_order} />
                        </FormDialog>
                        <ConfirmDelete
                          action={deleteMember}
                          fields={{ id: member.id, lab_id: lab.id }}
                          title={`Remove ${member.name}?`}
                          description={`They will no longer appear on the ${lab.name} page.`}
                          label="Remove"
                          trigger={<Button variant="ghost" size="icon" aria-label={`Remove ${member.name}`} className="text-muted-foreground hover:text-destructive"><Trash2Icon /></Button>}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {members.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="py-10 text-center text-muted-foreground">No members yet. Add the lab&apos;s students and researchers.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </>
  );
}
