import { isMissingTable } from "./labs";
import { createClient } from "./supabase/server";

export type NewsPost = {
  id: string;
  slug: string;
  kind: "news" | "event";
  title: string;
  summary: string;
  body: string;
  date: string; // YYYY-MM-DD
  location: string;
  published: boolean;
};

export async function getNews(): Promise<NewsPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("news_posts").select("*").eq("published", true).order("date", { ascending: false });
  if (error) {
    if (isMissingTable(error)) return fallbackNews;
    throw new Error(`Could not load news: ${error.message}`);
  }
  return data as NewsPost[];
}

export async function getNewsPost(slug: string): Promise<NewsPost | null> {
  return (await getNews()).find((post) => post.slug === slug) ?? null;
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function isUpcoming(post: NewsPost) {
  return post.kind === "event" && post.date >= today();
}

// News shows the month it was published; events show the exact day.
export function formatPostDate(post: NewsPost) {
  const date = new Date(`${post.date}T00:00:00Z`);
  return date.toLocaleDateString("en-GB", post.kind === "event"
    ? { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }
    : { month: "short", year: "numeric", timeZone: "UTC" });
}

// Upcoming events first (soonest first), then everything else newest first.
export function homepageNews(posts: NewsPost[], count: number) {
  const upcoming = posts.filter(isUpcoming).sort((a, b) => a.date.localeCompare(b.date));
  return [...upcoming, ...posts.filter((post) => !isUpcoming(post))].slice(0, count);
}

// Shown only until supabase/migrations/0004_publications_news.sql has been run; mirrors its seed rows.
const fallbackNews: NewsPost[] = [
  {
    id: "news-1",
    slug: "phytomedicine-research-symposium-2026",
    kind: "event",
    title: "Annual Phytomedicine Research Symposium",
    summary: "Researchers, practitioners and regulators meet to discuss evidence for traditional medicines.",
    body: "",
    date: "2026-11-14",
    location: "School of Pharmacy, UHAS, Ho",
    published: true,
  },
  {
    id: "news-2",
    slug: "physic-garden-expands",
    kind: "news",
    title: "Physic Garden expands with 30 new indigenous medicinal species",
    summary: "The garden now serves as a living reference collection for teaching and authentication.",
    body: "",
    date: "2026-09-01",
    location: "",
    published: true,
  },
  {
    id: "news-3",
    slug: "regional-manufacturer-partnership",
    kind: "news",
    title: "Centre partners with regional manufacturers on standardised herbal products",
    summary: "A new collaboration brings laboratory quality control to local production lines.",
    body: "",
    date: "2026-08-01",
    location: "",
    published: true,
  },
];
