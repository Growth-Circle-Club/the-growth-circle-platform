
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type EventRegistrationEmail = {
  name: string;
  email: string;
  eventTitle: string;
  startsAt: string;
  venue: string | null;
  address: string | null;
  reference: string;
};

export async function sendEventRegistrationEmail({
  name,
  email,
  eventTitle,
  startsAt,
  venue,
  address,
  reference,
}: EventRegistrationEmail) {
  const eventDate = new Date(startsAt).toLocaleString("en-NG", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Africa/Lagos",
  });

  return resend.emails.send({
    from: "Growth Circle <onboarding@resend.dev>",
    to: email,
    subject: `Your registration is confirmed – ${eventTitle}`,
    text: `
Hello ${name},

Your registration for ${eventTitle} has been confirmed!

EVENT DETAILS
Event: ${eventTitle}
Date and time: ${eventDate}
Venue: ${venue || "To be announced"}
Address: ${address || "To be announced"}

YOUR REGISTRATION REFERENCE
GC-${reference.slice(0, 8).toUpperCase()}

Please keep this email for your records.

We look forward to seeing you!

Growth Circle
Read. Connect. Grow.
    `,
  });
}
