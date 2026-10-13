import Link from "next/link";
import { formatPostDate, type NewsPost } from "../../../lib/news";
import { createClient } from "../../../lib/supabase/server";
import { AdminPageShell, requireAdmin } from "../admin-page-shell";
import AdminNotice, { MissingTablesNotice } from "../notice";
import { createPost } from "./actions";

export default async function NewsAdminPage(props: PageProps<"/admin/news">) {
  await requireAdmin();
  const { saved, error } = (await props.searchParams) as { saved?: string; error?: string };

  const supabase = await createClient();
  const { data, error: loadError } = await supabase
    .from("news_posts")
    .select("id, slug, kind, title, summary, date, location, published")
    .order("date", { ascending: false });
  const posts = (data ?? []) as NewsPost[];

  return (
    <AdminPageShell eyebrow="Content / News & events" title="News & events" intro="Share announcements, lab news and upcoming events. Changes appear on the public site as soon as you save.">
      <section className="admin-editor-grid">
        <div className="admin-stack">
          <AdminNotice saved={saved} error={error} />
          {loadError ? (
            loadError.code === "PGRST205" ? <MissingTablesNotice migration="0004_publications_news.sql" /> : <p className="admin-error admin-notice">{loadError.message}</p>
          ) : (
            <ul className="admin-lab-list">
              {posts.map((post) => (
                <li key={post.id}>
                  <Link href={`/admin/news/${post.id}`}>
                    <span>
                      <strong className="admin-list-title">{post.title}</strong>
                      <small>{[post.kind === "event" ? "Event" : "News", formatPostDate(post), post.location].filter(Boolean).join(" · ")}</small>
                    </span>
                    <span className="admin-lab-meta">
                      <em className={post.published ? "is-live" : ""}>{post.published ? "Published" : "Draft"}</em>→
                    </span>
                  </Link>
                </li>
              ))}
              {posts.length === 0 && <li className="admin-muted">No posts yet — write the first one.</li>}
            </ul>
          )}
        </div>

        <form action={createPost} className="admin-editor-card admin-editor-side-form">
          <span className="admin-card-index">New post</span>
          <label htmlFor="post-title">Title</label>
          <input id="post-title" name="title" placeholder="A clear headline" required />
          <label htmlFor="post-kind">Type</label>
          <select id="post-kind" name="kind" defaultValue="news">
            <option value="news">News</option>
            <option value="event">Event</option>
          </select>
          <label htmlFor="post-date">Date</label>
          <input id="post-date" name="date" type="date" />
          <p className="admin-hint">For events, use the day the event takes place. Leave blank for today. You can write the full story on the next screen.</p>
          <button type="submit">Create post</button>
        </form>
      </section>
    </AdminPageShell>
  );
}
