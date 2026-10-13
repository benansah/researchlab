"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { plantSlug } from "../../../lib/garden";
import { createClient } from "../../../lib/supabase/server";
import { requireAdmin } from "../admin-page-shell";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

// Textareas hold one list item per line.
function lines(formData: FormData, key: string) {
  return text(formData, key).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function slugError(path: string, error: { code?: string; message: string }): never {
  fail(path, error.code === "23505" ? "Another plant already has that botanical name." : error.message);
}

function refreshSite() {
  revalidatePath("/", "layout");
}

export async function createPlant(formData: FormData) {
  await requireAdmin();
  const botanicalName = text(formData, "botanical_name");
  if (!botanicalName) fail("/admin/garden", "Give the plant its botanical name.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("garden_plants")
    .insert({ botanical_name: botanicalName, slug: plantSlug(botanicalName), common_name: text(formData, "common_name"), published: false })
    .select("id")
    .single();
  if (error) slugError("/admin/garden", error);

  refreshSite();
  redirect(`/admin/garden/${data.id}?saved=plant-created`);
}

export async function updatePlant(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const path = `/admin/garden/${id}`;
  const botanicalName = text(formData, "botanical_name");
  if (!botanicalName) fail(path, "The plant needs a botanical name.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("garden_plants")
    .update({
      botanical_name: botanicalName,
      slug: plantSlug(botanicalName),
      common_name: text(formData, "common_name"),
      local_names: text(formData, "local_names"),
      family: text(formData, "family"),
      category: text(formData, "category"),
      parts_used: lines(formData, "parts_used"),
      traditional_uses: lines(formData, "traditional_uses"),
      description: text(formData, "description"),
      research_notes: text(formData, "research_notes"),
      lab_id: text(formData, "lab_id") || null,
      photo_url: text(formData, "photo_url"),
      photo_credit: text(formData, "photo_credit"),
      photo_credit_url: text(formData, "photo_credit_url"),
      sort_order: Number(text(formData, "sort_order")) || 0,
      published: formData.get("published") === "on",
    })
    .eq("id", id);
  if (error) slugError(path, error);

  refreshSite();
  redirect(`${path}?saved=plant`);
}

export async function deletePlant(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const supabase = await createClient();
  const { error } = await supabase.from("garden_plants").delete().eq("id", id);
  if (error) fail(`/admin/garden/${id}`, error.message);

  refreshSite();
  redirect("/admin/garden?saved=plant-deleted");
}
