import { notFound } from "next/navigation";
import type { NewsPost } from "../../../../../lib/news";
import { createClient } from "../../../../../lib/supabase/server";
import { EditorForm, PublishPanel, Row, Section, SelectField, TextAreaField, TextField } from "../../../_components/editor";
import PageHeader from "../../../_components/page-header";
import { requireAdmin } from "../../../auth";
import { deletePost, updatePost } from "../actions";

export default async function EditPostPage(props: PageProps<"/admin/news/[id]">) {
  await requireAdmin();
  const { id } = await props.params;

  const supabase = await createClient();
  const { data, error: loadError } = await supabase.from("news_posts").select("*").eq("id", id).maybeSingle();
  if (loadError) throw new Error(loadError.message);
  if (!data) notFound();

  const post = data as NewsPost;

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Admin", href: "/admin" }, { name: "News & events", href: "/admin/news" }, { name: post.title }]}
        title="Edit post"
        description="The summary appears in lists on the home and news pages; the full story appears on the post's own page."
      />
      <div className="p-4 md:p-8">
        <EditorForm
          action={updatePost}
          id={post.id}
          aside={
            <PublishPanel
              published={post.published}
              publishLabel="Published"
              publishHint="Show on the News & Events page and the home page."
              viewHref={`/news/${post.slug}`}
              saveLabel="Save post"
              remove={{ action: deletePost, fields: { id: post.id }, title: `Delete “${post.title}”?`, description: "The post will be removed from the site. This cannot be undone.", label: "Delete post" }}
              notes={
                <>
                  <p>Use a <strong>specific, descriptive title</strong> and lead with what changed or was learned.</p>
                  <p>Upcoming events are listed first on the home page until their date has passed.</p>
                </>
              }
            />
          }
        >
          <Section title="Post">
            <TextField name="title" label="Title" defaultValue={post.title} required />
            <Row>
              <SelectField name="kind" label="Type" defaultValue={post.kind} options={[{ value: "news", label: "News" }, { value: "event", label: "Event" }]} />
              <TextField name="date" label="Date" type="date" defaultValue={post.date} required hint="For events, the day the event takes place." />
            </Row>
            <TextField name="location" label="Location" defaultValue={post.location} placeholder="e.g. School of Pharmacy auditorium, Ho" hint="Shown for events only." />
          </Section>

          <Section title="Story">
            <TextAreaField name="summary" label="Summary" rows={3} defaultValue={post.summary} placeholder="One or two sentences that tell readers what happened or what's coming up" />
            <TextAreaField name="body" label="Full story" rows={14} defaultValue={post.body} placeholder="Optional — without it, the post page shows the summary only" hint="Leave a blank line between paragraphs." />
          </Section>

          <Section title="Web address">
            <TextField name="slug" label="Slug" defaultValue={post.slug} pattern="[a-z0-9\-]*" hint={`/news/${post.slug}`} />
          </Section>
        </EditorForm>
      </div>
    </>
  );
}
