import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFooter from "../../../components/site-footer";
import SiteHeader from "../../../components/site-header";
import { Arrow, PageHero } from "../../../components/ui";
import { formatPostDate, getNews, getNewsPost, isUpcoming } from "../../../lib/news";
import { centreName } from "../../../lib/site-content";

export async function generateMetadata(props: PageProps<"/news/[slug]">): Promise<Metadata> {
  const post = await getNewsPost((await props.params).slug);
  return post ? { title: `${post.title} · ${centreName}`, description: post.summary } : {};
}

export default async function NewsPostPage(props: PageProps<"/news/[slug]">) {
  const { slug } = await props.params;
  const posts = await getNews();
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const paragraphs = post.body.split(/\r?\n\s*\r?\n/).map((p) => p.trim()).filter(Boolean);
  const more = posts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <PageHero
          crumbs={[{ name: "Home", href: "/" }, { name: "News & Events", href: "/news" }, { name: post.kind === "event" ? "Event" : "News", href: `/news/${post.slug}` }]}
          eyebrow={`${post.kind === "event" ? (isUpcoming(post) ? "Upcoming event" : "Event") : "News"} · ${formatPostDate(post)}`}
          title={post.title}
        >
          {post.summary && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">{post.summary}</p>}
        </PageHero>

        <article className="mx-auto max-w-3xl px-6 py-16 lg:py-20">
          {post.kind === "event" && (
            <dl className="mb-12 grid gap-px bg-line ring-1 ring-line sm:grid-cols-2">
              <div className="bg-cream px-6 py-5">
                <dt className="text-xs font-semibold uppercase tracking-[.09em] text-leaf-dark">Date</dt>
                <dd className="mt-1.5 font-medium text-ink">{formatPostDate(post)}</dd>
              </div>
              {post.location && (
                <div className="bg-cream px-6 py-5">
                  <dt className="text-xs font-semibold uppercase tracking-[.09em] text-leaf-dark">Location</dt>
                  <dd className="mt-1.5 font-medium text-ink">{post.location}</dd>
                </div>
              )}
            </dl>
          )}

          {paragraphs.length > 0 ? (
            <div className="space-y-6 text-[18px] leading-[1.75] text-ink/85">
              {paragraphs.map((paragraph, i) => <p key={i} className="whitespace-pre-line">{paragraph}</p>)}
            </div>
          ) : (
            !post.summary && <p className="text-lg text-moss">More details will be posted soon.</p>
          )}

          <Link href="/news" className="group mt-14 inline-flex items-center gap-2 text-sm font-semibold text-leaf-dark hover:text-forest">
            All news &amp; events <Arrow />
          </Link>
        </article>

        {more.length > 0 && (
          <section className="bg-cream">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
              <h2 className="font-sans text-xs font-semibold uppercase tracking-[.09em] text-moss">More from the Centre</h2>
              <ul className="mt-6 grid gap-6 md:grid-cols-3">
                {more.map((p) => (
                  <li key={p.id}>
                    <Link href={`/news/${p.slug}`} className="group flex h-full flex-col bg-white p-7 ring-1 ring-line transition-shadow hover:shadow-[0_30px_60px_-30px_rgba(6,48,31,.4)]">
                      <p className={`text-xs font-semibold uppercase tracking-[.09em] ${p.kind === "event" ? "text-amber-700" : "text-leaf-dark"}`}>
                        {p.kind === "event" ? "Event" : "News"} · {formatPostDate(p)}
                      </p>
                      <h3 className="mt-3 flex-1 font-display text-xl font-medium leading-snug text-ink group-hover:text-forest">{p.title}</h3>
                      <span className="mt-6 text-leaf-dark"><Arrow /></span>
                    </Link>
                  </li>
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
