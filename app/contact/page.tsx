import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import { Arrow, Eyebrow, PageHero } from "../../components/ui";
import { getLabs } from "../../lib/labs";
import { centreName, contactEmail, mapUrl, postalAddress } from "../../lib/site-content";

export const metadata: Metadata = {
  title: `Contact & Directions · ${centreName}`,
  description: "Contact the Centre for research collaboration, services, and student and visiting researcher opportunities.",
};

const enquiries = [
  { title: "Research collaboration", body: "Joint projects, grant partnerships and shared access to plant material or equipment.", subject: "Research collaboration" },
  { title: "Laboratory services", body: "Testing, quality control and product development for manufacturers and other organisations.", subject: "Service enquiry" },
  { title: "Study with us", body: "MPhil and PhD study, internships, and visits from postdoctoral and visiting researchers.", subject: "Graduate study and research opportunities" },
  { title: "Visit the Physic Garden", body: "Guided visits for schools, students, practitioners and community groups.", subject: "Physic Garden visit" },
];

function mailto(subject: string) {
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}`;
}

export default async function ContactPage() {
  const labs = (await getLabs().catch(() => [])).filter((lab) => lab.contact_email || lab.lead_email);

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <PageHero crumbs={[{ name: "Home", href: "/" }, { name: "Contact", href: "/contact" }]} eyebrow="Contact & directions" title="Start a conversation">
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
            Get in touch about research collaboration, our laboratory services, or opportunities to study and work with the Centre.
          </p>
        </PageHero>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr]">
            {/* Enquiry types */}
            <div>
              <Eyebrow>How can we help?</Eyebrow>
              <ul className="mt-8 grid gap-px bg-line ring-1 ring-line sm:grid-cols-2">
                {enquiries.map((enquiry) => (
                  <li key={enquiry.title}>
                    <a href={mailto(enquiry.subject)} className="group flex h-full flex-col bg-white p-7 transition-colors hover:bg-cream">
                      <h2 className="font-display text-xl font-medium text-ink group-hover:text-forest">{enquiry.title}</h2>
                      <p className="mt-2 flex-1 text-[15px] leading-relaxed text-moss">{enquiry.body}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-leaf-dark">Email us <Arrow /></span>
                    </a>
                  </li>
                ))}
              </ul>

              {labs.length > 0 && (
                <div className="mt-14">
                  <h2 className="font-sans text-xs font-semibold uppercase tracking-[.09em] text-moss">Contact a lab directly</h2>
                  <ul className="mt-5 divide-y divide-line border-y border-line">
                    {labs.map((lab) => {
                      const email = lab.contact_email || lab.lead_email;
                      return (
                        <li key={lab.id} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
                          <Link href={`/labs/${lab.slug}`} className="font-display text-lg font-medium text-ink hover:text-forest">{lab.name}</Link>
                          <a href={`mailto:${email}`} className="text-sm text-forest underline decoration-leaf/40 underline-offset-4">{email}</a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* Details */}
            <aside className="space-y-6">
              <div className="relative overflow-hidden bg-forest-deep p-8 text-white">
                <span aria-hidden className="absolute left-0 top-0 h-1 w-full bg-leaf" />
                <h2 className="font-sans text-xs font-semibold uppercase tracking-[.09em] text-leaf-light">Email</h2>
                <a href={`mailto:${contactEmail}`} className="mt-3 block break-words font-display text-2xl font-medium text-white underline decoration-leaf/50 underline-offset-4 hover:text-leaf-light">
                  {contactEmail}
                </a>
                <p className="mt-3 text-sm leading-relaxed text-white/65">We aim to reply within a few working days.</p>
              </div>

              <div className="bg-cream p-8 ring-1 ring-line">
                <h2 className="font-sans text-xs font-semibold uppercase tracking-[.09em] text-moss">Postal address</h2>
                <address className="mt-3 not-italic leading-relaxed text-ink">
                  {centreName}
                  {postalAddress.map((line) => <span key={line} className="block">{line}</span>)}
                </address>
              </div>

              <div className="bg-cream p-8 ring-1 ring-line">
                <h2 className="font-sans text-xs font-semibold uppercase tracking-[.09em] text-moss">Finding us</h2>
                <p className="mt-3 leading-relaxed text-ink">
                  The Centre is based at the School of Pharmacy on the University of Health and Allied Sciences campus in Ho, the capital of the Volta Region.
                </p>
                <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-leaf-dark hover:text-forest">
                  Open in Google Maps <Arrow />
                </a>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
