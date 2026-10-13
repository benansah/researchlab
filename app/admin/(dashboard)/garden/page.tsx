import Link from "next/link";
import { PlusIcon, SproutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "../../../../lib/supabase/server";
import { TextField } from "../../_components/editor";
import { FormDialog } from "../../_components/form-controls";
import { EmptyState, filterRows, listParams, ListToolbar, LoadError, StatusBadge, statusCounts, timeAgo } from "../../_components/list";
import PageHeader from "../../_components/page-header";
import { requireAdmin } from "../../auth";
import { createPlant } from "./actions";

type Row = { id: string; botanical_name: string; common_name: string; family: string; category: string; photo_url: string; published: boolean; updated_at: string };

export default async function GardenAdminPage(props: PageProps<"/admin/garden">) {
  await requireAdmin();
  const params = listParams(await props.searchParams);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("garden_plants")
    .select("id, botanical_name, common_name, family, category, photo_url, published, updated_at")
    .order("sort_order")
    .order("botanical_name");
  const all = (data ?? []) as Row[];
  const rows = filterRows(all, params, (plant) => [plant.botanical_name, plant.common_name, plant.family, plant.category]);

  const newButton = (
    <FormDialog
      action={createPlant}
      title="New plant"
      description="You can add uses, photos and research links on the next screen."
      submitLabel="Add plant"
      trigger={<Button><PlusIcon />New plant</Button>}
    >
      <TextField name="botanical_name" label="Botanical name" placeholder="e.g. Moringa oleifera" required autoFocus className="italic" />
      <TextField name="common_name" label="Common name" placeholder="e.g. Moringa" />
    </FormDialog>
  );

  return (
    <>
      <PageHeader crumbs={[{ name: "Admin", href: "/admin" }, { name: "Physic garden" }]} title="Physic garden" description="The plants shown in the Physic Garden catalogue." actions={!error && newButton} />
      <div className="grid gap-4 p-4 md:p-8">
        {error ? (
          <LoadError error={error} migration="0002_garden.sql" />
        ) : (
          <>
            <ListToolbar basePath="/admin/garden" params={params} counts={statusCounts(all)} placeholder="Search plants…" />
            {rows.length === 0 ? (
              <EmptyState title="No plants yet" description="Add the species growing in the garden." action={newButton} filtered={all.length > 0} basePath="/admin/garden" />
            ) : (
              <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-4">Plant</TableHead>
                      <TableHead className="hidden md:table-cell">Family</TableHead>
                      <TableHead className="hidden lg:table-cell">Category</TableHead>
                      <TableHead className="w-28">Status</TableHead>
                      <TableHead className="hidden w-32 pr-4 xl:table-cell">Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((plant) => (
                      <TableRow key={plant.id} className="group">
                        <TableCell className="max-w-0 pl-4">
                          <div className="flex items-center gap-3">
                            <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                              {plant.photo_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={plant.photo_url} alt="" className="size-full object-cover" />
                              ) : (
                                <SproutIcon className="size-4 text-muted-foreground" />
                              )}
                            </span>
                            <div className="min-w-0">
                              <Link href={`/admin/garden/${plant.id}`} className="font-medium italic group-hover:underline">{plant.botanical_name}</Link>
                              <p className="mt-0.5 truncate text-xs text-muted-foreground">{plant.common_name || "No common name"}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground md:table-cell">{plant.family || "—"}</TableCell>
                        <TableCell className="hidden text-muted-foreground lg:table-cell">{plant.category || "—"}</TableCell>
                        <TableCell><StatusBadge published={plant.published} /></TableCell>
                        <TableCell className="hidden pr-4 text-muted-foreground xl:table-cell">{timeAgo(plant.updated_at)}</TableCell>
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
