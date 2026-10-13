"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import { requireAdmin } from "../admin-page-shell";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80).replace(/-+$/, "");
}

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function slugError(path: string, error: { code?: string; message: string }): never {
  fail(path, error.code === "23505" ? "Another post already uses that web address." : error.message);
}

function refreshSite() {
  revalidatePath("/", "layout");
}

function kind(formData: FormData) {
  return text(formData, "kind") === "event" ? "event" : "news";
}

export async function createPost(formData: FormData) {
  await requireAdmin();
  const title = text(formData, "title");
  if (!title) fail("/admin/news", "Give the post a title.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news_posts")
    .insert({ title, slug: slugify(title), kind: kind(formData), date: text(formData, "date") || undefined, published: false })
    .select("id")
    .single();
  if (error) slugError("/admin/news", error);

  refreshSite();
  redirect(`/admin/news/${data.id}?saved=post-created`);
}

export async function updatePost(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const path = `/admin/news/${id}`;
  const title = text(formData, "title");
  const slug = slugify(text(formData, "slug") || title);
  const date = text(formData, "date");
  if (!title || !slug) fail(path, "The post needs a title and web address.");
  if (!date) fail(path, "The post needs a date.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("news_posts")
    .update({
      title,
      slug,
      kind: kind(formData),
      date,
      location: text(formData, "location"),
      summary: text(formData, "summary"),
      body: text(formData, "body"),
      published: formData.get("published") === "on",
    })
    .eq("id", id);
  if (error) slugError(path, error);

  refreshSite();
  redirect(`${path}?saved=post`);
}

export async function deletePost(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const supabase = await createClient();
  const { error } = await supabase.from("news_posts").delete().eq("id", id);
  if (error) fail(`/admin/news/${id}`, error.message);

  refreshSite();
  redirect("/admin/news?saved=post-deleted");
}
