import Link from "next/link";
import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";
import BotanicalLineArt from "../components/botanical-line-art";
import LabMark from "../components/lab-mark";
import { Arrow, Eyebrow, sectionHeading } from "../components/ui";
import { getLabs } from "../lib/labs";
import { focusAreas, news, publications, stats } from "../lib/site-content";

const icons: Record<string, React.ReactNode> = {
  leaf: <path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14m0 0 7-7" />,
  flask: <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3M7.5 15h9" />,
  capsule: <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7ZM8.5 8.5l7 7" />,
  shield: <path d="M12 3 4.5 6v5.5c0 4.5 3.2 8.3 7.5 9.5 4.3-1.2 7.5-5 7.5-9.5V6L12 3Zm-3 9 2 2 4-4" />,
};

function HeroArt() {
  return (
    <figure aria-hidden className="relative mx-auto w-full max-w-[420px]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-[linear-gradient(180deg,#137a4c_0%,#0a5235_100%)] ring-1 ring-white/15">
        <div className="absolute inset-0 opacity-[.08] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:32px_32px]" />
        <BotanicalLineArt className="absolute inset-x-0 bottom-0 h-[92%] w-full text-leaf-light" />
      </div>
      <div className="absolute -inset-3 rounded-t-full border border-white/10" />
    </figure>
  );
}

