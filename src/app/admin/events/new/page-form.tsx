
import Link from "next/link";
import AdminSidebar from "../../admin-sidebar";
import { createEvent } from "../actions";

type NewEventPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewEventPage({
  searchParams,
}: NewEventPageProps) {
  const params = await searchParams;

  const errorMessages: Record<string, string> = {
    invalid: "Please complete the required fields correctly.",
    date: "Please check the event dates. The end time must be after the start time.",
    capacity: "Capacity must be a whole number greater than zero.",
    save: "We could not save the event. Please try again.",
  };

  const errorMessage = params.error
    ? errorMessages[params.error]
    : undefined;

  return (
    <main className="min-h-screen bg-[#F6F4EC] md:flex">
      <AdminSidebar />

      <div className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">
        <header className="mb-8">
          <Link
            href="/admin/events"
            className="text-sm font-medium text-[#4F6F4A] hover:underline"
          >
            ← Back to Events
          </Link>

          <h1 className="mt-4 font-[var(--font-playfair)] text-3xl font-bold text-[#1D382A]">
            Create New Event
          </h1>

          <p className="mt-2 text-sm text-[#758078]">
            Add an event or activity to the Growth Circle calendar.
          </p>
        </header>

        <section className="max-w-3xl rounded-2xl border border-[#E2E4DC] bg-white p-6 shadow-sm md:p-8">
          {errorMessage && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <form action={createEvent} className="space-y-6">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-medium text-[#35483D]">
                Event title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="e.g. Growth Circle Community Meetup"
                className="w-full rounded-lg border border-[#E2E4DC] px-4 py-3 text-sm outline-none focus:border-[#4F6F4A]"
              />
            </div>

            <div>
              <label htmlFor="event_type" className="mb-2 block text-sm font-medium text-[#35483D]">
                Event type *
              </label>
              <select
                id="event_type"
                name="event_type"
                required
                defaultValue="meetup"
                className="w-full rounded-lg border border-[#E2E4DC] bg-white px-4 py-3 text-sm outline-none focus:border-[#4F6F4A]"
              >
                <option value="meetup">Meetup</option>
                <option value="workshop">Workshop</option>
                <option value="school_outreach">School Outreach</option>
                <option value="community">Community Activity</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-[#35483D]">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Tell members what the event is about..."
                className="w-full rounded-lg border border-[#E2E4DC] px-4 py-3 text-sm outline-none focus:border-[#4F6F4A]"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="starts_at" className="mb-2 block text-sm font-medium text-[#35483D]">
                  Start date and time *
                </label>
                <input
                  id="starts_at"
                  name="starts_at"
                  type="datetime-local"
                  required
                  className="w-full rounded-lg border border-[#E2E4DC] px-4 py-3 text-sm outline-none focus:border-[#4F6F4A]"
                />
              </div>

              <div>
                <label htmlFor="ends_at" className="mb-2 block text-sm font-medium text-[#35483D]">
                  End date and time
                </label>
                <input
                  id="ends_at"
                  name="ends_at"
                  type="datetime-local"
                  className="w-full rounded-lg border border-[#E2E4DC] px-4 py-3 text-sm outline-none focus:border-[#4F6F4A]"
                />
              </div>
            </div>

            <p className="-mt-4 text-xs text-[#758078]">
              Event times are interpreted as Nigeria time (WAT).
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="venue" className="mb-2 block text-sm font-medium text-[#35483D]">
                  Venue
                </label>
                <input
                  id="venue"
                  name="venue"
                  type="text"
                  placeholder="e.g. JJT Park"
                  className="w-full rounded-lg border border-[#E2E4DC] px-4 py-3 text-sm outline-none focus:border-[#4F6F4A]"
                />
              </div>

              <div>
                <label htmlFor="address" className="mb-2 block text-sm font-medium text-[#35483D]">
                  Full address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Enter the event address"
                  className="w-full rounded-lg border border-[#E2E4DC] px-4 py-3 text-sm outline-none focus:border-[#4F6F4A]"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="capacity" className="mb-2 block text-sm font-medium text-[#35483D]">
                  Attendance capacity
                </label>
                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  placeholder="Leave blank if unlimited"
                  className="w-full rounded-lg border border-[#E2E4DC] px-4 py-3 text-sm outline-none focus:border-[#4F6F4A]"
                />
              </div>

              <div>
                <label htmlFor="status" className="mb-2 block text-sm font-medium text-[#35483D]">
                  Initial status *
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue="draft"
                  className="w-full rounded-lg border border-[#E2E4DC] bg-white px-4 py-3 text-sm outline-none focus:border-[#4F6F4A]"
                >
                  <option value="draft">Save as draft</option>
                  <option value="upcoming">Publish as upcoming</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-[#E2E4DC] pt-6">
              <button
                type="submit"
                className="rounded-lg bg-[#1D382A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#4F6F4A]"
              >
                Create Event
              </button>

              <Link
                href="/admin/events"
                className="rounded-lg border border-[#E2E4DC] px-6 py-3 text-sm font-medium text-[#35483D] hover:bg-[#F6F4EC]"
              >
                Cancel
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
