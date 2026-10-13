import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import Link from "next/link";
import BotanicalLineArt from "../../components/botanical-line-art";
import PlantCatalogue from "../../components/plant-catalogue";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import { getPlants } from "../../lib/garden";

export const metadata: Metadata = {
  title: "Physic Garden · Centre for Phytomedicine and Natural Product Drug Discovery",
  description: "A living collection of medicinal plants cultivated for research, education and innovation.",
};

const script = Caveat({ subsets: ["latin"], weight: ["500"] });

const heroPhoto = { src: "/garden/hero-neem.jpg", credit: "Melburnian / CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Azadirachta_indica_Kewarra_4621.jpg" };

function Icon({ children, className = "h-7 w-7" }: { children: React.ReactNode; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

const paths = {
  leaf: <path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14m0 0 7-7" />,
  flask: <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3M7.5 15h9" />,
  cap: <path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Zm3 2v5c2 1.7 4 2.5 6 2.5s4-.8 6-2.5v-5M21 8.5V14" />,
  dna: <path d="M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9M9 6.5h6M9 17.5h6" />,
  people: <path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6.5 9c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.3a3.5 3.5 0 0 1 0 6.4M18 14.4c2.1.7 3.5 2.8 3.5 5.6" />,
};

const impact = [
  { title: "Natural Product Discovery", icon: paths.dna },
  { title: "Phytochemistry & Bioassays", icon: paths.flask },
  { title: "Student Learning", icon: paths.cap },
  { title: "Community & Global Health", icon: paths.people },
];

export default async function PhysicGardenPage() {
  const plants = await getPlants();
  const credits = plants.filter((p) => p.photo_url && p.photo_credit);

  const highlights = [
    { icon: paths.leaf, title: String(plants.length), subtitle: "Plant species", body: "Cultivated and maintained in our garden" },
    { icon: paths.flask, title: "Research", body: "Natural product discovery and drug development" },
    { icon: paths.cap, title: "Education", body: "Hands-on learning for future healthcare leaders" },
  ];

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-forest-deep text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroPhoto.src} alt="" className="absolute inset-y-0 right-0 h-full w-full object-cover md:w-[68%]" />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,#06301f_0%,#06301f_34%,rgba(6,48,31,.82)_50%,rgba(6,48,31,.25)_75%,rgba(6,48,31,.1)_100%)] max-md:bg-[linear-gradient(180deg,rgba(6,48,31,.75),#06301f_85%)]" />

          <div className="relative mx-auto flex min-h-[460px] max-w-7xl flex-col justify-center px-6 py-20 lg:min-h-[520px] lg:px-10">
            <p className="text-sm font-semibold uppercase tracking-[.28em] text-white/85">Welcome to our</p>
            <h1 className="mt-3 font-display text-[clamp(3.25rem,7vw,5.5rem)] leading-[.95] tracking-[-.025em] text-white">Physic Garden</h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/85">
              Discover the medicinal and economic potential of our diverse plant species, cultivated for research, education and innovation.
            </p>
            <a
              href="#plants"
              className="group mt-9 inline-flex w-fit items-center gap-3 rounded-full border border-white/70 py-3 pl-3.5 pr-6 text-[15px] font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-forest"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 group-hover:bg-forest/10">
                <Icon className="h-4 w-4">{paths.leaf}</Icon>
              </span>
              Explore plant collection
              <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 10h11m-4-4 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          <div className="absolute bottom-10 right-8 hidden text-right lg:block xl:right-14">
            <p className={`${script.className} text-[2.1rem] leading-[1.05] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,.45)]`}>
              Nature<br />Inspires<br />Better<br />Medicines
            </p>
            <span aria-hidden className="ml-auto mt-3 block h-px w-20 bg-white/70" />
          </div>
        </section>

        {/* About */}
        <section className="relative overflow-hidden bg-[#f3f6f2]">
          <BotanicalLineArt className="pointer-events-none absolute -right-16 top-1/2 hidden h-[110%] -translate-y-1/2 -rotate-12 text-forest/20 xl:block" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1fr_1.25fr] lg:items-center lg:px-10 xl:pr-40">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-leaf-dark">About the Physic Garden</p>
              <h2 className="mt-3 font-display text-[clamp(2rem,3.4vw,2.75rem)] leading-[1.1] tracking-[-.015em] text-ink">Discover the Physic Garden</h2>
              <p className="mt-5 text-[17px] leading-relaxed text-moss">
                The Physic Garden at the Centre for Phytomedicine and Natural Product Drug Discovery is a living collection of medicinal and economically important plants. It supports teaching, botanical education, phytochemical research and the exploration of natural products with potential pharmaceutical applications.
              </p>
              <Link href="/research" className="group mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-forest hover:text-leaf-dark">
                Learn more about our research
                <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 10h11m-4-4 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <ul className="grid gap-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-forest/15">
              {highlights.map((item) => (
                <li key={item.title} className="flex flex-col items-center px-6 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dcebe0] text-forest">
                    <Icon>{item.icon}</Icon>
                  </span>
                  <p className="mt-5 font-display text-[1.65rem] leading-none text-ink">{item.title}</p>
                  {item.subtitle && <p className="mt-1.5 font-display text-lg text-ink">{item.subtitle}</p>}
                  <p className="mt-2.5 max-w-[16rem] text-sm leading-relaxed text-moss">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Collection */}
        <section id="plants" className="scroll-mt-28 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
            <PlantCatalogue plants={plants} />

            <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 text-sm text-moss lg:flex-row lg:items-start lg:justify-between">
              <p className="max-w-2xl leading-relaxed">
                Traditional uses are recorded for education and research. They are not medical advice — please consult a qualified health professional before using any herbal remedy.
              </p>
              {credits.length > 0 && (
                <details className="group shrink-0 lg:max-w-md lg:text-right">
                  <summary className="cursor-pointer list-none font-medium text-forest hover:text-leaf-dark">
                    Photo credits <span aria-hidden className="inline-block transition-transform group-open:rotate-180">▾</span>
                  </summary>
                  <ul className="mt-3 space-y-1 text-xs leading-relaxed">
                    <li>Hero: <a href={heroPhoto.url} className="underline underline-offset-2 hover:text-forest">{heroPhoto.credit}</a></li>
                    {credits.map((plant) => (
                      <li key={plant.id}>
                        <i>{plant.botanical_name}</i>:{" "}
                        {plant.photo_credit_url ? (
                          <a href={plant.photo_credit_url} className="underline underline-offset-2 hover:text-forest">{plant.photo_credit}</a>
                        ) : (
                          plant.photo_credit
                        )}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          </div>
        </section>

        {/* Research & impact */}
        <section className="relative overflow-hidden bg-forest-deep text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroPhoto.src} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[.12]" />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,#06301f_30%,rgba(6,48,31,.75))]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1fr_1.6fr] lg:items-center lg:px-10 lg:py-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-leaf-light">Explore further</p>
              <h2 className="mt-3 font-display text-[clamp(2rem,3.4vw,2.75rem)] leading-[1.1] tracking-[-.015em] text-white">Our Research &amp; Impact</h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/75">
                From traditional knowledge to modern drug discovery, our work bridges nature and science for better health.
              </p>
              <Link href="/research" className="group mt-7 inline-flex items-center gap-2 rounded-full border border-white/70 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-forest">
                Explore research
                <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 10h11m-4-4 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-y-10 md:grid-cols-4 md:divide-x md:divide-white/15">
              {impact.map((item) => (
                <li key={item.title} className="flex flex-col items-center px-4 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/25">
                    <Icon>{item.icon}</Icon>
                  </span>
                  <p className="mt-4 max-w-[10rem] font-display text-lg leading-snug text-white">{item.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
