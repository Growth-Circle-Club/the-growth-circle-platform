
import Link from "next/link";
import RegistrationsExport from "./registrations-export";
import { requireAdminPermission } from "@/lib/admin";
import AdminSidebar from "../../../admin-sidebar";

type RegistrationsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventRegistrationsPage({
  params,
}: RegistrationsPageProps) {
  const { id } = await params;
  const supabase = await requireAdminPermission("events.manage");

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, title, starts_at, venue, address")
    .eq("id", id)
    .maybeSingle();

  if (eventError || !event) {
    return (
      <pre className="whitespace-pre-wrap p-6">
        {JSON.stringify({ eventError, event }, null, 2)}
      </pre>
    );
  }

  const { data: registrations, error: registrationError } = await supabase
    .from("event_registrations")
    .select(
      "id, attendee_name, attendee_email, attendee_phone, attendee_organisation, profile_id, registered_at, attendance_status"
    )
    .eq("event_id", id)
    .order("registered_at", { ascending: false });

  const attendeeList = registrations ?? [];

  return (
    <main className="min-h-screen bg-[#F6F4EC] md:flex">
      <AdminSidebar />

      <div className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">
        <Link
          href="/admin/events"
          className="text-sm font-medium text-[#4F6F4A] hover:underline"
        >
          ← Back to Events
        </Link>

        <header className="mb-8 mt-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#4F6F4A]">
            THE GROWTH CIRCLE
          </p>

          <h1 className="mt-3 font-[var(--font-playfair)] text-3xl font-bold text-[#1D382A]">
            Event Registrations
          </h1>

          <h2 className="mt-2 text-lg font-semibold text-[#35483D]">
            {event.title}
          </h2>

          <p className="mt-2 text-sm text-[#758078]">
            {new Date(event.starts_at).toLocaleString("en-NG")} ·{" "}
            {event.venue || event.address || "Venue to be announced"}
          </p>
        </header>

        <section className="mb-6 rounded-xl border border-[#E2E4DC] bg-white p-5">
          <p className="text-sm text-[#758078]">Total registrations</p>
          <p className="mt-2 font-[var(--font-playfair)] text-3xl font-bold text-[#1D382A]">
            {attendeeList.length}
          </p>
        </section>

        <section className="rounded-xl border border-[#E2E4DC] bg-white p-5 md:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-[var(--font-playfair)] text-xl font-bold text-[#1D382A]">
              Registered Attendees
            </h2>

            <RegistrationsExport attendees={attendeeList} />
          </div>

          {registrationError ? (
            <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              We could not load the registrations. Please check database permissions.
            </p>
          ) : attendeeList.length === 0 ? (
            <p className="rounded-lg bg-[#F6F4EC] p-6 text-sm text-[#758078]">
              No attendees have registered for this event yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E2E4DC] text-xs uppercase tracking-wide text-[#758078]">
                    <th className="px-4 py-3">Attendee</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Organisation / Occupation</th>
                    <th className="px-4 py-3">Reference</th>
                    <th className="px-4 py-3">Registered</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {attendeeList.map((attendee) => (
                    <tr
                      key={attendee.id}
                      className="border-b border-[#E2E4DC] last:border-0"
                    >
                      <td className="px-4 py-4 font-medium text-[#1D382A]">
                        {attendee.attendee_name || "Member registration"}
                      </td>
                      <td className="px-4 py-4 text-[#35483D]">
                        {attendee.attendee_email || "—"}
                      </td>
                      <td className="px-4 py-4 text-[#35483D]">
                        {attendee.attendee_phone || "—"}
                      </td>
                      <td className="px-4 py-4 text-[#35483D]">
                        {attendee.attendee_organisation || "—"}
                      </td>
                      <td className="px-4 py-4 text-[#35483D]">
                        GC-{attendee.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-4 py-4 text-[#35483D]">
                        {new Date(attendee.registered_at).toLocaleDateString(
                          "en-NG"
                        )}
                      </td>
                      <td className="px-4 py-4 capitalize text-[#35483D]">
                        {attendee.attendance_status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
