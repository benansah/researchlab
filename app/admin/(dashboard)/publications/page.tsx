import Link from "next/link";
import { PlusIcon, StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "../../../../lib/supabase/server";
import { TextAreaField, TextField } from "../../_components/editor";
import { FormDialog } from "../../_components/form-controls";
import { EmptyState, filterRows, listParams, ListToolbar, LoadError, StatusBadge, statusCounts, timeAgo } from "../../_components/list";
import PageHeader from "../../_components/page-header";
import { requireAdmin } from "../../auth";
import { createPublication } from "./actions";

type Row = { id: string; title: string; authors: string; venue: string; year: number | null; tag: string; featured: boolean; published: boolean; updated_at: string; lab: { name: string } | null };

export default async function PublicationsAdminPage(props: PageProps<"/admin/publications">) {
  await requireAdmin();
  const params = listParams(await props.searchParams);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("publications")
    .select("id, title, authors, venue, year, tag, featured, published, updated_at, lab:labs(name)")
    .order("year", { ascending: false, nullsFirst: false })
    .order("title");
  const all = (data ?? []) as unknown as Row[];
  const rows = filterRows(all, params, (row) => [row.title, row.authors, row.venue, row.year, row.tag, row.lab?.name]);

  const newButton = (
    <FormDialog
      action={createPublication}
      title="New publication"
      description="Start with the title — you can add authors, the journal, a DOI and the lab on the next screen."
      submitLabel="Create publication"
      trigger={<Button><PlusIcon />New publication</Button>}
    >
      <TextAreaField name="title" label="Title" rows={3} placeholder="Full publication title" required autoFocus />
      <TextField name="year" label="Year" type="number" min={1950} max={2100} placeholder={String(new Date().getFullYear())} />
    </FormDialog>
  );

  return (
    <>
      <PageHeader crumbs={[{ name: "Admin", href: "/admin" }, { name: "Publications" }]} title="Publications" description="The research record shown on the Research page, lab profiles and the home page." actions={!error && newButton} />
      <div className="grid gap-4 p-4 md:p-8">
        {error ? (
          <LoadError error={error} migration="0004_publications_news.sql" />
        ) : (
          <>
            <ListToolbar basePath="/admin/publications" params={params} counts={statusCounts(all)} placeholder="Search titles, authors, journals…" />
            {rows.length === 0 ? (
              <EmptyState title="No publications yet" description="Add the Centre's papers so visitors can find them." action={newButton} filtered={all.length > 0} basePath="/admin/publications" />
            ) : (
              <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-4">Publication</TableHead>
                      <TableHead className="hidden w-16 md:table-cell">Year</TableHead>
                      <TableHead className="hidden lg:table-cell">Topic · Lab</TableHead>
                      <TableHead className="w-28">Status</TableHead>
                      <TableHead className="hidden w-32 pr-4 xl:table-cell">Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((pub) => (
                      <TableRow key={pub.id} className="group">
                        <TableCell className="max-w-0 pl-4 whitespace-normal">
                          <Link href={`/admin/publications/${pub.id}`} className="line-clamp-2 font-medium group-hover:underline">
                            {pub.featured && <StarIcon aria-label="Featured" className="mr-1.5 inline size-3.5 -translate-y-px fill-amber-400 text-amber-400" />}
                            {pub.title}
                          </Link>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">{[pub.authors, pub.venue].filter(Boolean).join(" · ") || "No authors yet"}</p>
                        </TableCell>
                        <TableCell className="hidden tabular-nums text-muted-foreground md:table-cell">{pub.year ?? "—"}</TableCell>
                        <TableCell className="hidden text-muted-foreground lg:table-cell">{[pub.tag, pub.lab?.name].filter(Boolean).join(" · ") || "—"}</TableCell>
                        <TableCell><StatusBadge published={pub.published} /></TableCell>
                        <TableCell className="hidden pr-4 text-muted-foreground xl:table-cell">{timeAgo(pub.updated_at)}</TableCell>
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
