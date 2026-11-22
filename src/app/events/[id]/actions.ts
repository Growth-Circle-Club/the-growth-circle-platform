
"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendEventRegistrationEmail } from "@/lib/resend";

export async function registerForFreeEvent(formData: FormData) {
  const eventId = formData.get("eventId");
  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const organisation = formData.get("organisation");

  if (
    typeof eventId !== "string" ||
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof phone !== "string" ||
    (organisation !== null && typeof organisation !== "string")
  ) {
    redirect("/events");
  }

  const attendeeName = name.trim();
  const attendeeEmail = email.trim().toLowerCase();
  const attendeePhone = phone.trim();
  const attendeeOrganisation =
    typeof organisation === "string" ? organisation.trim() : null;

  if (
    attendeeName.length < 2 ||
    attendeeName.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(attendeeEmail) ||
    attendeeEmail.length > 254 ||
    attendeePhone.length < 7 ||
    attendeePhone.length > 30 ||
    (attendeeOrganisation && attendeeOrganisation.length > 150)
  ) {
    redirect(`/events/${eventId}?error=invalid_details`);
  }

  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub ?? null;

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, title, starts_at, venue, address, payment_type, status, visibility")
    .eq("id", eventId)
    .maybeSingle();

  if (eventError || !event || event.status !== "upcoming") {
    redirect(`/events/${eventId}?error=unavailable`);
  }

  if (event.payment_type !== "free") {
    redirect(`/events/${eventId}?error=payment_required`);
  }

  if (event.visibility === "members_only" && !userId) {
    redirect("/login");
  }

  const registrationId = randomUUID();

  const { error: registrationError } = await supabase
    .from("event_registrations")
    .insert({
      id: registrationId,
      event_id: event.id,
      profile_id: userId,
      attendee_name: attendeeName,
      attendee_email: attendeeEmail,
      attendee_phone: attendeePhone,
      attendee_organisation: attendeeOrganisation,
      attendance_status: "registered",
    });

  if (registrationError) {
    console.error("Registration error:", {
      code: registrationError.code,
      message: registrationError.message,
      details: registrationError.details,
      hint: registrationError.hint,
    });

    if (registrationError.code === "23505") {
      redirect(`/events/${eventId}?error=already_registered`);
    }

    redirect(`/events/${eventId}?error=registration_failed`);
  }

  
revalidatePath(`/events/${eventId}`);
revalidatePath("/member/events");

try {
  const { error: emailError } = await sendEventRegistrationEmail({
    name: attendeeName,
    email: attendeeEmail,
    eventTitle: event.title,
    startsAt: event.starts_at,
    venue: event.venue,
    address: event.address,
    reference: registrationId,
  });

  if (emailError) {
    console.error("Confirmation email failed:", emailError);
  }
} catch (error) {
  console.error("Confirmation email error:", error);
}

redirect(
  `/events/${eventId}?registered=success&reference=${registrationId}`
);

}
