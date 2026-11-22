
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const ADMIN_DESTINATIONS: Array<[string, string]> = [
  ["membership.review", "/admin/applications"],
  ["members.manage", "/admin/members"],
  ["reading.manage", "/admin/reading"],
  ["books.manage", "/admin/reading"],
  ["events.manage", "/admin/events"],
  ["articles.manage", "/admin/content"],
  ["settings.manage", "/admin/settings"],
  ["discussions.moderate", "/admin/reading"],
  ["roles.manage", "/admin/settings"],
  ["reports.view", "/admin"],
  ["volunteers.manage", "/admin/members"],
  ["contributions.manage", "/admin/content"],
  ["partnerships.manage", "/admin/settings"],
  ["newsletter.manage", "/admin/content"],
];

export async function getPostLoginPath(): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || typeof userId !== "string") return "/login";

  const { data: isMainAdmin, error: mainAdminError } =
    await supabase.rpc("is_main_admin");

  if (!mainAdminError && isMainAdmin === true) return "/admin";

  for (const [permission, destination] of ADMIN_DESTINATIONS) {
    const { data: allowed, error: permissionError } =
      await supabase.rpc("has_permission", {
        requested_permission: permission,
      });

    if (!permissionError && allowed === true) return destination;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("member_status")
    .eq("id", userId)
    .maybeSingle();

  return profile?.member_status === "active"
    ? "/member"
    : "/member-access";
}

export type LoginState = {
  error: string;
};

export async function signInAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: "Unable to sign in. Please check your email and password.",
    };
  }

  // Link this verified account to its matching pending application.
  // This does not approve the application or activate membership.
  const { error: linkError } = await supabase.rpc(
    "link_my_membership_application"
  );

  if (linkError) {
    console.error("Membership application linking failed:", linkError);
  }

  const destination = await getPostLoginPath();

  redirect(destination);
}
