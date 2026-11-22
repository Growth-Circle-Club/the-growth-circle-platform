"use server";

import { revalidatePath } from "next/cache";
import { requireAdminPermission } from "@/lib/admin";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function createBook(formData: FormData) {
  const title = value(formData, "title");
  const author = value(formData, "author");
  if (!title || !author) throw new Error("Book title and author are required.");

  const supabase = await requireAdminPermission("books.manage");
  const { data } = await supabase.auth.getClaims();

  const { error } = await supabase.from("books").insert({
    title,
    author,
    description: value(formData, "description") || null,
    status: value(formData, "status") || "planned",
    created_by: data?.claims?.sub ?? null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reading");
}

export async function updateBookStatus(formData: FormData) {
  const id = value(formData, "id");
  const status = value(formData, "status");
  if (!id || !["planned", "current", "completed", "archived"].includes(status)) {
    throw new Error("Invalid book details.");
  }
  const supabase = await requireAdminPermission("books.manage");
  const { error } = await supabase.from("books").update({
    status, updated_at: new Date().toISOString(),
  }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reading");
}

export async function deleteBook(formData: FormData) {
  const id = value(formData, "id");
  if (!id) throw new Error("Book ID is required.");
  const supabase = await requireAdminPermission("books.manage");
  const { error } = await supabase.from("books").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reading");
}

export async function createReadingPlan(formData: FormData) {
  const title = value(formData, "title");
  if (!title) throw new Error("Reading plan title is required.");
  const supabase = await requireAdminPermission("reading.manage");
  const { data } = await supabase.auth.getClaims();

  const { error } = await supabase.from("reading_plans").insert({
    title,
    book_id: value(formData, "book_id") || null,
    description: value(formData, "description") || null,
    starts_on: value(formData, "starts_on") || null,
    ends_on: value(formData, "ends_on") || null,
    status: value(formData, "status") || "planned",
    created_by: data?.claims?.sub ?? null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reading");
}

export async function updatePlanStatus(formData: FormData) {
  const id = value(formData, "id");
  const status = value(formData, "status");
  if (!id || !["planned", "active", "completed", "cancelled"].includes(status)) {
    throw new Error("Invalid reading plan details.");
  }
  const supabase = await requireAdminPermission("reading.manage");
  const { error } = await supabase.from("reading_plans").update({
    status, updated_at: new Date().toISOString(),
  }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reading");
}

export async function deleteReadingPlan(formData: FormData) {
  const id = value(formData, "id");
  if (!id) throw new Error("Reading plan ID is required.");
  const supabase = await requireAdminPermission("reading.manage");
  const { error } = await supabase.from("reading_plans").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reading");
}

export async function createReadingSession(formData: FormData) {
  const title = value(formData, "title");
  const sessionDate = value(formData, "session_date");
  if (!title || !sessionDate) throw new Error("Session title and date are required.");
  const duration = Number(value(formData, "duration_minutes") || "120");
  if (!Number.isInteger(duration) || duration < 15 || duration > 480) {
    throw new Error("Duration must be between 15 and 480 minutes.");
  }
  const supabase = await requireAdminPermission("reading.manage");
  const { data } = await supabase.auth.getClaims();

  const { error } = await supabase.from("reading_sessions").insert({
    title,
    reading_plan_id: value(formData, "reading_plan_id") || null,
    session_date: sessionDate,
    starts_at: value(formData, "starts_at") || null,
    duration_minutes: duration,
    session_type: value(formData, "session_type") || "reading_and_discussion",
    chapters: value(formData, "chapters") || null,
    notes: value(formData, "notes") || null,
    created_by: data?.claims?.sub ?? null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reading");
}

export async function updateDiscussionVisibility(formData: FormData) {
  const id = value(formData, "id");
  const published = value(formData, "is_published") === "true";
  if (!id) throw new Error("Discussion ID is required.");
  const supabase = await requireAdminPermission("discussions.moderate");
  const { error } = await supabase.from("reading_discussions")
    .update({ is_published: published }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reading");
}
