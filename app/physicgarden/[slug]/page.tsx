import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PlantCard, { PlantPhoto, categoryColor } from "../../../components/plant-card";
import SiteFooter from "../../../components/site-footer";
import SiteHeader from "../../../components/site-header";
import { getPlant, getPlants } from "../../../lib/garden";

export async function generateMetadata(props: PageProps<"/physicgarden/[slug]">): Promise<Metadata> {
  const plant = await getPlant((await props.params).slug);
  if (!plant) return {};
  const name = plant.common_name ? `${plant.common_name} (${plant.botanical_name})` : plant.botanical_name;
  const description = plant.description || undefined;
  // Shared links (WhatsApp, Facebook, …) preview with the plant's photo.
  return {
    title: `${name} · Physic Garden`,
    description,
    openGraph: { title: name, description, type: "article", images: plant.photo_url ? [{ url: plant.photo_url, alt: name }] : undefined },
  };
}

export default async function PlantPage(props: PageProps<"/physicgarden/[slug]">) {
  const { slug } = await props.params;
  const plants = await getPlants();
  const plant = plants.find((p) => p.slug === slug);
  if (!plant) notFound();

  const related = plants
    .filter((p) => p.slug !== plant.slug)
    .sort((a, b) => Number(b.category === plant.category) - Number(a.category === plant.category))
    .slice(0, 4);

  const facts = [
    { label: "Family", value: plant.family },
    { label: "Common name", value: plant.common_name },
    { label: "Local names", value: plant.local_names },
    { label: "Parts used", value: plant.parts_used.join(", ") },
  ].filter((fact) => fact.value);

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="bg-[#f3f6f2]">
          <div className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-10 lg:pb-20">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-moss">
                <li><Link href="/" className="hover:text-forest">Home</Link></li>
                <li aria-hidden>/</li>
                <li><Link href="/physicgarden" className="hover:text-forest">Physic Garden</Link></li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="font-medium text-ink">{plant.common_name || plant.botanical_name}</li>
              </ol>
            </nav>

            <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
              <figure>
                <PlantPhoto plant={plant} className="aspect-[4/3] rounded-3xl shadow-[0_30px_60px_-30px_rgba(6,48,31,.45)]" />
                {plant.photo_credit && (
                  <figcaption className="mt-3 text-xs text-moss">
                    Photo:{" "}
                    {plant.photo_credit_url ? (
                      <a href={plant.photo_credit_url} className="underline underline-offset-2 hover:text-forest">{plant.photo_credit}</a>
                    ) : (
                      plant.photo_credit
                    )}
                  </figcaption>
                )}
              </figure>

              <div className="flex flex-col justify-center">
                {plant.category && (
                  <span className="w-fit rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: categoryColor(plant.category) }}>
                    {plant.category}
                  </span>
                )}
                <h1 className="mt-4 font-display text-[clamp(2.5rem,5vw,3.75rem)] leading-[1.02] tracking-[-.02em] text-ink">
                  {plant.common_name || plant.botanical_name}
                </h1>
                {plant.common_name && <p className="mt-2 font-display text-2xl italic text-leaf-dark">{plant.botanical_name}</p>}
                {plant.description && <p className="mt-6 text-[17px] leading-relaxed text-ink/80">{plant.description}</p>}

                <dl className="mt-8 grid gap-x-8 gap-y-5 border-t border-forest/10 pt-6 sm:grid-cols-2">
                  {facts.map((fact) => (
                    <div key={fact.label}>
                      <dt className="text-xs font-semibold uppercase tracking-[.09em] text-moss">{fact.label}</dt>
                      <dd className="mt-1 text-[15px] text-ink">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-2">
            {plant.traditional_uses.length > 0 && (
              <div className="rounded-3xl bg-white p-8 ring-1 ring-line lg:p-10">
                <h2 className="font-display text-2xl text-ink">Traditional uses</h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {plant.traditional_uses.map((use) => (
                    <li key={use} className="rounded-full bg-[#e7f1ea] px-4 py-1.5 text-sm font-medium text-forest">{use}</li>
                  ))}
                </ul>
                <p className="mt-6 text-sm leading-relaxed text-moss">
                  Recorded for education and research. This is not medical advice — consult a qualified health professional before using any herbal remedy.
                </p>
              </div>
            )}
            <div className="rounded-3xl bg-forest p-8 text-white lg:p-10">
              <h2 className="font-display text-2xl text-white">In our research</h2>
              <p className="mt-4 leading-relaxed text-white/80">
                {plant.research_notes || "This species is part of our living reference collection, available for teaching and authenticated research use."}
              </p>
              {plant.lab && (
                <Link href={`/labs/${plant.lab.slug}`} className="group mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-leaf-light">
                  Visit the {plant.lab.name}
                  <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 10h11m-4-4 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="border-t border-line bg-[#f3f6f2]">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="font-display text-[clamp(1.8rem,3vw,2.4rem)] leading-tight text-ink">More from the garden</h2>
                <Link href="/physicgarden#plants" className="text-sm font-semibold text-forest hover:text-leaf-dark">View all plants →</Link>
              </div>
              <ul className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {related.map((other, i) => (
                  <li key={other.id}><PlantCard plant={other} index={i} /></li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
