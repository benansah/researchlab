import Link from "next/link";
import { ArrowRightIcon, BookOpenIcon, CircleAlertIcon, FlaskConicalIcon, NewspaperIcon, SproutIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "../../../lib/supabase/server";
import { StatusBadge, timeAgo } from "../_components/list";
import PageHeader from "../_components/page-header";
import { requireAdmin } from "../auth";

type Item = { id: string; title: string; published: boolean; updated_at: string; type: string; href: string; italic?: boolean };

export default async function AdminOverview() {
  const user = await requireAdmin();
  const supabase = await createClient();

  // Each query fails independently, so one missing table doesn't blank the dashboard.
  const [news, publications, labs, plants] = await Promise.all([
    supabase.from("news_posts").select("id, title, kind, date, summary, published, updated_at"),
    supabase.from("publications").select("id, title, authors, doi_url, published, updated_at"),
    supabase.from("labs").select("id, name, lead_name, objective, published, updated_at, lab_members(count)"),
    supabase.from("garden_plants").select("id, botanical_name, description, photo_url, published, updated_at"),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = (news.data ?? []).filter((post) => post.kind === "event" && post.date >= today).length;
  const members = (labs.data ?? []).reduce((total, lab) => total + ((lab.lab_members as unknown as { count: number }[])[0]?.count ?? 0), 0);

  const sections = [
    { title: "News & events", href: "/admin/news", icon: NewspaperIcon, rows: news.data, detail: upcoming ? `${upcoming} upcoming ${upcoming === 1 ? "event" : "events"}` : "No upcoming events" },
    { title: "Publications", href: "/admin/publications", icon: BookOpenIcon, rows: publications.data, detail: `${(publications.data ?? []).filter((p) => !p.doi_url).length} without a DOI link` },
    { title: "Lab profiles", href: "/admin/lab-profiles", icon: FlaskConicalIcon, rows: labs.data, detail: `${members} students & researchers` },
    { title: "Physic garden", href: "/admin/garden", icon: SproutIcon, rows: plants.data, detail: `${(plants.data ?? []).filter((p) => !p.photo_url).length} without a photo` },
  ];

  const items: Item[] = [
    ...(news.data ?? []).map((row) => ({ id: row.id, title: row.title, published: row.published, updated_at: row.updated_at, type: row.kind === "event" ? "Event" : "News", href: `/admin/news/${row.id}` })),
    ...(publications.data ?? []).map((row) => ({ id: row.id, title: row.title, published: row.published, updated_at: row.updated_at, type: "Publication", href: `/admin/publications/${row.id}` })),
    ...(labs.data ?? []).map((row) => ({ id: row.id, title: row.name, published: row.published, updated_at: row.updated_at, type: "Lab", href: `/admin/lab-profiles/${row.id}` })),
    ...(plants.data ?? []).map((row) => ({ id: row.id, title: row.botanical_name, published: row.published, updated_at: row.updated_at, type: "Plant", href: `/admin/garden/${row.id}`, italic: true })),
  ];
  const recent = [...items].sort((a, b) => (b.updated_at ?? "").localeCompare(a.updated_at ?? "")).slice(0, 6);

  // Drafts plus published entries missing the details visitors need most.
  const attention = [
    ...items.filter((item) => !item.published).map((item) => ({ ...item, reason: "Draft — not visible on the site" })),
    ...(news.data ?? []).filter((p) => p.published && !p.summary).map((p) => ({ ...items.find((i) => i.id === p.id)!, reason: "No summary" })),
    ...(labs.data ?? []).filter((l) => l.published && (!l.lead_name || !l.objective)).map((l) => ({ ...items.find((i) => i.id === l.id)!, reason: !l.lead_name ? "No lab lead" : "No objective" })),
    ...(plants.data ?? []).filter((p) => p.published && !p.description).map((p) => ({ ...items.find((i) => i.id === p.id)!, reason: "No description" })),
  ].slice(0, 6);

  const name = user.email?.split("@")[0] ?? "there";

  return (
    <>
      <PageHeader crumbs={[{ name: "Admin" }, { name: "Overview" }]} title={`Welcome back, ${name}`} description="Everything you publish here appears on the public site as soon as you save." />
      <div className="grid gap-6 p-4 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {sections.map((section) => {
            const rows = section.rows ?? [];
            const drafts = rows.filter((row) => !row.published).length;
            return (
              <Card key={section.href} className="group relative">
                <CardHeader>
                  <CardDescription>{section.title}</CardDescription>
                  <CardTitle className="text-3xl font-semibold tabular-nums">{section.rows ? rows.length : "—"}</CardTitle>
                  <CardAction><section.icon className="size-5 text-muted-foreground" /></CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  {section.rows ? (
                    <>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{rows.length - drafts} published</Badge>
                        {drafts > 0 && <Badge variant="outline" className="text-muted-foreground">{drafts} {drafts === 1 ? "draft" : "drafts"}</Badge>}
                      </div>
                      <p className="text-muted-foreground">{section.detail}</p>
                    </>
                  ) : (
                    <p className="text-destructive">Table not set up yet</p>
                  )}
                </CardFooter>
                <Link href={section.href} className="absolute inset-0 rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"><span className="sr-only">Manage {section.title}</span></Link>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Needs attention</CardTitle>
              <CardDescription>Drafts and published entries missing key details.</CardDescription>
            </CardHeader>
            <CardContent>
              {attention.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">All caught up — nothing needs attention.</p>
              ) : (
                <ul className="divide-y">
                  {attention.map((item) => (
                    <li key={`${item.id}-${item.reason}`}>
                      <Link href={item.href} className="group flex items-center gap-3 py-3">
                        <CircleAlertIcon className="size-4 shrink-0 text-amber-500" />
                        <span className="min-w-0 flex-1">
                          <span className={`block truncate text-sm font-medium group-hover:underline ${item.italic ? "italic" : ""}`}>{item.title}</span>
                          <span className="block text-xs text-muted-foreground">{item.type} · {item.reason}</span>
                        </span>
                        <ArrowRightIcon className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recently updated</CardTitle>
              <CardDescription>The latest changes across all content.</CardDescription>
            </CardHeader>
            <CardContent>
              {recent.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">Nothing yet.</p>
              ) : (
                <ul className="divide-y">
                  {recent.map((item) => (
                    <li key={item.id}>
                      <Link href={item.href} className="group flex items-center gap-3 py-3">
                        <span className="min-w-0 flex-1">
                          <span className={`block truncate text-sm font-medium group-hover:underline ${item.italic ? "italic" : ""}`}>{item.title}</span>
                          <span className="block text-xs text-muted-foreground">{item.type} · {timeAgo(item.updated_at)}</span>
                        </span>
                        <StatusBadge published={item.published} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
            <CardFooter className="border-t">
              <Button variant="ghost" size="sm" asChild className="-ml-2">
                <a href="/" target="_blank" rel="noopener noreferrer">Open the public site <ArrowRightIcon /></a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
