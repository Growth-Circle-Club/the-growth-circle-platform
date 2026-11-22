import Link from "next/link";
import AdminSidebar from "../../admin-sidebar";
import { createEvent } from "../actions";
import PaymentFields from "./payment-field";
import EventImageUpload from "./event-image-upload";
export const instant = false;
<EventImageUpload />
type NewEventPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewEventPage({
  searchParams,
}: NewEventPageProps) {
  const params = await searchParams;

 const errorMessages: Record<string, string> = {
  invalid: "Please complete all required fields correctly.",
  date: "Please check the event dates. The end time must be after the start time.",
  capacity: "Capacity must be a whole number greater than zero.",
  payment: "Please enter a valid payment amount.",
  image: "Please upload a valid JPG, PNG or WebP image under 5 MB.",
  save: "The event could not be saved. Please try again.",
};

  const errorMessage = params.error
    ? errorMessages[params.error]
    : undefined;

  return (
    <main className="min-h-screen bg-[#F6F4EC] md:flex">
      <AdminSidebar />

      <section className="min-w-0 flex-1 px-6 py-8 md:px-10">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/admin/events"
            className="text-sm font-medium text-[#4F6F4A] hover:underline"
          >
            ← Back to Events
          </Link>

          <header className="mb-8 mt-5">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#4F6F4A]">
              Events & Activities
            </p>
            <h1 className="text-3xl font-semibold text-[#1D382A]">
              Create New Event
            </h1>
            <p className="mt-2 text-sm text-[#758078]">
              Add an event or activity to the Growth Circle calendar.
            </p>
          </header>

          {errorMessage && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <form
          action={createEvent}
          encType="multipart/form-data"
          className="space-y-6 rounded-2xl border border-[#E2E4DC] bg-white p-6 shadow-sm md:p-8"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-[#35483D]">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Growth Circle Community Meetup"
                className="w-full rounded-lg border border-[#E2E4DC] px-4 py-3 text-sm outline-none focus:border-[#4F6F4A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#35483D]">
                Event Type *
              </label>
              <select
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
              <label className="mb-2 block text-sm font-medium text-[#35483D]">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                placeholder="Tell members what the event is about..."
                className="w-full rounded-lg border border-[#E2E4DC] px-4 py-3 text-sm outline-none focus:border-[#4F6F4A]"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#35483D]">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="starts_at"
                  required
                  className="w-full rounded-lg border border-[#E2E4DC] px-4 py-3 text-sm outline-none focus:border-[#4F6F4A]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#35483D]">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="ends_at"
                  className="w-full rounded-lg border border-[#E2E4DC] px-4 py-3 text-sm outline-none focus:border-[#4F6F4A]"
                />
              </div>
            </div>

            <p className="-mt-3 text-xs text-[#758078]">
              Event times are interpreted as Nigeria time (WAT).
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#35483D]">
                  Venue
                </label>
                <input
                  type="text"
                  name="venue"
                  placeholder="e.g. JJT Park"
                  className="w-full rounded-lg border border-[#E2E4DC] px-4 py-3 text-sm outline-none focus:border-[#4F6F4A]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#35483D]">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter event address"
                  className="w-full rounded-lg border border-[#E2E4DC] px-4 py-3 text-sm outline-none focus:border-[#4F6F4A]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#35483D]">
                Attendance Capacity
              </label>
              <input
                type="number"
                name="capacity"
                min="1"
                placeholder="Leave blank if there is no limit"
                className="w-full rounded-lg border border-[#E2E4DC] px-4 py-3 text-sm outline-none focus:border-[#4F6F4A]"
              />
            </div>
                        <div>
              <label className="mb-2 block text-sm font-medium text-[#35483D]">
                Who Can Access This Event? *
              </label>
              <select
                name="visibility"
                required
                defaultValue="members_only"
                className="w-full rounded-lg border border-[#E2E4DC] bg-white px-4 py-3 text-sm outline-none focus:border-[#4F6F4A]"
              >
                <option value="members_only">Members Only</option>
                <option value="public">Public — Everyone</option>
                <option value="mixed">Mixed — Members and Public</option>
              </select>
              <p className="mt-2 text-xs text-[#758078]">
                Choose whether this event is exclusive to members or open to everyone.
              </p>
            </div>
            <PaymentFields />

            <div>
              <label className="mb-2 block text-sm font-medium text-[#35483D]">
                Event Status *
              </label>
              <select
                name="status"
                defaultValue="draft"
                className="w-full rounded-lg border border-[#E2E4DC] bg-white px-4 py-3 text-sm outline-none focus:border-[#4F6F4A]"
              >
                <option value="draft">Save as Draft</option>
                <option value="upcoming">Publish as Upcoming</option>
              </select>
              <p className="mt-2 text-xs text-[#758078]">
                Draft events are saved privately. Upcoming events are published.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#E2E4DC] pt-6 sm:flex-row sm:justify-end">
              <Link
                href="/admin/events"
                className="rounded-lg border border-[#E2E4DC] px-6 py-3 text-center text-sm font-medium text-[#35483D] hover:bg-[#F6F4EC]"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="rounded-lg bg-[#1D382A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#4F6F4A]"
              >
                Save Event
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}