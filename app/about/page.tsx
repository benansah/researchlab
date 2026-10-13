import type { Metadata } from "next";
import Link from "next/link";
import BotanicalLineArt from "../../components/botanical-line-art";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import { Arrow, Eyebrow, FocusIcon, PageHero, sectionHeading } from "../../components/ui";
import { getLabs } from "../../lib/labs";
import { centreName, centreShortName, focusAreas, institution, school } from "../../lib/site-content";

export const metadata: Metadata = {
  title: `About · ${centreName}`,
  description: `The ${centreName} at the ${school}, ${institution}: our mission, approach and people.`,
};

const values = [
  { title: "Respect for traditional knowledge", body: "Ethnobotanical knowledge is where most of our leads begin. We work with communities and practitioners, and credit what we learn from them." },
  { title: "Rigorous evidence", body: "Claims about herbal medicines should rest on the same standards of evidence as any other medicine: authenticated material, validated assays and published results." },
  { title: "Safety first", body: "Before a product can help patients it must be shown to be safe and consistent. Toxicology and quality control are part of every project, not an afterthought." },
  { title: "Local impact", body: "We train the next generation of pharmaceutical scientists and work with regional manufacturers and regulators so that our research reaches people in Ghana and beyond." },
];

export default async function AboutPage() {
  const labs = await getLabs().catch(() => []);

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <PageHero crumbs={[{ name: "Home", href: "/" }, { name: "About", href: "/about" }]} eyebrow="About the Centre" title="Bringing pharmaceutical science to traditional medicine">
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
            The {centreName} ({centreShortName}) is a research centre of the {school} at the {institution} in Ho, Ghana.
          </p>
        </PageHero>

        {/* Mission */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <Eyebrow>Our mission</Eyebrow>
              <blockquote className="mt-6 border-l-4 border-leaf pl-6 font-display text-[clamp(1.6rem,2.8vw,2.3rem)] font-normal italic leading-snug text-forest">
                To discover, validate and develop safe, effective and affordable medicines from West Africa&rsquo;s medicinal flora.
              </blockquote>
            </div>
            <div className="space-y-5 text-[17px] leading-relaxed text-ink/80 lg:pt-14">
              <p>
                Herbal medicines are widely used across West Africa, yet many have never been studied with the rigour that patients, prescribers and regulators need. The Centre exists to close that gap.
              </p>
              <p>
                We bring together pharmacognosy, pharmacology, toxicology and pharmaceutics so that a promising plant can be followed all the way from a traditional remedy to a standardised, quality-assured product — with the evidence published at every step.
              </p>
            </div>
          </div>
        </section>

        {/* Approach */}
        <section className="bg-cream">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
            <Eyebrow>Our approach</Eyebrow>
            <h2 className={`mt-5 max-w-3xl ${sectionHeading}`}>One pipeline, from plant to pharmacy</h2>
            <ol className="mt-14 grid gap-px bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-4">
              {focusAreas.map((area, i) => (
                <li key={area.id}>
                  <Link href={`/research#${area.id}`} className="group flex h-full flex-col bg-white p-8 transition-colors hover:bg-forest">
                    <span className="text-xs font-semibold tabular-nums tracking-[.08em] text-moss/60 group-hover:text-leaf-light">Step {i + 1}</span>
                    <span className="mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-cream text-forest group-hover:bg-white/10 group-hover:text-leaf-light">
                      <FocusIcon name={area.icon} className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 font-display text-xl font-medium leading-tight text-ink group-hover:text-white">{area.title}</h3>
                    <p className="mt-3 flex-1 text-[15px] leading-relaxed text-moss group-hover:text-white/70">{area.body}</p>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Values */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <Eyebrow>What guides us</Eyebrow>
          <h2 className={`mt-5 ${sectionHeading}`}>Our values</h2>
          <ul className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {values.map((value) => (
              <li key={value.title} className="border-t-2 border-leaf pt-6">
                <h3 className="font-display text-2xl font-medium text-ink">{value.title}</h3>
                <p className="mt-3 leading-relaxed text-moss">{value.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Labs + garden */}
        <section className="relative overflow-hidden bg-forest-deep text-white">
          <BotanicalLineArt className="pointer-events-none absolute -bottom-10 right-[4%] hidden h-[115%] text-leaf-light/20 md:block" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-24">
            <div>
              <Eyebrow light>Our people</Eyebrow>
              <h2 className="mt-5 font-display text-[clamp(1.8rem,3vw,2.5rem)] font-medium leading-tight text-white">
                {labs.length > 0 ? `${labs.length} research ${labs.length === 1 ? "lab" : "labs"}, one team` : "Our research labs"}
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-white/70">
                Each lab is led by a member of faculty and brings together graduate students and research staff around a shared objective.
              </p>
              {labs.length > 0 && (
                <ul className="mt-6 space-y-2">
                  {labs.map((lab) => (
                    <li key={lab.id}>
                      <Link href={`/labs/${lab.slug}`} className="group inline-flex items-center gap-2 font-medium text-leaf-light hover:text-white">
                        {lab.name}{lab.tagline && <span className="font-normal text-white/60">— {lab.tagline}</span>} <Arrow />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <Eyebrow light>The Physic Garden</Eyebrow>
              <h2 className="mt-5 font-display text-[clamp(1.8rem,3vw,2.5rem)] font-medium leading-tight text-white">A living library of medicinal plants</h2>
              <p className="mt-4 max-w-md leading-relaxed text-white/70">
                Our garden preserves authenticated specimens for teaching, voucher identification and sustainable sourcing — the starting point for much of our research.
              </p>
              <Link href="/physicgarden" className="group mt-8 inline-flex items-center gap-2.5 bg-white px-6 py-3.5 text-sm font-semibold text-forest transition-colors hover:bg-leaf-light">
                Visit the garden <Arrow />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="flex flex-col items-start justify-between gap-8 bg-cream p-10 ring-1 ring-line md:flex-row md:items-center lg:p-12">
            <div>
              <h2 className="font-display text-[1.9rem] font-medium leading-tight text-ink">Work with us</h2>
              <p className="mt-2 max-w-xl leading-relaxed text-moss">Prospective students, collaborators and partners — we&rsquo;d like to hear from you.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/services" className="inline-flex items-center border border-forest px-6 py-3.5 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-white">Our services</Link>
              <Link href="/contact" className="group inline-flex items-center gap-2.5 bg-forest px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-leaf-dark">Get in touch <Arrow /></Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
