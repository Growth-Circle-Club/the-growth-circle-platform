
import SectionHeading from "../components/section-heading";
import { requireActiveMember } from "@/lib/member";
import { submitDiscussionContribution } from "./actions";

export default async function MemberDiscussionsPage() {
  const { supabase } = await requireActiveMember();

  const [ss, ds] = await Promise.all([
    supabase
      .from("reading_sessions")
      .select("id, title, session_date")
      .order("session_date", { ascending: false })
      .limit(30),

    supabase
      .from("reading_discussions")
      .select("id, topic, contribution, created_at, reading_session_id")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  const sessions = ss.data ?? [];
  const discussions = ds.data ?? [];

  const names = new Map(sessions.map((session) => [
    session.id,
    session.title,
  ]));

  return (
    <>
      <SectionHeading
        eyebrow="SHARE YOUR PERSPECTIVE"
        title="Discussions"
        description="Reflect on what you are reading, learn from different perspectives and add your voice to the conversation."
      />

      <section className="member-card" style={{ marginBottom: 18 }}>
        <h2>Share a reflection</h2>
        <p className="member-card-subtitle">
          Your contribution will be reviewed by a moderator before it appears
          in the shared discussion feed.
        </p>

        {sessions.length > 0 ? (
          <form
            action={submitDiscussionContribution}
            className="member-form"
            style={{ marginTop: 18 }}
          >
            <div className="member-field">
              <label htmlFor="reading_session_id">Reading session</label>
              <select
                id="reading_session_id"
                name="reading_session_id"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select a session
                </option>
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.title} · {session.session_date}
                  </option>
                ))}
              </select>
            </div>

            <div className="member-field">
              <label htmlFor="topic">Topic or question</label>
              <input
                id="topic"
                name="topic"
                maxLength={160}
                required
                placeholder="What idea stood out to you?"
              />
            </div>

            <div className="member-field">
              <label htmlFor="contribution">Your reflection</label>
              <textarea
                id="contribution"
                name="contribution"
                maxLength={3000}
                required
                placeholder="Share your thoughts, questions or practical takeaways."
              />
            </div>

            <div>
              <button
                type="submit"
                className="member-button member-button-primary"
              >
                Submit reflection
              </button>
            </div>
          </form>
        ) : (
          <div className="member-empty" style={{ marginTop: 14 }}>
            A reading session must be scheduled before a contribution can be
            submitted.
          </div>
        )}
      </section>

      <section className="member-card">
        <h2>Community reflections</h2>

        {discussions.length > 0 ? (
          <div className="member-list">
            {discussions.map((discussion) => (
              <article className="member-list-item" key={discussion.id}>
                <div>
                  <h3>{discussion.topic}</h3>
                  <p>
                    {names.get(discussion.reading_session_id ?? "") ??
                      "Reading discussion"}
                  </p>
                  <p style={{ marginTop: 9, whiteSpace: "pre-wrap" }}>
                    {discussion.contribution}
                  </p>
                  <p>
                    {new Date(discussion.created_at).toLocaleDateString(
                      "en-NG",
                      { dateStyle: "medium" }
                    )}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="member-empty" style={{ marginTop: 14 }}>
            Published member reflections will appear here.
          </div>
        )}
      </section>
    </>
  );
}
