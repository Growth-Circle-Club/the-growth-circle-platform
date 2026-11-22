
"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SignupState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function signUpAction(
  _previousState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!fullName || fullName.length > 120) {
    return {
      status: "error",
      message: "Please enter your full name.",
    };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      status: "error",
      message: "Please enter a valid email address.",
    };
  }

  if (password.length < 8) {
    return {
      status: "error",
      message: "Your password must be at least 8 characters.",
    };
  }

  if (password !== confirmPassword) {
    return {
      status: "error",
      message: "Your passwords do not match.",
    };
  }

  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host");

  const protocol =
    requestHeaders.get("x-forwarded-proto") ?? "https";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (host ? `${protocol}://${host}` : "");

  if (!siteUrl) {
    return {
      status: "error",
      message: "Unable to complete signup right now. Please try again.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${siteUrl}/auth/confirm?next=/member-access`,
    },
  });

  if (error || !data.user) {
    console.error("Signup failed:", error?.message);

    return {
      status: "error",
      message:
        "We couldn't complete signup. If you already have an account, please sign in instead.",
    };
  }

  // If email confirmation is disabled and a session is returned,
  // attempt to link the application immediately.
  if (data.session) {
    const { error: linkError } = await supabase.rpc(
      "link_my_membership_application"
    );

    if (linkError) {
      console.error("Membership application linking failed:", linkError);
    }

    redirect("/member-access");
  }

  return {
    status: "success",
    message:
      "Your account registration has been received. Please check your email and confirm your address before signing in.",
  };
}
