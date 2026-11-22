
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ApplicationState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function submitMembershipApplication(
  _previousState: ApplicationState,
  formData: FormData
): Promise<ApplicationState> {
  // Honeypot: quietly ignore automated spam submissions.
  if (formData.get("website")) {
    return {
      status: "success",
      message: "Your application has been received.",
    };
  }

  const fullName = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const motivation = String(formData.get("motivation") ?? "").trim();

  if (!fullName || fullName.length > 120) {
    return { status: "error", message: "Please enter a valid full name." };
  }

  if (
    !email ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  if (phone.length > 30 || motivation.length > 1500) {
    return { status: "error", message: "One of your entries is too long." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("membership_applications")
    .insert({
      full_name: fullName,
      email,
      phone: phone || null,
      interests: ["membership"],
      motivation: motivation || null,
      status: "pending",
    });

  if (error) {
    console.error("Membership application submission failed:", error);

    return {
      status: "error",
      message: "We couldn't process your application. Please try again.",
    };
  }

  redirect(
    `/signup?name=${encodeURIComponent(fullName)}&email=${encodeURIComponent(email)}`
  );
}