export default async function Home() {
  const labs = await getLabs().catch(() => []);

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-forest text-white">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(63,191,120,.32),transparent_55%),radial-gradient(ellipse_at_0%_100%,rgba(0,0,0,.35),transparent_60%)]" />
          <div aria-hidden className="absolute inset-0 opacity-[.07] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-28 pt-16 lg:grid-cols-[1.25fr_1fr] lg:gap-20 lg:px-10 lg:pb-36 lg:pt-24">
            <div>
              <Eyebrow light>School of Pharmacy · UHAS</Eyebrow>
              <h1 className="mt-6 font-display text-[clamp(2.75rem,5.6vw,4.75rem)] font-normal leading-[1.02] tracking-[-.025em] text-white">
                Advancing medicine through <em className="text-leaf-light">nature&rsquo;s chemistry</em>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/75">
                We discover, validate and develop medicines from West Africa&rsquo;s rich medicinal flora — bringing rigorous pharmaceutical science to traditional knowledge.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/research" className="group inline-flex items-center gap-2.5 bg-white px-7 py-4 text-[15px] font-semibold text-forest transition-colors hover:bg-leaf-light">
                  Explore our research <Arrow />
                </Link>
                <Link href="/contact" className="inline-flex items-center border border-white/35 px-7 py-4 text-[15px] font-semibold text-white transition-colors hover:border-white hover:bg-white/10">
                  Partner with us
                </Link>
              </div>
            </div>
            <HeroArt />
          </div>
        </section>

        {/* Stats strip */}
        <section aria-label="The Centre in numbers" className="relative z-10 mx-auto -mt-16 max-w-6xl px-6 lg:px-10">
          <dl className="grid grid-cols-2 bg-white shadow-[0_30px_60px_-30px_rgba(6,48,31,.35)] ring-1 ring-line lg:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.label} className={`px-6 py-8 sm:px-8 ${i > 0 ? "lg:border-l" : ""} ${i % 2 ? "border-l" : ""} ${i > 1 ? "border-t lg:border-t-0" : ""} border-line`}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-4xl font-medium text-forest lg:text-5xl">{s.value}</dd>
                <dd className="mt-2 text-sm leading-snug text-moss">{s.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Focus areas */}
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-end">
            <div>
              <Eyebrow>Research focus areas</Eyebrow>
              <h2 className={`mt-5 ${sectionHeading}`}>
                From plant to pharmacy, every step of discovery
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-moss lg:pb-2">
              Our multidisciplinary teams follow a candidate from ethnobotanical lead to standardised, safe and effective product.
            </p>
          </div>

          <div className="mt-14 grid gap-px bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-4">
            {focusAreas.map((area, i) => (
              <Link
                key={area.title}
                href="/research"
                className="group relative flex flex-col bg-white p-8 transition-colors duration-300 hover:bg-forest"
              >
                <span className="text-xs font-semibold tabular-nums tracking-[.08em] text-moss/60 group-hover:text-leaf-light">0{i + 1}</span>
                <span className="mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-cream text-forest transition-colors group-hover:bg-white/10 group-hover:text-leaf-light">
                  <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    {icons[area.icon]}
                  </svg>
                </span>
                <h3 className="mt-6 font-display text-[1.45rem] font-medium leading-tight text-ink group-hover:text-white">{area.title}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-moss group-hover:text-white/70">{area.body}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-leaf-dark group-hover:text-leaf-light">
                  Learn more <Arrow />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Publications */}
        <section id="publications" className="bg-cream">
          <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-[1fr_2fr] lg:px-10 lg:py-28">
            <div className="lg:sticky lg:top-40 lg:self-start">
              <Eyebrow>Featured publications</Eyebrow>
              <h2 className={`mt-5 ${sectionHeading}`}>
                Evidence that moves the field
              </h2>
              <p className="mt-5 leading-relaxed text-moss">Recent peer-reviewed work from Centre researchers and collaborators.</p>
              <Link href="/research#publications" className="group mt-8 inline-flex items-center gap-2.5 bg-forest px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-leaf-dark">
                View all publications <Arrow />
              </Link>
            </div>

            <ol className="divide-y divide-line border-y border-line">
              {publications.map((pub, i) => (
                <li key={pub.title} className="group grid gap-x-6 gap-y-3 py-7 sm:grid-cols-[auto_1fr_auto]">
                  <span className="font-display text-3xl font-medium text-leaf">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <span className="inline-block bg-white px-2.5 py-1 text-xs font-semibold uppercase tracking-[.09em] text-leaf-dark ring-1 ring-line">
                      {pub.tag}
                    </span>
                    <h3 className="mt-3 font-display text-xl font-medium leading-snug text-ink transition-colors group-hover:text-forest">{pub.title}</h3>
                    <p className="mt-2 text-sm text-moss">
                      {pub.authors} · <em>{pub.venue}</em>, {pub.year}
                    </p>
                  </div>
                  <div className="flex items-start gap-2 sm:pt-9">
                    {["DOI", "PDF"].map((label) => (
                      <a key={label} href="#" className="border border-line bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[.09em] text-forest transition-colors hover:border-forest hover:bg-forest hover:text-white">
                        {label}
                      </a>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Labs */}
        {labs.length > 0 && (
          <section id="labs" className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Eyebrow>Our labs</Eyebrow>
                <h2 className={`mt-5 ${sectionHeading}`}>The teams behind the science</h2>
              </div>
              <Link href="/labs" className="group inline-flex items-center gap-2 text-sm font-semibold text-leaf-dark hover:text-forest">
                All labs <Arrow />
              </Link>
            </div>

            <ul className="mt-14 grid gap-8 md:grid-cols-3">
              {labs.map((lab, i) => (
                <li key={lab.id}>
                  <Link href={`/labs/${lab.slug}`} className="group flex h-full flex-col bg-white ring-1 ring-line transition-shadow duration-300 hover:shadow-[0_30px_60px_-30px_rgba(6,48,31,.4)]">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <LabMark index={i} className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]" />
                      <span aria-hidden className="absolute bottom-0 left-0 h-1 w-0 bg-leaf-light transition-all duration-500 group-hover:w-full" />
                    </div>
                    <div className="flex flex-1 flex-col p-7">
                      <p className="text-xs font-semibold uppercase tracking-[.09em] text-leaf-dark">{lab.tagline}</p>
                      <h3 className="mt-2 font-display text-2xl font-medium text-ink group-hover:text-forest">{lab.name}</h3>
                      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-moss">{lab.objective}</p>
                      <p className="mt-6 border-t border-line pt-4 text-sm text-ink">
                        <span className="font-medium">{lab.lead_name}</span>
                        <span className="text-moss"> · {lab.lab_members.length} {lab.lab_members.length === 1 ? "member" : "members"}</span>
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Physic garden feature */}
        <section className="relative overflow-hidden bg-forest-deep text-white">
          <BotanicalLineArt className="absolute -bottom-10 right-[4%] hidden h-[115%] text-leaf-light/30 md:block" />
          <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10">
            <div className="max-w-2xl">
              <Eyebrow light>The Physic Garden</Eyebrow>
              <h2 className="mt-5 font-display text-[clamp(2rem,3.6vw,3rem)] font-medium leading-[1.08] tracking-[-.015em] text-white">
                A living library of medicinal plants
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/70">
                Our garden preserves authenticated specimens for teaching, voucher identification and sustainable sourcing — the starting point for much of our research.
              </p>
              <Link href="/physicgarden" className="group mt-9 inline-flex items-center gap-2.5 bg-white px-7 py-4 text-[15px] font-semibold text-forest transition-colors hover:bg-leaf-light">
                Visit the garden <Arrow />
              </Link>
            </div>
          </div>
        </section>

        {/* News + Join */}
        <section id="news" className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="grid gap-16 lg:grid-cols-[2fr_1fr]">
            <div>
              <Eyebrow>Lab news &amp; events</Eyebrow>
              <h2 className={`mt-5 ${sectionHeading}`}>What&rsquo;s happening</h2>
              <ul className="mt-10 divide-y divide-line border-t border-line">
                {news.map((item) => (
                  <li key={item.title}>
                    <Link href="#" className="group grid gap-4 py-7 sm:grid-cols-[140px_1fr_auto] sm:items-start">
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-[.09em] ${item.kind === "Event" ? "text-amber-700" : "text-leaf-dark"}`}>{item.kind}</p>
                        <p className="mt-1 text-sm text-moss">{item.date}</p>
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-medium leading-snug text-ink transition-colors group-hover:text-forest">{item.title}</h3>
                        <p className="mt-2 text-[15px] leading-relaxed text-moss">{item.body}</p>
                      </div>
                      <span className="hidden text-leaf-dark sm:block sm:pt-1.5"><Arrow /></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <aside id="join" className="relative flex flex-col justify-between overflow-hidden bg-cream p-9 ring-1 ring-line lg:mt-[7.5rem]">
              <span aria-hidden className="absolute left-0 top-0 h-1 w-full bg-leaf" />
              <div>
                <Eyebrow>Join our team</Eyebrow>
                <h3 className="mt-5 font-display text-[1.9rem] font-medium leading-tight text-ink">Build the future of phytomedicine with us</h3>
                <p className="mt-4 leading-relaxed text-moss">
                  We welcome graduate students, postdoctoral fellows and visiting researchers passionate about natural product discovery.
                </p>
              </div>
              <Link href="/contact" className="group mt-10 inline-flex items-center justify-center gap-2.5 bg-forest px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-leaf-dark">
                See opportunities <Arrow />
              </Link>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
