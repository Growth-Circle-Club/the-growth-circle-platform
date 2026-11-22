
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function MemberEventsPage() {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    redirect("/login");
  }

  const { data: events, error } = await supabase
    .from("events")
    .select(
      "id, title, description, event_type, starts_at, ends_at, venue, address, capacity, cover_image_url, payment_type, ticket_price_kobo, contribution_minimum_kobo"
    )
    .eq("status", "upcoming")
    .in("visibility", ["members_only", "mixed"])
    .order("starts_at", { ascending: true });

  if (error) {
    console.error("Member events fetch failed:", error.message);
  }

  return (
    <main className="min-h-screen bg-[#F6F4EC] px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#4F6F4A]">
            The Growth Circle
          </p>

          <h1 className="font-[var(--font-playfair)] text-4xl font-bold text-[#1D382A] md:text-5xl">
            Members&apos; Events
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-[#758078]">
            Discover experiences, activities and opportunities to connect,
            learn and grow together as a community.
          </p>
        </header>

        {error ? (
          <div className="rounded-2xl border border-[#E2E4DC] bg-white p-8 text-center">
            <p className="text-[#758078]">
              We couldn&apos;t load events right now. Please try again later.
            </p>
          </div>
        ) : !events || events.length === 0 ? (
          <div className="rounded-2xl border border-[#E2E4DC] bg-white px-6 py-16 text-center">
            <h2 className="font-[var(--font-playfair)] text-2xl font-semibold text-[#1D382A]">
              No upcoming events yet
            </h2>
            <p className="mt-3 text-sm text-[#758078]">
              New community events will appear here. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event.id}
                className="overflow-hidden rounded-2xl border border-[#E2E4DC] bg-white"
              >
                {event.cover_image_url && (
                  <div className="relative h-52 w-full">
                    <Image
                      src={event.cover_image_url}
                      alt={event.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#4F6F4A]">
                    {event.event_type.replaceAll("_", " ")}
                  </p>

                  <h2 className="font-[var(--font-playfair)] text-2xl font-semibold text-[#1D382A]">
                    {event.title}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-[#758078]">
                    {event.description ||
                      "More details about this event will be shared soon."}
                  </p>

                  <div className="mt-6 space-y-2 text-sm text-[#35483D]">
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(event.starts_at).toLocaleString("en-NG", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>

                    <p>
                      <strong>Venue:</strong>{" "}
                      {event.venue || event.address || "To be announced"}
                    </p>

                    {event.capacity && (
                      <p>
                        <strong>Capacity:</strong> {event.capacity} people
                      </p>
                    )}

                    <p>
                      <strong>Payment:</strong>{" "}
                      {event.payment_type === "paid"
                        ? `₦${(
                            (event.ticket_price_kobo ?? 0) / 100
                          ).toLocaleString("en-NG")}`
                        : event.payment_type === "optional_contribution"
                          ? `Optional${
                              event.contribution_minimum_kobo
                                ? ` (minimum ₦${(
                                    event.contribution_minimum_kobo / 100
                                  ).toLocaleString("en-NG")})`
                                : ""
                            }`
                          : "Free"}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-[#E2E4DC] pt-4">
                    <span className="text-sm font-medium text-[#4F6F4A]">
                      Member event
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
