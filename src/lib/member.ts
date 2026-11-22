import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireActiveMember() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || typeof userId !== "string" || !userId) redirect("/login?next=%2Fmember");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, phone, profile_image, bio, location, member_status")
    .eq("id", userId)
    .maybeSingle();
  if (profileError || !profile) redirect("/member-access?status=unavailable");
  if (profile.member_status !== "active") {
    redirect(`/member-access?status=${encodeURIComponent(profile.member_status ?? "pending")}`);
  }
  return { supabase, userId, profile };
}
