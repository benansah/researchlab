import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import { Arrow, PageHero } from "../../components/site-ui";
import { getPlants } from "../../lib/garden";
import { getLabs } from "../../lib/labs";
import { formatPostDate, getNews } from "../../lib/news";
import { getPublications } from "../../lib/publications";
import { centreName, focusAreas, services } from "../../lib/site-content";

export const metadata: Metadata = {
  title: `Search · ${centreName}`,
  robots: { index: false },
};

type Result = { href: string; kind: string; title: string; detail: string; italic?: boolean };

// Every word in the query must appear somewhere in the record (case- and accent-insensitive).
function fold(value: string) {
  return value.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function matcher(query: string) {
  const words = fold(query).split(/\s+/).filter(Boolean);
  return (...fields: (string | string[] | number | null | undefined)[]) => {
    const haystack = fold(fields.flat().filter((field) => field != null).join(" "));
    return words.every((word) => haystack.includes(word));
  };
}

async function search(query: string): Promise<Result[]> {
  const matches = matcher(query);
  // Search should still work if one source is unavailable.
  const [labs, plants, publications, posts] = await Promise.all([
    getLabs().catch(() => []),
    getPlants().catch(() => []),
    getPublications().catch(() => []),
    getNews().catch(() => []),
  ]);

  const results: Result[] = [];

  for (const lab of labs) {
    if (matches(lab.name, lab.tagline, lab.objective, lab.summary, lab.aims, lab.research_areas, lab.techniques, lab.lead_name)) {
      results.push({ href: `/labs/${lab.slug}`, kind: "Lab", title: lab.name, detail: lab.tagline || lab.objective });
    }
    if (lab.lead_name && matches(lab.lead_name, lab.lead_title)) {
      results.push({ href: `/labs/${lab.slug}`, kind: "Person", title: lab.lead_name, detail: [lab.lead_title, lab.name].filter(Boolean).join(" · ") });
    }
    for (const member of lab.lab_members) {
      if (matches(member.name, member.role, member.research_topic)) {
        results.push({ href: `/labs/${lab.slug}`, kind: "Person", title: member.name, detail: [member.role, member.research_topic, lab.name].filter(Boolean).join(" · ") });
      }
    }
  }

  for (const pub of publications) {
    if (matches(pub.title, pub.authors, pub.venue, pub.year, pub.tag, pub.abstract)) {
      results.push({ href: pub.doi_url || "/research#publications", kind: "Publication", title: pub.title, detail: [pub.authors, pub.venue, pub.year].filter(Boolean).join(" · ") });
    }
  }

  for (const plant of plants) {
    if (matches(plant.botanical_name, plant.common_name, plant.local_names, plant.family, plant.category, plant.parts_used, plant.traditional_uses, plant.description, plant.research_notes)) {
      results.push({ href: `/physicgarden/${plant.slug}`, kind: "Plant", title: plant.botanical_name, italic: true, detail: [plant.common_name, plant.category].filter(Boolean).join(" · ") });
    }
  }

  for (const post of posts) {
    if (matches(post.title, post.summary, post.body, post.location)) {
      results.push({ href: `/news/${post.slug}`, kind: post.kind === "event" ? "Event" : "News", title: post.title, detail: `${formatPostDate(post)} · ${post.summary}` });
    }
  }

  for (const area of focusAreas) {
    if (matches(area.title, area.body, area.detail)) {
      results.push({ href: `/research#${area.id}`, kind: "Research area", title: area.title, detail: area.body });
    }
  }

  for (const service of services) {
    if (matches(service.title, service.body)) {
      results.push({ href: "/services", kind: "Service", title: service.title, detail: service.body });
    }
  }

  return results;
}

export default async function SearchPage(props: PageProps<"/search">) {
  const params = (await props.searchParams) as { q?: string | string[] };
  const query = (Array.isArray(params.q) ? params.q[0] : params.q ?? "").trim().slice(0, 100);
  const results = query ? await search(query) : [];

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <PageHero crumbs={[{ name: "Home", href: "/" }, { name: "Search", href: "/search" }]} eyebrow="Search" title={query ? `Results for “${query}”` : "Search the site"}>
          <form action="/search" role="search" className="mt-8 flex max-w-xl">
            <label htmlFor="search-page-q" className="sr-only">Search the site</label>
            <input
              id="search-page-q"
              name="q"
              defaultValue={query}
              placeholder="Research, people, plants, publications…"
              className="min-w-0 flex-1 bg-white px-4 py-3.5 text-[15px] text-ink outline-none placeholder:text-moss/70 focus:ring-2 focus:ring-leaf"
            />
            <button type="submit" className="bg-leaf px-6 text-sm font-semibold text-forest-deep transition-colors hover:bg-leaf-light">Search</button>
          </form>
        </PageHero>

        <section className="mx-auto max-w-4xl px-6 py-16 lg:px-10 lg:py-20">
          {query && (
            <p className="text-sm font-semibold uppercase tracking-[.09em] text-moss" role="status">
              {results.length} {results.length === 1 ? "result" : "results"}
            </p>
          )}
          {query && results.length === 0 && (
            <p className="mt-6 text-lg leading-relaxed text-moss">
              Nothing matched. Try fewer or different words, or browse <Link href="/research" className="text-forest underline underline-offset-4">research</Link>,{" "}
              <Link href="/labs" className="text-forest underline underline-offset-4">labs</Link> and the{" "}
              <Link href="/physicgarden" className="text-forest underline underline-offset-4">Physic Garden</Link>.
            </p>
          )}
          {results.length > 0 && (
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {results.map((result, i) => {
                const external = /^https?:/.test(result.href);
                return (
                  <li key={`${result.href}-${i}`}>
                    <Link
                      href={result.href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group grid gap-2 py-6 sm:grid-cols-[130px_1fr_auto] sm:gap-6"
                    >
                      <span className="text-xs font-semibold uppercase tracking-[.09em] text-leaf-dark sm:pt-1.5">{result.kind}</span>
                      <span className="min-w-0">
                        <span className={`block font-display text-xl font-medium leading-snug text-ink group-hover:text-forest ${result.italic ? "italic" : ""}`}>{result.title}</span>
                        {result.detail && <span className="mt-1.5 line-clamp-2 block text-[15px] leading-relaxed text-moss">{result.detail}</span>}
                      </span>
                      <span className="hidden text-leaf-dark sm:block sm:pt-1.5"><Arrow /></span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
