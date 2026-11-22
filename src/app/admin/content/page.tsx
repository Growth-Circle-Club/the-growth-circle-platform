import { requireAdminPermission } from "@/lib/admin";
import AdminSidebar from "../admin-sidebar";
import { createContentPost, updateContentPost, deleteContentPost } from "./actions";
export const instant = false;
const input = "w-full rounded-lg border border-[#DDE2D8] bg-white px-3 py-2 text-sm text-[#1D382A]";
const button = "rounded-lg bg-[#1D382A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#31543D]";
const muted = "text-sm text-[#758078]";

export default async function ContentPage() {
  const supabase = await requireAdminPermission("articles.manage");
  const { data: posts, error } = await supabase.from("content_posts")
    .select("id,title,slug,excerpt,content_type,status,published_at,created_at")
    .order("created_at", { ascending: false });
  const items = posts ?? [];
  const count = (status: string) => items.filter(post => post.status === status).length;

  return <main className="min-h-screen bg-[#F6F4EC] md:flex">
    <AdminSidebar />
    <div className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">
      <header className="mb-8"><p className="text-xs font-semibold tracking-[0.2em] text-[#4F6F4A]">THE GROWTH CIRCLE</p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl font-bold text-[#1D382A]">Content Management</h1>
        <p className={`mt-2 ${muted}`}>Create announcements, book reviews, articles and community updates.</p>
      </header>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">{[["Published", count("published")], ["Drafts", count("draft")], ["Archived", count("archived")]].map(([label, number]) =>
        <div key={label} className="rounded-xl border border-[#E2E4DC] bg-white p-5"><p className={muted}>{label}</p><p className="mt-2 text-2xl font-bold text-[#1D382A]">{number}</p></div>)}</div>

      {error && <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">We could not load content: {error.message}</p>}

      <section className="mb-8 rounded-xl border border-[#E2E4DC] bg-white p-5 md:p-6">
        <h2 className="font-[var(--font-playfair)] text-xl font-bold text-[#1D382A]">Create content</h2>
        <p className={`mt-1 ${muted}`}>A published post receives a publication timestamp immediately.</p>
        <form action={createContentPost} className="mt-5 grid gap-3 md:grid-cols-2">
          <input name="title" required placeholder="Title" className={input}/>
          <input name="slug" placeholder="URL slug (optional; generated from title)" className={input}/>
          <select name="content_type" className={input}><option value="announcement">Announcement</option><option value="book_review">Book review</option><option value="article">Article</option><option value="update">Update</option></select>
          <select name="status" className={input}><option value="draft">Save as draft</option><option value="published">Publish now</option><option value="archived">Archive</option></select>
          <textarea name="excerpt" placeholder="Short excerpt (optional)" rows={2} className={input}/>
          <textarea name="body" placeholder="Content body (optional)" rows={5} className={input}/>
          <div><button className={button}>Create post</button></div>
        </form>
      </section>

      <section className="rounded-xl border border-[#E2E4DC] bg-white p-5 md:p-6">
        <h2 className="font-[var(--font-playfair)] text-xl font-bold text-[#1D382A]">All content</h2>
        <div className="mt-5 space-y-3">
          {items.length === 0 ? <p className={muted}>No content posts found.</p> : items.map(post => <article key={post.id} className="rounded-lg border border-[#E8EAE4] p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0"><h3 className="font-semibold text-[#1D382A]">{post.title}</h3><p className={`mt-1 ${muted}`}>/{post.slug} · {post.content_type.replaceAll("_", " ")} · {post.status}</p>{post.excerpt && <p className="mt-2 text-sm text-[#536158]">{post.excerpt}</p>}</div>
              <div className="flex flex-wrap gap-2">
                <form action={updateContentPost} className="flex gap-2"><input type="hidden" name="id" value={post.id}/><select name="status" defaultValue={post.status} className={input}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select><button className={button}>Save</button></form>
                <form action={deleteContentPost}><input type="hidden" name="id" value={post.id}/><button className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700">Delete</button></form>
              </div>
            </div>
          </article>)}
        </div>
      </section>
    </div>
  </main>;
}
