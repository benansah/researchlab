import type { Metadata } from "next";
import Link from "next/link";
import LabMark from "../../components/lab-mark";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import { Arrow, PageHero } from "../../components/site-ui";
import { getLabs } from "../../lib/labs";

export const metadata: Metadata = {
  title: "Research Labs · Centre for Phytomedicine and Natural Product Drug Discovery",
  description: "Meet the research labs of the Centre: their objectives, leads and students.",
};

export default async function LabsPage() {
  const labs = await getLabs();

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <PageHero crumbs={[{ name: "Home", href: "/" }, { name: "Labs", href: "/labs" }]} eyebrow="Research labs" title="Three labs, one pipeline from plant to medicine">
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
            Each lab brings its own expertise — discovery, pharmacology and formulation — and together they carry a candidate from ethnobotanical lead to a safe, quality-assured product.
          </p>
        </PageHero>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          {labs.length === 0 ? (
            <p className="text-lg text-moss">Lab profiles are coming soon.</p>
          ) : (
            <ul className="grid gap-8">
              {labs.map((lab, i) => (
                <li key={lab.id}>
                  <Link
                    href={`/labs/${lab.slug}`}
                    className="group grid overflow-hidden bg-white ring-1 ring-line transition-shadow duration-300 hover:shadow-[0_30px_60px_-30px_rgba(6,48,31,.4)] md:grid-cols-[280px_1fr] lg:grid-cols-[340px_1fr]"
                  >
                    <div className="relative min-h-56 overflow-hidden">
                      <LabMark index={i} className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]" />
                    </div>
                    <div className="flex flex-col p-8 lg:p-10">
                      <p className="text-xs font-semibold uppercase tracking-[.09em] text-leaf-dark">{lab.tagline}</p>
                      <h2 className="mt-3 font-display text-[2.2rem] font-medium leading-tight text-ink transition-colors group-hover:text-forest">{lab.name}</h2>
                      <p className="mt-4 max-w-3xl text-[17px] leading-relaxed text-moss">{lab.objective}</p>
                      {lab.research_areas.length > 0 && (
                        <ul className="mt-6 flex flex-wrap gap-2">
                          {lab.research_areas.map((area) => (
                            <li key={area} className="bg-cream px-3 py-1.5 text-sm text-forest ring-1 ring-line">{area}</li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-6">
                        <dl className="flex flex-wrap gap-x-10 gap-y-3 text-sm">
                          <div>
                            <dt className="text-xs font-semibold uppercase tracking-[.09em] text-moss/80">Lab lead</dt>
                            <dd className="mt-1 font-medium text-ink">{lab.lead_name || "—"}</dd>
                          </div>
                          <div>
                            <dt className="text-xs font-semibold uppercase tracking-[.09em] text-moss/80">Students &amp; staff</dt>
                            <dd className="mt-1 font-medium text-ink">{lab.lab_members.length}</dd>
                          </div>
                        </dl>
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-leaf-dark">
                          Visit the lab <Arrow />
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
