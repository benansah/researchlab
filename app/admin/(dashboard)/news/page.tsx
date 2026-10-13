import Link from "next/link";
import { CalendarIcon, NewspaperIcon, PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPostDate, isUpcoming, type NewsPost } from "../../../../lib/news";
import { createClient } from "../../../../lib/supabase/server";
import { Row, SelectField, TextField } from "../../_components/editor";
import { FormDialog } from "../../_components/form-controls";
import { EmptyState, filterRows, listParams, ListToolbar, LoadError, StatusBadge, statusCounts, timeAgo } from "../../_components/list";
import PageHeader from "../../_components/page-header";
import { requireAdmin } from "../../auth";
import { createPost } from "./actions";

export default async function NewsAdminPage(props: PageProps<"/admin/news">) {
  await requireAdmin();
  const params = listParams(await props.searchParams);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news_posts")
    .select("id, slug, kind, title, summary, date, location, published, updated_at")
    .order("date", { ascending: false });
  const all = (data ?? []) as (NewsPost & { updated_at: string })[];
  const rows = filterRows(all, params, (post) => [post.title, post.summary, post.location, post.kind]);

  const newButton = (
    <FormDialog
      action={createPost}
      title="New post"
      description="You can write the summary and full story on the next screen."
      submitLabel="Create post"
      trigger={<Button><PlusIcon />New post</Button>}
    >
      <TextField name="title" label="Title" placeholder="A clear headline" required autoFocus />
      <Row>
        <SelectField name="kind" label="Type" defaultValue="news" options={[{ value: "news", label: "News" }, { value: "event", label: "Event" }]} />
        <TextField name="date" label="Date" type="date" hint="Blank = today. For events, the event day." />
      </Row>
    </FormDialog>
  );

  return (
    <>
      <PageHeader crumbs={[{ name: "Admin", href: "/admin" }, { name: "News & events" }]} title="News & events" description="Announcements, lab news and upcoming events for the News page and the home page." actions={!error && newButton} />
      <div className="grid gap-4 p-4 md:p-8">
        {error ? (
          <LoadError error={error} migration="0004_publications_news.sql" />
        ) : (
          <>
            <ListToolbar basePath="/admin/news" params={params} counts={statusCounts(all)} placeholder="Search posts…" />
            {rows.length === 0 ? (
              <EmptyState title="No posts yet" description="Share the Centre's news and upcoming events." action={newButton} filtered={all.length > 0} basePath="/admin/news" />
            ) : (
              <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-4">Post</TableHead>
                      <TableHead className="hidden w-36 md:table-cell">Date</TableHead>
                      <TableHead className="w-28">Status</TableHead>
                      <TableHead className="hidden w-32 pr-4 xl:table-cell">Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((post) => (
                      <TableRow key={post.id} className="group">
                        <TableCell className="max-w-0 pl-4 whitespace-normal">
                          <div className="flex items-start gap-3">
                            <span className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md ${post.kind === "event" ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"}`}>
                              {post.kind === "event" ? <CalendarIcon className="size-4" /> : <NewspaperIcon className="size-4" />}
                            </span>
                            <div className="min-w-0">
                              <Link href={`/admin/news/${post.id}`} className="line-clamp-2 font-medium group-hover:underline">{post.title}</Link>
                              <p className="mt-0.5 truncate text-xs text-muted-foreground">{post.summary || "No summary yet"}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-muted-foreground">{formatPostDate(post)}</span>
                          {isUpcoming(post) && <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800">Upcoming</Badge>}
                        </TableCell>
                        <TableCell><StatusBadge published={post.published} /></TableCell>
                        <TableCell className="hidden pr-4 text-muted-foreground xl:table-cell">{timeAgo(post.updated_at)}</TableCell>
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
