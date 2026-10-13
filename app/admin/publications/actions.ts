"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import { requireAdmin } from "../admin-page-shell";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function refreshSite() {
  revalidatePath("/", "layout");
}

// Accepts a bare DOI ("10.1000/xyz") as well as a full link.
function doiLink(value: string) {
  return /^10\.\d{4,}\//.test(value) ? `https://doi.org/${value}` : value;
}

function year(formData: FormData) {
  const value = Number(text(formData, "year"));
  return Number.isInteger(value) && value > 1900 ? value : null;
}

export async function createPublication(formData: FormData) {
  await requireAdmin();
  const title = text(formData, "title");
  if (!title) fail("/admin/publications", "Give the publication its title.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("publications")
    .insert({ title, year: year(formData), published: false })
    .select("id")
    .single();
  if (error) fail("/admin/publications", error.message);

  refreshSite();
  redirect(`/admin/publications/${data.id}?saved=publication-created`);
}

export async function updatePublication(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const path = `/admin/publications/${id}`;
  const title = text(formData, "title");
  if (!title) fail(path, "The publication needs a title.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("publications")
    .update({
      title,
      authors: text(formData, "authors"),
      venue: text(formData, "venue"),
      year: year(formData),
      tag: text(formData, "tag"),
      abstract: text(formData, "abstract"),
      doi_url: doiLink(text(formData, "doi_url")),
      pdf_url: text(formData, "pdf_url"),
      lab_id: text(formData, "lab_id") || null,
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
    })
    .eq("id", id);
  if (error) fail(path, error.message);

  refreshSite();
  redirect(`${path}?saved=publication`);
}

export async function deletePublication(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const supabase = await createClient();
  const { error } = await supabase.from("publications").delete().eq("id", id);
  if (error) fail(`/admin/publications/${id}`, error.message);

  refreshSite();
  redirect("/admin/publications?saved=publication-deleted");
}
