import type { Metadata } from "next";
import Link from "next/link";
import PublicationList from "../../components/publication-list";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import { Arrow, Eyebrow, FocusIcon, PageHero, sectionHeading } from "../../components/site-ui";
import { getLabs } from "../../lib/labs";
import { getPublications } from "../../lib/publications";
import { centreName, focusAreas } from "../../lib/site-content";

export const metadata: Metadata = {
  title: `Research · ${centreName}`,
  description: "Research focus areas, labs and publications of the Centre for Phytomedicine and Natural Product Drug Discovery.",
};

export default async function ResearchPage(props: PageProps<"/research">) {
  const { topic } = (await props.searchParams) as { topic?: string };
  const [labs, publications] = await Promise.all([getLabs(), getPublications()]);

  const topics = [...new Set(publications.map((pub) => pub.tag).filter(Boolean))].sort();
  const shown = topic ? publications.filter((pub) => pub.tag === topic) : publications;

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <PageHero crumbs={[{ name: "Home", href: "/" }, { name: "Research", href: "/research" }]} eyebrow="Our research" title="From plant to pharmacy, every step of discovery">
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
            Our multidisciplinary teams follow a candidate from ethnobotanical lead to a standardised, safe and effective product — and publish the evidence along the way.
          </p>
        </PageHero>

        {/* Focus areas */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <Eyebrow>Research focus areas</Eyebrow>
          <h2 className={`mt-5 max-w-3xl ${sectionHeading}`}>Four disciplines, one pipeline</h2>
          <ol className="mt-14 grid gap-px bg-line ring-1 ring-line md:grid-cols-2">
            {focusAreas.map((area, i) => (
              <li key={area.id} id={area.id} className="scroll-mt-32 bg-white p-8 lg:p-10">
                <div className="flex items-center gap-5">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cream text-forest">
                    <FocusIcon name={area.icon} />
                  </span>
                  <span className="text-xs font-semibold tabular-nums tracking-[.08em] text-moss/60">0{i + 1}</span>
                </div>
                <h3 className="mt-6 font-display text-[1.7rem] font-medium leading-tight text-ink">{area.title}</h3>
                <p className="mt-3 text-[17px] leading-relaxed text-ink/80">{area.body}</p>
                <p className="mt-3 leading-relaxed text-moss">{area.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Labs */}
        {labs.length > 0 && (
          <section className="bg-forest-deep text-white">
            <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <Eyebrow light>Who does the work</Eyebrow>
                  <h2 className="mt-5 font-display text-[clamp(2rem,3.6vw,3rem)] font-medium leading-[1.08] tracking-[-.015em] text-white">Our research labs</h2>
                </div>
                <Link href="/labs" className="group inline-flex items-center gap-2 text-sm font-semibold text-leaf-light hover:text-white">
                  All labs <Arrow />
                </Link>
              </div>
              <ul className="mt-12 grid gap-px bg-white/10 md:grid-cols-3">
                {labs.map((lab) => (
                  <li key={lab.id}>
                    <Link href={`/labs/${lab.slug}`} className="group flex h-full flex-col bg-forest-deep p-8 transition-colors hover:bg-forest">
                      <p className="text-xs font-semibold uppercase tracking-[.09em] text-leaf-light">{lab.tagline}</p>
                      <h3 className="mt-3 font-display text-2xl font-medium text-white">{lab.name}</h3>
                      {lab.research_areas.length > 0 && <p className="mt-3 flex-1 text-[15px] leading-relaxed text-white/70">{lab.research_areas.join(" · ")}</p>}
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-leaf-light">Visit the lab <Arrow /></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Publications */}
        <section id="publications" className="scroll-mt-28 bg-cream">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-end">
              <div>
                <Eyebrow>Publications</Eyebrow>
                <h2 className={`mt-5 ${sectionHeading}`}>Evidence that moves the field</h2>
              </div>
              <p className="text-lg leading-relaxed text-moss lg:pb-2">
                Peer-reviewed work from Centre researchers and collaborators{publications.length > 0 && <>, {publications.length} {publications.length === 1 ? "paper" : "papers"} in all</>}.
              </p>
            </div>

            {topics.length > 1 && (
              <nav aria-label="Filter publications by topic" className="mt-10 flex flex-wrap gap-2">
                {[undefined, ...topics].map((value) => {
                  const active = value === topic;
                  return (
                    <Link
                      key={value ?? "all"}
                      href={value ? `/research?topic=${encodeURIComponent(value)}#publications` : "/research#publications"}
                      scroll={false}
                      aria-current={active ? "true" : undefined}
                      className={`rounded-full px-4 py-2 text-sm font-medium ring-1 transition-colors ${active ? "bg-forest text-white ring-forest" : "bg-white text-forest ring-line hover:ring-forest"}`}
                    >
                      {value ?? "All topics"}
                    </Link>
                  );
                })}
              </nav>
            )}

            <div className="mt-10">
              {shown.length > 0 ? (
                <PublicationList publications={shown} showLab />
              ) : (
                <p className="border-y border-line py-10 text-lg text-moss">
                  {topic ? <>No publications tagged “{topic}”. <Link href="/research#publications" className="text-forest underline underline-offset-4">Show all</Link></> : "Publications will be listed here soon."}
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
