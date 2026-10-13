"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../../lib/supabase/server";
import { requireAdmin } from "../../auth";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

// Textareas hold one list item per line.
function lines(formData: FormData, key: string) {
  return text(formData, key).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function refreshSite() {
  revalidatePath("/", "layout");
}

export async function createLab(formData: FormData) {
  await requireAdmin();
  const name = text(formData, "name");
  if (!name) fail("/admin/lab-profiles", "Give the lab a name.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("labs")
    .insert({ name, slug: slugify(text(formData, "slug") || name), published: false })
    .select("id")
    .single();
  if (error) fail("/admin/lab-profiles", error.code === "23505" ? "A lab with that web address already exists." : error.message);

  refreshSite();
  redirect(`/admin/lab-profiles/${data.id}?saved=created`);
}

export async function updateLab(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const path = `/admin/lab-profiles/${id}`;
  const name = text(formData, "name");
  const slug = slugify(text(formData, "slug") || name);
  if (!name || !slug) fail(path, "The lab needs a name and web address.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("labs")
    .update({
      name,
      slug,
      tagline: text(formData, "tagline"),
      objective: text(formData, "objective"),
      summary: text(formData, "summary"),
      aims: lines(formData, "aims"),
      research_areas: lines(formData, "research_areas"),
      techniques: lines(formData, "techniques"),
      lead_name: text(formData, "lead_name"),
      lead_title: text(formData, "lead_title"),
      lead_bio: text(formData, "lead_bio"),
      lead_email: text(formData, "lead_email"),
      lead_photo_url: text(formData, "lead_photo_url"),
      contact_email: text(formData, "contact_email"),
      location: text(formData, "location"),
      sort_order: Number(text(formData, "sort_order")) || 0,
      published: formData.get("published") === "on",
    })
    .eq("id", id);
  if (error) fail(path, error.code === "23505" ? "Another lab already uses that web address." : error.message);

  refreshSite();
  redirect(`${path}?saved=lab`);
}

export async function deleteLab(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const supabase = await createClient();
  const { error } = await supabase.from("labs").delete().eq("id", id);
  if (error) fail(`/admin/lab-profiles/${id}`, error.message);

  refreshSite();
  redirect("/admin/lab-profiles?saved=deleted");
}

function memberFields(formData: FormData) {
  return {
    name: text(formData, "name"),
    role: text(formData, "role"),
    research_topic: text(formData, "research_topic"),
    email: text(formData, "email"),
    photo_url: text(formData, "photo_url"),
    sort_order: Number(text(formData, "sort_order")) || 0,
  };
}

export async function addMember(formData: FormData) {
  await requireAdmin();
  const labId = text(formData, "lab_id");
  const path = `/admin/lab-profiles/${labId}`;
  const fields = memberFields(formData);
  if (!fields.name) fail(path, "Give the new member a name.");

  const supabase = await createClient();
  const { error } = await supabase.from("lab_members").insert({ ...fields, lab_id: labId });
  if (error) fail(path, error.message);

  refreshSite();
  redirect(`${path}?saved=member#members`);
}

export async function updateMember(formData: FormData) {
  await requireAdmin();
  const path = `/admin/lab-profiles/${text(formData, "lab_id")}`;
  const fields = memberFields(formData);
  if (!fields.name) fail(path, "Members need a name.");

  const supabase = await createClient();
  const { error } = await supabase.from("lab_members").update(fields).eq("id", text(formData, "id"));
  if (error) fail(path, error.message);

  refreshSite();
  redirect(`${path}?saved=member#members`);
}

export async function deleteMember(formData: FormData) {
  await requireAdmin();
  const path = `/admin/lab-profiles/${text(formData, "lab_id")}`;
  const supabase = await createClient();
  const { error } = await supabase.from("lab_members").delete().eq("id", text(formData, "id"));
  if (error) fail(path, error.message);

  refreshSite();
  redirect(`${path}?saved=removed#members`);
}
