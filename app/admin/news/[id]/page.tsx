import Link from "next/link";
import { notFound } from "next/navigation";
import type { NewsPost } from "../../../../lib/news";
import { createClient } from "../../../../lib/supabase/server";
import { AdminPageShell, requireAdmin } from "../../admin-page-shell";
import ConfirmButton from "../../confirm-button";
import AdminNotice from "../../notice";
import { deletePost, updatePost } from "../actions";

export default async function EditPostPage(props: PageProps<"/admin/news/[id]">) {
  await requireAdmin();
  const { id } = await props.params;
  const { saved, error } = (await props.searchParams) as { saved?: string; error?: string };

  const supabase = await createClient();
  const { data, error: loadError } = await supabase.from("news_posts").select("*").eq("id", id).maybeSingle();
  if (loadError) throw new Error(loadError.message);
  if (!data) notFound();

  const post = data as NewsPost;

  return (
    <AdminPageShell eyebrow="Content / News & events" title="Edit post" intro="The summary appears in lists on the home and news pages; the full story appears on the post's own page.">
      <section className="admin-editor-grid">
        <div className="admin-stack">
          <AdminNotice saved={saved} error={error} />

          <form action={updatePost} className="admin-editor-card">
            <input type="hidden" name="id" value={post.id} />

            <h2 className="admin-form-heading">Post</h2>
            <label htmlFor="title">Title</label>
            <input id="title" name="title" defaultValue={post.title} required />
            <div className="admin-form-row admin-form-row--even">
              <div>
                <label htmlFor="kind">Type</label>
                <select id="kind" name="kind" defaultValue={post.kind}>
                  <option value="news">News</option>
                  <option value="event">Event</option>
                </select>
              </div>
              <div><label htmlFor="date">Date <span>event day for events</span></label><input id="date" name="date" type="date" defaultValue={post.date} required /></div>
            </div>
            <label htmlFor="location">Location <span>events only</span></label>
            <input id="location" name="location" defaultValue={post.location} placeholder="e.g. School of Pharmacy auditorium, Ho" />

            <h2 className="admin-form-heading">Story</h2>
            <label htmlFor="summary">Summary</label>
            <textarea id="summary" name="summary" rows={3} defaultValue={post.summary} placeholder="One or two sentences that tell readers what happened or what's coming up" />
            <label htmlFor="body">Full story <span>blank line between paragraphs</span></label>
            <textarea id="body" name="body" rows={12} defaultValue={post.body} placeholder="Optional — without it, the post page shows the summary only" />

            <h2 className="admin-form-heading">Display</h2>
            <div className="admin-form-row admin-form-row--even">
              <div><label htmlFor="slug">Web address</label><input id="slug" name="slug" defaultValue={post.slug} pattern="[a-z0-9\-]*" /></div>
              <div className="admin-checkbox">
                <input id="published" name="published" type="checkbox" defaultChecked={post.published} />
                <label htmlFor="published">Published on the site</label>
              </div>
            </div>

            <div className="admin-actions">
              <button type="submit">Save post</button>
              <ConfirmButton formAction={deletePost} message={`Delete “${post.title}”? This cannot be undone.`} className="admin-danger">
                Delete post
              </ConfirmButton>
            </div>
          </form>
        </div>

        <aside className="admin-editor-side">
          <span className="admin-card-index">{post.published ? "Published" : "Draft"}</span>
          <h2>{post.published ? "Live on the site." : "Not visible yet."}</h2>
          <p>
            {post.published
              ? "Visitors can read this post on the News & Events page."
              : "Tick “Published” and save when the post is ready for visitors."}
          </p>
          {post.published && <p><Link className="admin-side-link" href={`/news/${post.slug}`} target="_blank">View the post ↗</Link></p>}
          <ul>
            <li>Use a specific, descriptive title.</li>
            <li>Lead with what changed or was learned.</li>
            <li>Upcoming events are listed first on the home page until their date has passed.</li>
          </ul>
          <p><Link className="admin-side-link" href="/admin/news">← All posts</Link></p>
        </aside>
      </section>
    </AdminPageShell>
  );
}
