
import Image from "next/image";
import Link from "next/link";
import { requireActiveMember } from "@/lib/member";
import SectionHeading from "./components/section-heading";
export const instant = false;
function dateLabel(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function MemberDashboardPage() {
  const { supabase, profile } = await requireActiveMember();
  const today = new Date().toISOString().slice(0, 10);

  const [plansResult, sessionsResult, updatesResult, eventsResult] =
    await Promise.all([
      supabase
        .from("reading_plans")
        .select(
          "id,title,description,starts_on,ends_on,book_id,books(title,author,cover_image_url)",
        )
        .eq("status", "active")
        .order("starts_on", { ascending: false })
        .limit(1),

      supabase
        .from("reading_sessions")
        .select(
          "id,title,session_date,starts_at,duration_minutes,session_type,chapters",
        )
        .gte("session_date", today)
        .order("session_date", { ascending: true })
        .limit(3),

      supabase
        .from("content_posts")
        .select("id,title,excerpt,content_type,published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(3),

      supabase
        .from("events")
        .select("id,title,starts_at,venue,event_type")
        .eq("status", "upcoming")
        .order("starts_at", { ascending: true })
        .limit(2),
    ]);

  const plan = plansResult.data?.[0];
  const book = plan?.books?.[0];
  const sessions = sessionsResult.data ?? [];
  const updates = updatesResult.data ?? [];
  const events = eventsResult.data ?? [];

  return (
    <>
      <SectionHeading
        eyebrow="YOUR MEMBER SPACE"
        title={`Welcome, ${(profile.full_name ?? "Reader").split(" ")[0]}.`}
        description="Your space to keep learning, share perspectives and turn ideas into action."
      />

      <section className="member-stats">
        <div className="member-stat">
          <span>Current reading plan</span>
          <strong>{plan ? "1" : "—"}</strong>
        </div>
        <div className="member-stat">
          <span>Upcoming sessions</span>
          <strong>{sessions.length}</strong>
        </div>
        <div className="member-stat">
          <span>Upcoming events</span>
          <strong>{events.length}</strong>
        </div>
      </section>

      <section className="member-grid member-grid-2">
        <article className="member-card">
          <p className="member-eyebrow">CURRENTLY READING</p>

          {plan ? (
            <div className="member-list-item">
              {book?.cover_image_url && (
                <Image
                  className="member-cover"
                  src={book.cover_image_url}
                  alt={book.title ?? "Book cover"}
                  width={96}
                  height={128}
                  unoptimized
                />
              )}

              <div>
                <h3>{book?.title ?? plan.title}</h3>
                {book?.author && <p>By {book.author}</p>}
                {plan.description && <p>{plan.description}</p>}
                <p>
                  {plan.starts_on
                    ? dateLabel(plan.starts_on)
                    : "Reading plan"}
                  {plan.ends_on ? ` – ${dateLabel(plan.ends_on)}` : ""}
                </p>
                <Link
                  href="/member/reading"
                  className="member-button member-button-primary"
                  style={{ marginTop: 12 }}
                >
                  View reading plan
                </Link>
              </div>
            </div>
          ) : (
            <div className="member-empty">
              There is no active reading plan at the moment. Check the reading
              area for planned books and upcoming sessions.
            </div>
          )}
        </article>

        <article className="member-card">
          <p className="member-eyebrow">YOUR NEXT SESSIONS</p>

          {sessions.length ? (
            <div className="member-list">
              {sessions.map((session) => (
                <div className="member-list-item" key={session.id}>
                  <div>
                    <h3>{session.title}</h3>
                    <p>
                      {dateLabel(session.session_date)}
                      {session.starts_at ? ` · ${session.starts_at}` : ""}
                    </p>
                    {session.chapters && <p>{session.chapters}</p>}
                  </div>
                  <span className="member-pill">
                    {session.session_type ?? "Reading"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="member-empty">
              No upcoming reading sessions have been scheduled yet.
            </div>
          )}

          <Link
            href="/member/reading"
            className="member-button member-button-secondary"
            style={{ marginTop: 12 }}
          >
            See reading schedule
          </Link>
        </article>

        <article className="member-card">
          <p className="member-eyebrow">COMMUNITY UPDATES</p>

          {updates.length ? (
            <div className="member-list">
              {updates.map((post) => (
                <div className="member-list-item" key={post.id}>
                  <div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt ?? post.content_type}</p>
                  </div>
                  <Link
                    href={`/member/updates/${post.id}`}
                    className="member-pill"
                  >
                    Read
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="member-empty">
              There are no new community updates yet.
            </div>
          )}

          <Link
            href="/member/updates"
            className="member-button member-button-secondary"
            style={{ marginTop: 12 }}
          >
            All updates
          </Link>
        </article>

        <article className="member-card">
          <p className="member-eyebrow">UPCOMING EVENTS</p>

          {events.length ? (
            <div className="member-list">
              {events.map((event) => (
                <div className="member-list-item" key={event.id}>
                  <div>
                    <h3>{event.title}</h3>
                    <p>
                      {new Date(event.starts_at).toLocaleString("en-NG", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                    {event.venue && <p>{event.venue}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="member-empty">
              No upcoming events are listed right now.
            </div>
          )}

          <Link
            href="/member/events"
            className="member-button member-button-secondary"
            style={{ marginTop: 12 }}
          >
            Explore events
          </Link>
        </article>
      </section>
    </>
  );
}
