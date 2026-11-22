
import Image from "next/image";
import SectionHeading from "../components/section-heading";
import { requireActiveMember } from "@/lib/member";

function dateLabel(value?: string | null) {
  return value
    ? new Date(`${value.slice(0, 10)}T12:00:00`).toLocaleDateString("en-NG", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Date to be announced";
}

export default async function MemberReadingPage() {
  const { supabase } = await requireActiveMember();
  const today = new Date().toISOString().slice(0, 10);

  const [booksResult, plansResult, sessionsResult] = await Promise.all([
    supabase
      .from("books")
      .select(
        "id,title,author,description,cover_image_url,status",
      )
      .in("status", ["current", "planned", "completed"])
      .order("created_at", { ascending: false }),

    supabase
      .from("reading_plans")
      .select("id,title,description,starts_on,ends_on,status,book_id")
      .in("status", ["active", "planned"])
      .order("starts_on", { ascending: true }),

    supabase
      .from("reading_sessions")
      .select(
        "id,title,session_date,starts_at,duration_minutes,session_type,chapters,notes,reading_plan_id",
      )
      .gte("session_date", today)
      .order("session_date", { ascending: true }),
  ]);

  const books = booksResult.data ?? [];
  const plans = plansResult.data ?? [];
  const sessions = sessionsResult.data ?? [];
  const byId = new Map(books.map((book) => [book.id, book]));

  return (
    <>
      <SectionHeading
        eyebrow="READ · THINK · DISCUSS · APPLY"
        title="Books & reading"
        description="Follow the reading journey, see what we are reading and prepare for the next session."
      />

      <section className="member-card" style={{ marginBottom: 18 }}>
        <h2>Reading plans</h2>

        {plans.length ? (
          <div className="member-list">
            {plans.map((plan) => {
              const book = plan.book_id
                ? byId.get(plan.book_id)
                : undefined;

              return (
                <div className="member-list-item" key={plan.id}>
                  <div>
                    <h3>{plan.title}</h3>
                    {book?.title && (
                      <p>
                        {book.title}
                        {book.author ? ` · ${book.author}` : ""}
                      </p>
                    )}
                    {plan.description && <p>{plan.description}</p>}
                    <p>
                      {dateLabel(plan.starts_on)}
                      {plan.ends_on ? ` – ${dateLabel(plan.ends_on)}` : ""}
                    </p>
                  </div>
                  <span className="member-pill">{plan.status}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="member-empty" style={{ marginTop: 14 }}>
            No reading plans are currently available.
          </div>
        )}
      </section>

      <section className="member-card" style={{ marginBottom: 18 }}>
        <h2>Upcoming reading sessions</h2>

        {sessions.length ? (
          <div className="member-list">
            {sessions.map((session) => (
              <div className="member-list-item" key={session.id}>
                <div>
                  <h3>{session.title}</h3>
                  <p>
                    {dateLabel(session.session_date)}
                    {session.starts_at ? ` · ${session.starts_at}` : ""}
                    {session.duration_minutes
                      ? ` · ${session.duration_minutes} minutes`
                      : ""}
                  </p>
                  {session.chapters && <p>Reading: {session.chapters}</p>}
                  {session.notes && <p>{session.notes}</p>}
                </div>
                <span className="member-pill">
                  {session.session_type ?? "Reading"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="member-empty" style={{ marginTop: 14 }}>
            There are no upcoming sessions scheduled.
          </div>
        )}
      </section>

      <section className="member-card">
        <h2>Books in the circle</h2>

        {books.length ? (
          <div
            className="member-grid member-grid-3"
            style={{ marginTop: 16 }}
          >
            {books.map((book) => (
              <article className="member-list-item" key={book.id}>
                {book.cover_image_url && (
                  <Image
                    src={book.cover_image_url}
                    alt={book.title}
                    width={96}
                    height={128}
                    unoptimized
                    className="member-cover"
                  />
                )}
                <div>
                  <h3>{book.title}</h3>
                  {book.author && <p>By {book.author}</p>}
                  {book.description && <p>{book.description}</p>}
                  <span className="member-pill" style={{ marginTop: 8 }}>
                    {book.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="member-empty" style={{ marginTop: 14 }}>
            The book list will appear here when books are added.
          </div>
        )}
      </section>
    </>
  );
}
