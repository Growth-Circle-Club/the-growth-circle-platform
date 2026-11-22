
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminPermission } from "@/lib/admin";

async function reviewApplication(
  formData: FormData,
  decision: "approve" | "reject"
): Promise<never> {
  const applicationId = String(formData.get("applicationId") || "").trim();

  if (!applicationId) {
    redirect("/admin/applications?result=failed");
  }

  const supabase = await requireAdminPermission("membership.review");

  const functionName =
    decision === "approve"
      ? "approve_membership_application"
      : "reject_membership_application";

  const { data, error } = await supabase.rpc(functionName, {
    application_id: applicationId,
  });

  if (error) {
    console.error("Membership review failed:", error);
    redirect("/admin/applications?result=failed");
  }

  const result = String(data || "");

  const allowedResults = [
    "approved",
    "rejected",
    "account_not_linked",
    "account_email_not_verified",
    "account_email_mismatch",
    "cannot_review_own_application",
    "application_not_pending",
    "application_not_found",
    "not_authorized",
  ];

  const destination = allowedResults.includes(result)
    ? result
    : "failed";

  revalidatePath("/admin/applications");
  revalidatePath("/admin/members");

  redirect(`/admin/applications?result=${destination}`);
}

export async function approveMembershipApplication(formData: FormData) {
  await reviewApplication(formData, "approve");
}

export async function rejectMembershipApplication(formData: FormData) {
  await reviewApplication(formData, "reject");
}
