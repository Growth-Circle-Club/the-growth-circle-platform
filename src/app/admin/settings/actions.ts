"use server";

import { revalidatePath } from "next/cache";
import { requireAdminPermission } from "@/lib/admin";

const read = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

function parseJson(value: string) {
  try { return JSON.parse(value || "{}"); }
  catch { throw new Error("Setting value must be valid JSON."); }
}

export async function saveSetting(formData: FormData) {
  const key = read(formData, "setting_key");
  const description = read(formData, "description");
  const rawValue = read(formData, "setting_value");
  if (!key || key.length > 100) throw new Error("Setting key must be between 1 and 100 characters.");
  const settingValue = parseJson(rawValue);

  const supabase = await requireAdminPermission("settings.manage");
  const { data } = await supabase.auth.getClaims();
  const { error } = await supabase.from("platform_settings").upsert({
    setting_key: key,
    setting_value: settingValue,
    description: description || null,
    updated_by: data?.claims?.sub ?? null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "setting_key" });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/settings");
}

export async function deleteSetting(formData: FormData) {
  const key = read(formData, "setting_key");
  if (!key) throw new Error("Setting key is required.");
  const supabase = await requireAdminPermission("settings.manage");
  const { error } = await supabase.from("platform_settings").delete().eq("setting_key", key);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/settings");
}
