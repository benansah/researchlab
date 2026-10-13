import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import { Arrow, Eyebrow, PageHero, sectionHeading } from "../../components/site-ui";
import { audiences, centreName, contactEmail, services } from "../../lib/site-content";

export const metadata: Metadata = {
  title: `Services · ${centreName}`,
  description: "Analytical, pharmacological and formulation services for manufacturers, researchers and regulators.",
};

const steps = [
  { title: "Get in touch", body: "Tell us about your samples, the question you need answered and any timelines or regulatory requirements." },
  { title: "Agree a plan", body: "We confirm the tests, sample quantities, turnaround and cost before any work begins." },
  { title: "Analysis", body: "Work is carried out in our laboratories by trained staff under documented procedures." },
  { title: "Report", body: "You receive a written report of methods and results, and we are happy to talk through the findings." },
];

export default function ServicesPage() {
  const enquiry = `mailto:${contactEmail}?subject=${encodeURIComponent("Service enquiry")}`;

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <PageHero crumbs={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }]} eyebrow="Research services" title="Laboratory expertise for herbal medicine">
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
            The same analytical, pharmacological and formulation capabilities that drive our research are available to manufacturers, researchers and regulators.
          </p>
          <a href={enquiry} className="group mt-9 inline-flex items-center gap-2.5 bg-white px-7 py-4 text-[15px] font-semibold text-forest transition-colors hover:bg-leaf-light">
            Make an enquiry <Arrow />
          </a>
        </PageHero>

        {/* Services */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <Eyebrow>What we offer</Eyebrow>
          <h2 className={`mt-5 max-w-3xl ${sectionHeading}`}>From raw plant material to finished product</h2>
          <ul className="mt-14 grid gap-px bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <li key={service.title} className="flex flex-col bg-white p-8">
                <span className="font-display text-3xl font-medium text-leaf">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-5 font-display text-[1.45rem] font-medium leading-tight text-ink">{service.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-moss">{service.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Who we work with */}
        <section className="bg-cream">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
            <Eyebrow>Who we work with</Eyebrow>
            <ul className="mt-10 grid gap-10 md:grid-cols-3">
              {audiences.map((audience) => (
                <li key={audience.title} className="border-t-2 border-leaf pt-6">
                  <h3 className="font-display text-2xl font-medium text-ink">{audience.title}</h3>
                  <p className="mt-3 leading-relaxed text-moss">{audience.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Process */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.5fr]">
            <div>
              <Eyebrow>How it works</Eyebrow>
              <h2 className={`mt-5 ${sectionHeading}`}>Working with the Centre</h2>
              <p className="mt-5 leading-relaxed text-moss">
                Every request is different, so we agree the scope with you before starting. Contact us for current pricing and turnaround times.
              </p>
            </div>
            <ol className="divide-y divide-line border-y border-line">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-6 py-6">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-semibold text-white">{i + 1}</span>
                  <div>
                    <h3 className="font-display text-xl font-medium text-ink">{step.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-moss">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-forest-deep text-white">
          <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-16 md:flex-row md:items-center lg:px-10">
            <div>
              <h2 className="font-display text-[clamp(1.8rem,3vw,2.5rem)] font-medium leading-tight text-white">Have samples to test or a project in mind?</h2>
              <p className="mt-3 max-w-xl leading-relaxed text-white/70">Email us at <a href={enquiry} className="text-leaf-light underline underline-offset-4 hover:text-white">{contactEmail}</a> or see our other contact options.</p>
            </div>
            <Link href="/contact" className="group inline-flex shrink-0 items-center gap-2.5 bg-leaf px-6 py-3.5 text-sm font-semibold text-forest-deep transition-colors hover:bg-leaf-light">
              Contact the Centre <Arrow />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
