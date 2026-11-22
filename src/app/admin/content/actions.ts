"use server";

import { revalidatePath } from "next/cache";
import { requireAdminPermission } from "@/lib/admin";

const read = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const types = ["announcement", "book_review", "article", "update"];
const statuses = ["draft", "published", "archived"];

function makeSlug(input: string) {
  return input.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 180);
}

export async function createContentPost(formData: FormData) {
  const title = read(formData, "title");
  const slug = makeSlug(read(formData, "slug") || title);
  const contentType = read(formData, "content_type");
  const status = read(formData, "status");
  if (!title || !slug || !types.includes(contentType) || !statuses.includes(status)) {
    throw new Error("Please provide a title, valid content type and status.");
  }
  const supabase = await requireAdminPermission("articles.manage");
  const { data } = await supabase.auth.getClaims();
  const { error } = await supabase.from("content_posts").insert({
    title, slug, excerpt: read(formData, "excerpt") || null,
    body: read(formData, "body") || null, content_type: contentType, status,
    author_id: data?.claims?.sub ?? null,
    published_at: status === "published" ? new Date().toISOString() : null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/content");
}

export async function updateContentPost(formData: FormData) {
  const id = read(formData, "id");
  const status = read(formData, "status");
  if (!id || !statuses.includes(status)) throw new Error("Invalid content details.");
  const supabase = await requireAdminPermission("articles.manage");
  const { error } = await supabase.from("content_posts").update({
    status,
    published_at: status === "published" ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/content");
}

export async function deleteContentPost(formData: FormData) {
  const id = read(formData, "id");
  if (!id) throw new Error("Content ID is required.");
  const supabase = await requireAdminPermission("articles.manage");
  const { error } = await supabase.from("content_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/content");
}
