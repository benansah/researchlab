import Link from "next/link";
import { PlusIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "../../../../lib/supabase/server";
import { TextField } from "../../_components/editor";
import { FormDialog } from "../../_components/form-controls";
import { EmptyState, filterRows, listParams, ListToolbar, LoadError, StatusBadge, statusCounts, timeAgo } from "../../_components/list";
import PageHeader from "../../_components/page-header";
import { requireAdmin } from "../../auth";
import { createLab } from "./actions";

type Row = { id: string; slug: string; name: string; tagline: string; lead_name: string; published: boolean; updated_at: string; lab_members: { count: number }[] };

export default async function LabProfilesAdminPage(props: PageProps<"/admin/lab-profiles">) {
  await requireAdmin();
  const params = listParams(await props.searchParams);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("labs")
    .select("id, slug, name, tagline, lead_name, published, updated_at, lab_members(count)")
    .order("sort_order");
  const all = (data ?? []) as Row[];
  const rows = filterRows(all, params, (lab) => [lab.name, lab.tagline, lab.lead_name]);

  const newButton = (
    <FormDialog
      action={createLab}
      title="New lab"
      description="You can fill in its objective, lead and members on the next screen."
      submitLabel="Create lab"
      trigger={<Button><PlusIcon />New lab</Button>}
    >
      <TextField name="name" label="Lab name" placeholder="e.g. Mensah Lab" required autoFocus />
      <TextField name="slug" label="Web address (optional)" placeholder="mensah-lab" pattern="[a-z0-9\-]*" hint="The lab will live at /labs/<address>. Leave blank to generate it from the name." />
    </FormDialog>
  );

  return (
    <>
      <PageHeader crumbs={[{ name: "Admin", href: "/admin" }, { name: "Lab profiles" }]} title="Lab profiles" description="Each lab's objective, lead and students, as shown on the Labs pages." actions={!error && newButton} />
      <div className="grid gap-4 p-4 md:p-8">
        {error ? (
          <LoadError error={error} migration="0001_labs.sql" />
        ) : (
          <>
            <ListToolbar basePath="/admin/lab-profiles" params={params} counts={statusCounts(all)} placeholder="Search labs…" />
            {rows.length === 0 ? (
              <EmptyState title="No labs yet" description="Create the first lab profile." action={newButton} filtered={all.length > 0} basePath="/admin/lab-profiles" />
            ) : (
              <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-4">Lab</TableHead>
                      <TableHead className="hidden md:table-cell">Lead</TableHead>
                      <TableHead className="hidden w-28 sm:table-cell">Members</TableHead>
                      <TableHead className="w-28">Status</TableHead>
                      <TableHead className="hidden w-32 pr-4 xl:table-cell">Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((lab) => (
                      <TableRow key={lab.id} className="group">
                        <TableCell className="max-w-0 pl-4">
                          <Link href={`/admin/lab-profiles/${lab.id}`} className="font-medium group-hover:underline">{lab.name}</Link>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">{lab.tagline || `/labs/${lab.slug}`}</p>
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground md:table-cell">{lab.lead_name || "—"}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="inline-flex items-center gap-1.5 tabular-nums text-muted-foreground"><UsersIcon className="size-3.5" />{lab.lab_members[0]?.count ?? 0}</span>
                        </TableCell>
                        <TableCell><StatusBadge published={lab.published} /></TableCell>
                        <TableCell className="hidden pr-4 text-muted-foreground xl:table-cell">{timeAgo(lab.updated_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
