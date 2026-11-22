
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { registerForFreeEvent } from "./actions";

type EventDetailsProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    registered?: string;
    error?: string;
    reference?: string;
  }>;
};

export default async function EventDetailsPage({
  params,
  searchParams,
}: EventDetailsProps) {
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();

  const { data: event, error } = await supabase
    .from("events")
    .select(
      "id, title, description, event_type, starts_at, ends_at, venue, address, capacity, cover_image_url, visibility, payment_type, ticket_price_kobo, contribution_minimum_kobo"
    )
    .eq("id", id)
    .eq("status", "upcoming")
    .maybeSingle();

  if (error || !event) {
    notFound();
  }

  const paymentDetails =
    event.payment_type === "paid"
      ? `₦${((event.ticket_price_kobo ?? 0) / 100).toLocaleString("en-NG")}`
      : event.payment_type === "optional_contribution"
        ? `Optional${
            event.contribution_minimum_kobo
              ? ` (minimum ₦${(
                  event.contribution_minimum_kobo / 100
                ).toLocaleString("en-NG")})`
              : ""
          }`
        : "Free";

  return (
    <main className="min-h-screen bg-[#F6F4EC] px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/events"
          className="text-sm font-medium text-[#4F6F4A] hover:underline"
        >
          ← Back to Events
        </Link>

        <article className="mt-8 overflow-hidden rounded-2xl border border-[#E2E4DC] bg-white">
          {event.cover_image_url && (
            <Image
              src={event.cover_image_url}
              alt={event.title}
              width={1600}
              height={900}
              unoptimized
              className="max-h-[420px] w-full object-cover"
            />
          )}

          <div className="p-6 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#4F6F4A]">
              {event.event_type.replaceAll("_", " ")}
            </p>

            <h1 className="mt-3 font-[var(--font-playfair)] text-3xl font-bold text-[#1D382A] md:text-4xl">
              {event.title}
            </h1>

            <div className="mt-8 grid gap-5 rounded-xl bg-[#F6F4EC] p-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase text-[#758078]">
                  Date and time
                </p>
                <p className="mt-2 text-sm text-[#35483D]">
                  {new Date(event.starts_at).toLocaleString("en-NG", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-[#758078]">
                  Venue
                </p>
                <p className="mt-2 text-sm text-[#35483D]">
                  {event.venue || event.address || "To be announced"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-[#758078]">
                  Payment
                </p>
                <p className="mt-2 text-sm font-semibold text-[#1D382A]">
                  {paymentDetails}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-[#758078]">
                  Capacity
                </p>
                <p className="mt-2 text-sm text-[#35483D]">
                  {event.capacity
                    ? `${event.capacity} people`
                    : "Not specified"}
                </p>
              </div>
            </div>

            <section className="mt-10">
              <h2 className="font-[var(--font-playfair)] text-2xl font-semibold text-[#1D382A]">
                About this event
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#758078]">
                {event.description ||
                  "More details about this event will be shared soon."}
              </p>
            </section>

            <div className="mt-10 border-t border-[#E2E4DC] pt-6">
              {query.registered === "success" && (
                <div className="mb-5 rounded-lg bg-green-50 p-4 text-sm text-green-700">
                  You&apos;re registered for this event.
                  {query.reference && (
                    <p className="mt-3 text-sm font-semibold text-[#1D382A]">
                      Registration Reference: GC-
                      {query.reference.slice(0, 8).toUpperCase()}
                    </p>
                  )}
                </div>
              )}

              {query.error === "already_registered" && (
                <p className="mb-5 rounded-lg bg-amber-50 p-4 text-sm text-amber-700">
                  You&apos;re already registered for this event.
                </p>
              )}

              {query.error === "payment_required" && (
                <p className="mb-5 rounded-lg bg-amber-50 p-4 text-sm text-amber-700">
                  Payment is required for this event. Online registration will
                  be available soon.
                </p>
              )}

              {query.error === "unavailable" && (
                <p className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                  This event is no longer available for registration.
                </p>
              )}

              {query.error === "registration_failed" && (
                <p className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                  We couldn&apos;t complete your registration. Please try
                  again.
                </p>
              )}

              {query.error === "invalid_details" && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  Please enter a valid name, email address and phone number.
                </div>
              )}

              {event.payment_type === "free" ? (
                <form
                  action={registerForFreeEvent}
                  className="mt-6 space-y-5"
                >
                  <input
                    type="hidden"
                    name="eventId"
                    value={event.id}
                  />

                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-[#35483D]"
                    >
                      Full name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      maxLength={100}
                      autoComplete="name"
                      placeholder="Enter your full name"
                      className="w-full rounded-lg border border-[#E2E4DC] px-4 py-3 text-sm outline-none focus:border-[#4F6F4A]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-[#35483D]"
                    >
                      Email address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      maxLength={254}
                      autoComplete="email"
                      placeholder="Enter your email address"
                      className="w-full rounded-lg border border-[#E2E4DC] px-4 py-3 text-sm outline-none focus:border-[#4F6F4A]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-[#35483D]"
                    >
                      Phone number *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      maxLength={30}
                      autoComplete="tel"
                      placeholder="Enter your phone number"
                      className="w-full rounded-lg border border-[#E2E4DC] px-4 py-3 text-sm outline-none focus:border-[#4F6F4A]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="organisation"
                      className="mb-2 block text-sm font-medium text-[#35483D]"
                    >
                      Organisation / Occupation
                    </label>
                    <input
                      id="organisation"
                      name="organisation"
                      type="text"
                      maxLength={150}
                      placeholder="Optional"
                      className="w-full rounded-lg border border-[#E2E4DC] px-4 py-3 text-sm outline-none focus:border-[#4F6F4A]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="rounded-lg bg-[#1D382A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#4F6F4A]"
                  >
                    Complete Registration
                  </button>
                </form>
              ) : (
                <p className="text-sm text-[#758078]">
                  Registration and payment details will be available here
                  soon.
                </p>
              )}
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
