
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireAdminPermission(permission: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/login");
  }

  const { data: allowed, error: permissionError } =
    await supabase.rpc("has_permission", {
      requested_permission: permission,
    });

  if (permissionError || !allowed) {
    redirect("/");
  }

  return supabase;
}
