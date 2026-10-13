import type { Metadata } from "next";
import NewsList from "../../components/news-list";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import { Eyebrow, PageHero, sectionHeading } from "../../components/ui";
import { getNews, isUpcoming } from "../../lib/news";
import { centreName } from "../../lib/site-content";

export const metadata: Metadata = {
  title: `News & Events · ${centreName}`,
  description: "News, announcements and upcoming events from the Centre for Phytomedicine and Natural Product Drug Discovery.",
};

export default async function NewsPage() {
  const posts = await getNews();
  const upcoming = posts.filter(isUpcoming).sort((a, b) => a.date.localeCompare(b.date));
  const rest = posts.filter((post) => !isUpcoming(post));

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <PageHero crumbs={[{ name: "Home", href: "/" }, { name: "News & Events", href: "/news" }]} eyebrow="News & events" title="What’s happening at the Centre">
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
            Research news, announcements from our labs and the Physic Garden, and events you can join.
          </p>
        </PageHero>

        <div className="mx-auto max-w-5xl px-6 py-20 lg:px-10 lg:py-24">
          {posts.length === 0 && <p className="text-lg text-moss">News from the Centre will appear here soon.</p>}

          {upcoming.length > 0 && (
            <section aria-labelledby="upcoming" className="mb-20">
              <Eyebrow>Coming up</Eyebrow>
              <h2 id="upcoming" className={`mt-5 ${sectionHeading}`}>Upcoming events</h2>
              <div className="mt-10"><NewsList posts={upcoming} /></div>
            </section>
          )}

          {rest.length > 0 && (
            <section aria-labelledby="latest">
              <Eyebrow>Latest</Eyebrow>
              <h2 id="latest" className={`mt-5 ${sectionHeading}`}>News &amp; past events</h2>
              <div className="mt-10"><NewsList posts={rest} /></div>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
