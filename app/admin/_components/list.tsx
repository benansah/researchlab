import Link from "next/link";
import { DatabaseIcon, SearchIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";

export type ListParams = { q?: string; status?: string };

const units: [Intl.RelativeTimeFormatUnit, number][] = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];

// "3 days ago", for the Updated columns.
export function timeAgo(iso: string | null | undefined) {
  if (!iso) return "—";
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
  const format = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return format.format(Math.round(seconds / size), unit);
  }
  return "just now";
}

export function listParams(searchParams: Record<string, string | string[] | undefined>): ListParams {
  const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)?.trim() || undefined;
  const status = one(searchParams.status);
  return { q: one(searchParams.q), status: status === "published" || status === "draft" ? status : undefined };
}

export function statusCounts(rows: { published: boolean }[]) {
  const published = rows.filter((row) => row.published).length;
  return { all: rows.length, published, draft: rows.length - published };
}

export function StatusBadge({ published }: { published: boolean }) {
  return published ? (
    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Published</Badge>
  ) : (
    <Badge variant="outline" className="text-muted-foreground">Draft</Badge>
  );
}

// Keeps rows whose text fields contain every word of the query, and that match the status tab.
export function filterRows<T extends { published: boolean }>(rows: T[], { q, status }: ListParams, text: (row: T) => (string | number | null | undefined)[]) {
  const words = (q ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  return rows.filter((row) => {
    if (status === "published" && !row.published) return false;
    if (status === "draft" && row.published) return false;
    const haystack = text(row).filter((v) => v != null).join(" ").toLowerCase();
    return words.every((word) => haystack.includes(word));
  });
}

// Search box + All / Published / Drafts tabs. A plain GET form, so it works without JavaScript.
export function ListToolbar({ basePath, params, counts, placeholder }: {
  basePath: string;
  params: ListParams;
  counts: { all: number; published: number; draft: number };
  placeholder: string;
}) {
  const tabs = [
    { value: undefined, label: "All", count: counts.all },
    { value: "published", label: "Published", count: counts.published },
    { value: "draft", label: "Drafts", count: counts.draft },
  ];
  const href = (status?: string) => {
    const search = new URLSearchParams();
    if (params.q) search.set("q", params.q);
    if (status) search.set("status", status);
    const query = search.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <nav aria-label="Filter by status" className="inline-flex w-fit rounded-lg bg-muted p-1">
        {tabs.map((tab) => {
          const active = (params.status ?? undefined) === tab.value;
          return (
            <Link
              key={tab.label}
              href={href(tab.value)}
              aria-current={active ? "page" : undefined}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {tab.label} <span className="ml-1 text-xs tabular-nums text-muted-foreground">{tab.count}</span>
            </Link>
          );
        })}
      </nav>
      <form action={basePath} role="search" className="relative w-full sm:w-72">
        {params.status && <input type="hidden" name="status" value={params.status} />}
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input name="q" defaultValue={params.q} placeholder={placeholder} aria-label="Search" className="pl-8" />
      </form>
    </div>
  );
}

export function EmptyState({ title, description, action, filtered = false, basePath }: {
  title: string;
  description: string;
  action?: React.ReactNode;
  filtered?: boolean;
  basePath?: string;
}) {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon"><SearchIcon /></EmptyMedia>
        <EmptyTitle>{filtered ? "No matches" : title}</EmptyTitle>
        <EmptyDescription>{filtered ? "Nothing matches the current search or filter." : description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {filtered && basePath ? <Button variant="outline" asChild><Link href={basePath}>Clear filters</Link></Button> : action}
      </EmptyContent>
    </Empty>
  );
}

export function LoadError({ error, migration }: { error: { code?: string; message: string }; migration: string }) {
  if (error.code === "PGRST205") {
    return (
      <Alert>
        <DatabaseIcon />
        <AlertTitle>This table doesn&apos;t exist yet</AlertTitle>
        <AlertDescription>
          Open your Supabase dashboard → SQL Editor, paste in <code className="rounded bg-muted px-1 py-0.5 text-xs">supabase/migrations/{migration}</code> and run it, then reload this page.
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <Alert variant="destructive">
      <AlertTitle>Couldn&apos;t load this list</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}
