import { requireAdminPermission } from "@/lib/admin";
import AdminSidebar from "../admin-sidebar";
import {
  createBook, updateBookStatus, deleteBook,
  createReadingPlan, updatePlanStatus, deleteReadingPlan,
  createReadingSession, updateDiscussionVisibility,
} from "./actions";

export const instant = false;
const input = "w-full rounded-lg border border-[#DDE2D8] bg-white px-3 py-2 text-sm text-[#1D382A]";
const button = "rounded-lg bg-[#1D382A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#31543D]";
const muted = "text-sm text-[#758078]";

function Section({ title, description, children }: {
  title: string; description: string; children: React.ReactNode;
}) {
  return <section className="mb-8 rounded-xl border border-[#E2E4DC] bg-white p-5 md:p-6">
    <h2 className="font-[var(--font-playfair)] text-xl font-bold text-[#1D382A]">{title}</h2>
    <p className={`mt-1 ${muted}`}>{description}</p>
    <div className="mt-5">{children}</div>
  </section>;
}

export default async function ReadingPage() {
  const supabase = await requireAdminPermission("reading.manage");
  const [booksResult, plansResult, sessionsResult, discussionsResult] = await Promise.all([
    supabase.from("books").select("id,title,author,status,created_at").order("created_at", { ascending: false }),
    supabase.from("reading_plans").select("id,title,book_id,status,starts_on,ends_on").order("created_at", { ascending: false }),
    supabase.from("reading_sessions").select("id,title,reading_plan_id,session_date,session_type,chapters").order("session_date", { ascending: false }),
    supabase.from("reading_discussions").select("id,topic,display_name,is_published,created_at").order("created_at", { ascending: false }),
  ]);
  const books = booksResult.data ?? [];
  const plans = plansResult.data ?? [];
  const sessions = sessionsResult.data ?? [];
  const discussions = discussionsResult.data ?? [];

  return <main className="min-h-screen bg-[#F6F4EC] md:flex">
    <AdminSidebar />
    <div className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">
      <header className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#4F6F4A]">THE GROWTH CIRCLE</p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl font-bold text-[#1D382A]">Books & Reading</h1>
        <p className={`mt-2 ${muted}`}>Manage the reading library, plans, sessions and discussion visibility.</p>
      </header>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[["Books", books.length], ["Reading plans", plans.length], ["Sessions", sessions.length], ["Discussions", discussions.length]].map(([label, count]) =>
          <div key={label} className="rounded-xl border border-[#E2E4DC] bg-white p-5">
            <p className={muted}>{label}</p><p className="mt-2 text-2xl font-bold text-[#1D382A]">{count}</p>
          </div>)}
      </div>

      {booksResult.error && <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Books could not be loaded. Check that this admin account has books.manage permission. ({booksResult.error.message})</p>}
      {plansResult.error && <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Reading plans could not be loaded: {plansResult.error.message}</p>}
      {sessionsResult.error && <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Reading sessions could not be loaded: {sessionsResult.error.message}</p>}
      {discussionsResult.error && <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Discussions could not be loaded. Check discussions.moderate permission. ({discussionsResult.error.message})</p>}

      <Section title="Add a book" description="Add a title to the community reading library.">
        <form action={createBook} className="grid gap-3 md:grid-cols-2">
          <input name="title" required placeholder="Book title" className={input}/>
          <input name="author" required placeholder="Author" className={input}/>
          <input name="description" placeholder="Short description (optional)" className={input}/>
          <select name="status" className={input}><option value="planned">Planned</option><option value="current">Current</option><option value="completed">Completed</option><option value="archived">Archived</option></select>
          <div><button className={button}>Add book</button></div>
        </form>
      </Section>

      <Section title="Book library" description="Update a book's status or remove it if it is not linked to a reading plan.">
        {books.length === 0 ? <p className={muted}>No books found.</p> : <div className="space-y-3">
          {books.map(book => <div key={book.id} className="flex flex-col gap-3 rounded-lg border border-[#E8EAE4] p-4 md:flex-row md:items-center md:justify-between">
            <div><p className="font-semibold text-[#1D382A]">{book.title}</p><p className={muted}>{book.author}</p></div>
            <div className="flex flex-wrap gap-2">
              <form action={updateBookStatus} className="flex gap-2"><input type="hidden" name="id" value={book.id}/><select name="status" defaultValue={book.status} className={input}><option value="planned">Planned</option><option value="current">Current</option><option value="completed">Completed</option><option value="archived">Archived</option></select><button className={button}>Save</button></form>
              <form action={deleteBook}><input type="hidden" name="id" value={book.id}/><button className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700">Delete</button></form>
            </div>
          </div>)}
        </div>}
      </Section>

      <Section title="Create a reading plan" description="Connect a plan to a book and set its timeline.">
        <form action={createReadingPlan} className="grid gap-3 md:grid-cols-2">
          <input name="title" required placeholder="Plan title" className={input}/>
          <select name="book_id" className={input}><option value="">Select a book (optional)</option>{books.map(book => <option key={book.id} value={book.id}>{book.title}</option>)}</select>
          <input name="starts_on" type="date" aria-label="Start date" className={input}/>
          <input name="ends_on" type="date" aria-label="End date" className={input}/>
          <input name="description" placeholder="Description (optional)" className={input}/>
          <select name="status" className={input}><option value="planned">Planned</option><option value="active">Active</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select>
          <div><button className={button}>Create plan</button></div>
        </form>
      </Section>

      <Section title="Reading plans" description="Review plans and update their status.">
        {plans.length === 0 ? <p className={muted}>No reading plans found.</p> : <div className="space-y-3">{plans.map(plan => <div key={plan.id} className="flex flex-col gap-3 rounded-lg border border-[#E8EAE4] p-4 md:flex-row md:items-center md:justify-between">
          <div><p className="font-semibold text-[#1D382A]">{plan.title}</p><p className={muted}>{plan.starts_on || "No start date"} — {plan.ends_on || "No end date"}</p></div>
          <div className="flex flex-wrap gap-2"><form action={updatePlanStatus} className="flex gap-2"><input type="hidden" name="id" value={plan.id}/><select name="status" defaultValue={plan.status} className={input}><option value="planned">Planned</option><option value="active">Active</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select><button className={button}>Save</button></form><form action={deleteReadingPlan}><input type="hidden" name="id" value={plan.id}/><button className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700">Delete</button></form></div>
        </div>)}</div>}
      </Section>

      <Section title="Schedule a reading session" description="Add a dated reading, discussion or combined session.">
        <form action={createReadingSession} className="grid gap-3 md:grid-cols-2">
          <input name="title" required placeholder="Session title" className={input}/>
          <select name="reading_plan_id" className={input}><option value="">Link to a plan (optional)</option>{plans.map(plan => <option key={plan.id} value={plan.id}>{plan.title}</option>)}</select>
          <input name="session_date" required type="date" className={input}/>
          <input name="starts_at" type="time" aria-label="Start time" className={input}/>
          <input name="duration_minutes" type="number" min="15" max="480" defaultValue="120" className={input}/>
          <select name="session_type" className={input}><option value="reading_and_discussion">Reading & discussion</option><option value="reading">Reading</option><option value="discussion">Discussion</option></select>
          <input name="chapters" placeholder="Chapters (optional)" className={input}/>
          <input name="notes" placeholder="Notes (optional)" className={input}/>
          <div><button className={button}>Create session</button></div>
        </form>
      </Section>

      <Section title="Scheduled sessions" description="Upcoming and previous sessions.">
        {sessions.length === 0 ? <p className={muted}>No sessions found.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b text-[#758078]"><th className="p-3">Session</th><th className="p-3">Date</th><th className="p-3">Type</th><th className="p-3">Chapters</th></tr></thead><tbody>{sessions.map(session => <tr key={session.id} className="border-b border-[#EEF0EA]"><td className="p-3 font-medium text-[#1D382A]">{session.title}</td><td className="p-3">{session.session_date}</td><td className="p-3">{session.session_type.replaceAll("_", " ")}</td><td className="p-3">{session.chapters || "—"}</td></tr>)}</tbody></table></div>}
      </Section>

      <Section title="Discussion moderation" description="Control whether member contributions appear publicly.">
        {discussions.length === 0 ? <p className={muted}>No discussion contributions found.</p> : <div className="space-y-3">{discussions.map(item => <div key={item.id} className="flex flex-col gap-3 rounded-lg border border-[#E8EAE4] p-4 md:flex-row md:items-center md:justify-between"><div><p className="font-semibold text-[#1D382A]">{item.topic}</p><p className={muted}>By {item.display_name || "Community member"} · {item.is_published ? "Published" : "Not published"}</p></div><form action={updateDiscussionVisibility}><input type="hidden" name="id" value={item.id}/><input type="hidden" name="is_published" value={String(!item.is_published)}/><button className={button}>{item.is_published ? "Unpublish" : "Publish"}</button></form></div>)}</div>}
      </Section>
    </div>
  </main>;
}
