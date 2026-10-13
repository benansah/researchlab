import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Avatar from "../../../components/avatar";
import SiteFooter from "../../../components/site-footer";
import SiteHeader from "../../../components/site-header";
import { Arrow, Eyebrow, PageHero, sectionHeading } from "../../../components/ui";
import { getLab, getLabs } from "../../../lib/labs";

// Static class names so Tailwind can see them.
const factColumns: Record<number, string> = { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };

export async function generateMetadata(props: PageProps<"/labs/[slug]">): Promise<Metadata> {
  const lab = await getLab((await props.params).slug);
  return lab ? { title: `${lab.name} · Centre for Phytomedicine and Natural Product Drug Discovery`, description: lab.objective } : {};
}

export default async function LabPage(props: PageProps<"/labs/[slug]">) {
  const { slug } = await props.params;
  const [lab, allLabs] = await Promise.all([getLab(slug), getLabs()]);
  if (!lab) notFound();

  const otherLabs = allLabs.filter((other) => other.slug !== lab.slug);
  const contact = lab.contact_email || lab.lead_email;
  const facts = [
    { label: "Lab lead", value: lab.lead_name },
    { label: "Students & staff", value: String(lab.lab_members.length) },
    { label: "Location", value: lab.location },
    { label: "Contact", value: contact, href: contact ? `mailto:${contact}` : undefined },
  ].filter((fact) => fact.value);

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <PageHero
          crumbs={[{ name: "Home", href: "/" }, { name: "Labs", href: "/labs" }, { name: lab.name, href: `/labs/${lab.slug}` }]}
          eyebrow={lab.tagline || "Research lab"}
          title={lab.name}
        >
          {lab.summary && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">{lab.summary}</p>}
        </PageHero>

        {/* Quick facts */}
        <section aria-label="Lab at a glance" className="relative z-10 mx-auto -mt-12 max-w-6xl px-6 lg:px-10">
          <dl className={`grid bg-white shadow-[0_30px_60px_-30px_rgba(6,48,31,.35)] ring-1 ring-line sm:grid-cols-2 ${factColumns[facts.length] ?? "lg:grid-cols-4"}`}>
            {facts.map((fact, i) => (
              <div key={fact.label} className={`px-7 py-6 ${i > 0 ? "border-t border-line sm:border-t-0" : ""} ${i % 2 ? "sm:border-l" : ""} ${i > 1 ? "sm:border-t lg:border-t-0" : ""} ${i > 0 ? "lg:border-l" : ""} border-line`}>
                <dt className="text-xs font-semibold uppercase tracking-[.09em] text-leaf-dark">{fact.label}</dt>
                <dd className="mt-1.5 break-words font-medium text-ink">
                  {fact.href ? <a href={fact.href} className="underline decoration-leaf/50 underline-offset-4 hover:text-forest">{fact.value}</a> : fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Objective + aims */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <Eyebrow>Research objective</Eyebrow>
              <blockquote className="mt-6 border-l-4 border-leaf pl-6 font-display text-[clamp(1.5rem,2.6vw,2.15rem)] font-normal italic leading-snug text-forest">
                {lab.objective}
              </blockquote>

              {lab.aims.length > 0 && (
                <div className="mt-14">
                  <h2 className="font-sans text-xs font-semibold uppercase tracking-[.09em] text-moss">Specific aims</h2>
                  <ol className="mt-5 divide-y divide-line border-y border-line">
                    {lab.aims.map((aim, i) => (
                      <li key={aim} className="flex gap-5 py-5">
                        <span className="font-display text-2xl font-medium text-leaf">{String(i + 1).padStart(2, "0")}</span>
                        <p className="pt-1 text-[17px] leading-relaxed text-ink">{aim}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            <div className="space-y-6 lg:pt-14">
              {lab.research_areas.length > 0 && (
                <div className="bg-cream p-8 ring-1 ring-line">
                  <h2 className="font-sans text-xs font-semibold uppercase tracking-[.09em] text-moss">Research areas</h2>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {lab.research_areas.map((area) => (
                      <li key={area} className="bg-white px-3.5 py-2 text-[15px] text-forest ring-1 ring-line">{area}</li>
                    ))}
                  </ul>
                </div>
              )}
              {lab.techniques.length > 0 && (
                <div className="bg-forest p-8 text-white">
                  <h2 className="font-sans text-xs font-semibold uppercase tracking-[.09em] text-leaf-light">Techniques &amp; capabilities</h2>
                  <ul className="mt-5 space-y-3">
                    {lab.techniques.map((technique) => (
                      <li key={technique} className="flex items-start gap-3 text-[15px] text-white/85">
                        <svg aria-hidden viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 shrink-0 text-leaf-light" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m5 10.5 3.2 3L15 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {technique}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* People */}
        <section className="bg-cream">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
            <Eyebrow>The team</Eyebrow>
            <h2 className={`mt-5 ${sectionHeading}`}>People of the {lab.name}</h2>

            {lab.lead_name && (
              <article className="mt-12 grid items-center gap-8 bg-white p-8 ring-1 ring-line md:grid-cols-[auto_1fr] lg:gap-12 lg:p-12">
                <Avatar name={lab.lead_name} photoUrl={lab.lead_photo_url} className="h-36 w-36 rounded-full lg:h-44 lg:w-44" textClassName="text-5xl" />
                <div className="flex flex-col justify-center">
                  <p className="text-xs font-semibold uppercase tracking-[.09em] text-leaf-dark">Lab lead</p>
                  <h3 className="mt-2 font-display text-3xl font-medium text-ink">{lab.lead_name}</h3>
                  {lab.lead_title && <p className="mt-1 text-[15px] text-moss">{lab.lead_title}</p>}
                  {lab.lead_bio && <p className="mt-5 max-w-2xl leading-relaxed text-ink/80">{lab.lead_bio}</p>}
                  {lab.lead_email && (
                    <a href={`mailto:${lab.lead_email}`} className="group mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-leaf-dark hover:text-forest">
                      {lab.lead_email} <Arrow />
                    </a>
                  )}
                </div>
              </article>
            )}

            {lab.lab_members.length > 0 && (
              <>
                <h3 className="mt-16 font-sans text-xs font-semibold uppercase tracking-[.09em] text-moss">Students &amp; researchers</h3>
                <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {lab.lab_members.map((person, i) => (
                    <li key={person.id} className="flex gap-5 bg-white p-5 ring-1 ring-line">
                      <Avatar name={person.name} photoUrl={person.photo_url} index={i + 1} className="h-20 w-20 shrink-0 rounded-full" textClassName="text-2xl" />
                      <div className="min-w-0">
                        <p className="font-display text-lg font-medium leading-snug text-ink">{person.name}</p>
                        {person.role && <p className="mt-0.5 text-xs font-semibold uppercase tracking-[.09em] text-leaf-dark">{person.role}</p>}
                        {person.research_topic && <p className="mt-2 text-sm leading-relaxed text-moss">{person.research_topic}</p>}
                        {person.email && <a href={`mailto:${person.email}`} className="mt-2 block truncate text-sm text-forest underline decoration-leaf/40 underline-offset-4">{person.email}</a>}
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>

        {/* Join + other labs */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div className="relative overflow-hidden bg-forest-deep p-10 text-white lg:p-12">
              <span aria-hidden className="absolute left-0 top-0 h-1 w-full bg-leaf" />
              <Eyebrow light>Join the lab</Eyebrow>
              <h2 className="mt-5 font-display text-[2rem] font-medium leading-tight text-white">Interested in working with the {lab.name}?</h2>
              <p className="mt-4 max-w-lg leading-relaxed text-white/70">
                We welcome enquiries from prospective graduate students, postdoctoral researchers and collaborators.
              </p>
              <Link
                href={contact ? `mailto:${contact}` : "/contact"}
                className="group mt-8 inline-flex items-center gap-2.5 bg-leaf px-6 py-3.5 text-sm font-semibold text-forest-deep transition-colors hover:bg-leaf-light"
              >
                Get in touch <Arrow />
              </Link>
            </div>

            {otherLabs.length > 0 && (
              <div>
                <Eyebrow>Other labs</Eyebrow>
                <ul className="mt-6 divide-y divide-line border-y border-line">
                  {otherLabs.map((other) => (
                    <li key={other.id}>
                      <Link href={`/labs/${other.slug}`} className="group flex items-center justify-between gap-6 py-6">
                        <span>
                          <span className="block font-display text-2xl font-medium text-ink group-hover:text-forest">{other.name}</span>
                          <span className="mt-1 block text-sm text-moss">{other.tagline}</span>
                        </span>
                        <span className="text-leaf-dark"><Arrow /></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
