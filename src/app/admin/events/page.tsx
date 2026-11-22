
import Link from "next/link";
import { requireAdminPermission } from "@/lib/admin";
import AdminSidebar from "../admin-sidebar";

export const instant = false;
export default async function EventsPage() {
  const supabase = await requireAdminPermission("events.manage");

  const { data: events, error } = await supabase
  .from("events")
  .select(
    "id, title, description, event_type, starts_at, ends_at, venue, address, capacity, status, visibility, cover_image_url, payment_type, ticket_price_kobo, contribution_minimum_kobo"
  )
  .order("starts_at", { ascending: false });
  const eventList = events ?? [];

  const registrationResults = await Promise.all(
    eventList.map((event) =>
      supabase
        .from("event_registrations")
        .select("id", { count: "exact", head: true })
        .eq("event_id", event.id)
    )
  );

  const totalRegistrations = registrationResults.reduce(
    (total, result) => total + (result.count ?? 0),
    0
  );

  const registrationError = registrationResults.find((result) => result.error)?.error;

  const upcomingCount = eventList.filter((event) => event.status === "upcoming").length;
  const completedCount = eventList.filter((event) => event.status === "completed").length;

  return (
    <main className="min-h-screen bg-[#F6F4EC] md:flex">
      <AdminSidebar />

      <div className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">
        <header className="mb-8">
          <Link href="/admin" className="text-sm font-medium text-[#4F6F4A] hover:underline">
            ← Back to Dashboard
          </Link>
          <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-[#4F6F4A]">
            THE GROWTH CIRCLE
          </p>
          <h1 className="mt-3 font-[var(--font-playfair)] text-3xl font-bold text-[#1D382A] md:text-4xl">
            Events & Activities
          </h1>
          <p className="mt-2 text-sm text-[#758078]">
            Organise meetups, workshops, outreach and other community activities.
          </p>
        </header>
        <Link
  href="/admin/events/new"
  className="rounded-lg bg-[#1D382A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4F6F4A]"
>
  + Create New Event
</Link>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Events", value: eventList.length },
            { label: "Upcoming", value: upcomingCount },
            { label: "Completed", value: completedCount },
            { label: "Registrations", value: totalRegistrations },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-[#E2E4DC] bg-white p-5">
              <p className="text-sm text-[#758078]">{item.label}</p>
              <p className="mt-3 font-[var(--font-playfair)] text-3xl font-bold text-[#1D382A]">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-xl border border-[#E2E4DC] bg-white p-5 md:p-7">
          <div className="mb-6">
            <h2 className="font-[var(--font-playfair)] text-xl font-bold text-[#1D382A]">
              Community Events
            </h2>
            <p className="mt-1 text-sm text-[#758078]">
              {eventList.length} event{eventList.length === 1 ? "" : "s"} in the platform.
            </p>
          </div>

          {error ? (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              We could not load the events. Please check the database permissions and try again.
            </div>
          ) : eventList.length === 0 ? (
            <div className="rounded-lg bg-[#F6F4EC] px-5 py-12 text-center">
              <h3 className="font-semibold text-[#1D382A]">No events added yet</h3>
              <p className="mt-2 text-sm text-[#758078]">
                Events and activities will appear here when created.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E2E4DC] text-xs uppercase tracking-wide text-[#758078]">
                    <th className="px-4 py-3 font-semibold">Event</th>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="px-4 py-3 font-semibold">Venue</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Capacity</th>
                    <th className="px-4 py-3 font-semibold">Payment</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Registrations</th>
                  </tr>
                </thead>
                <tbody>
                  {eventList.map((event, index) => (
                    <tr key={event.id} className="border-b border-[#E2E4DC] last:border-0">
                      <td className="px-4 py-4 font-medium text-[#1D382A]">
  <Link
    href={`/admin/events/${event.id}/registrations`}
    className="hover:text-[#4F6F4A] hover:underline"
  >
    {event.title}
  </Link>
</td>
                      <td className="px-4 py-4 capitalize text-[#35483D]">
                        {event.event_type.replaceAll("_", " ")}
                      </td>
                      <td className="px-4 py-4 text-[#35483D]">
                        {event.venue || event.address || "—"}
                      </td>
                      <td className="px-4 py-4 text-[#35483D]">
                        {new Date(event.starts_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-[#35483D]">{event.capacity ?? "—"}</td>
                      <td className="px-4 py-4 text-[#35483D]">
  {event.payment_type === "paid"
    ? `₦${((event.ticket_price_kobo ?? 0) / 100).toLocaleString("en-NG")}`
    : event.payment_type === "optional_contribution"
      ? `Optional${event.contribution_minimum_kobo
          ? ` (min. ₦${(event.contribution_minimum_kobo / 100).toLocaleString("en-NG")})`
          : ""}`
      : "Free"}
</td>
                      <td className="px-4 py-4 text-[#758078]">{event.status}</td>
                      <td className="px-4 py-4 text-[#35483D]">
                        {registrationResults[index]?.count ?? 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {registrationError && (
            <p className="mt-4 text-sm text-amber-700">
              Event details loaded, but registration totals could not be retrieved.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

