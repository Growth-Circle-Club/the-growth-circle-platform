
import { EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const requestedNext = searchParams.get("next") ?? "/member-access";

  // Only allow internal paths.
  const next =
    requestedNext.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/member-access";

  const supabase = await createClient();

  let confirmationError = null;

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    confirmationError = error;
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    confirmationError = error;
  } else {
    return NextResponse.redirect(
      `${origin}/login?error=auth-confirmation`
    );
  }

  if (confirmationError) {
    console.error("Email confirmation failed:", confirmationError);

    return NextResponse.redirect(
      `${origin}/login?error=auth-confirmation`
    );
  }

  // Link the verified account to its matching pending application.
  const { data: linkStatus, error: linkError } = await supabase.rpc(
    "link_my_membership_application"
  );

  if (linkError) {
    console.error("Membership application linking failed:", linkError);
  } else {
    console.log("Membership application linking status:", linkStatus);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
