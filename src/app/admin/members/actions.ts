
"use server";

import { revalidatePath } from "next/cache";
import { requireAdminPermission } from "@/lib/admin";

const allowedStatuses = ["pending", "active", "suspended"] as const;

export async function updateMemberStatus(formData: FormData) {
  const userId = String(formData.get("userId") || "").trim();
  const status = String(formData.get("status") || "");

  if (
    !userId ||
    !allowedStatuses.includes(status as (typeof allowedStatuses)[number])
  ) {
    throw new Error("Invalid member details.");
  }

  const supabase = await requireAdminPermission("members.manage");

  const { data: authData, error: authError } =
    await supabase.auth.getClaims();

  if (authError || !authData?.claims?.sub) {
    throw new Error("Authentication required.");
  }

  const currentUserId = authData.claims.sub;

  if (userId === currentUserId && status !== "active") {
    throw new Error("You cannot suspend or deactivate your own account.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      member_status: status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Member status update failed:", error);
    throw new Error("Could not update member status.");
  }

  if (!data) {
    throw new Error("Member profile not found or could not be updated.");
  }

  revalidatePath("/admin/members");
}
