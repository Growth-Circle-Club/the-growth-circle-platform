import { requireAdminPermission } from "@/lib/admin";
import AdminSidebar from "../admin-sidebar";
import { saveSetting, deleteSetting } from "./actions";

const input = "w-full rounded-lg border border-[#DDE2D8] bg-white px-3 py-2 text-sm text-[#1D382A]";
const button = "rounded-lg bg-[#1D382A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#31543D]";
const muted = "text-sm text-[#758078]";

function displayValue(value: unknown) {
  return typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

export default async function SettingsPage() {
  const supabase = await requireAdminPermission("settings.manage");
  const { data: settings, error } = await supabase.from("platform_settings")
    .select("setting_key,setting_value,description,updated_at")
    .order("setting_key", { ascending: true });
  const items = settings ?? [];

  return <main className="min-h-screen bg-[#F6F4EC] md:flex">
    <AdminSidebar />
    <div className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">
      <header className="mb-8"><p className="text-xs font-semibold tracking-[0.2em] text-[#4F6F4A]">THE GROWTH CIRCLE</p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl font-bold text-[#1D382A]">Platform Settings</h1>
        <p className={`mt-2 ${muted}`}>Manage key-value configuration stored by the platform.</p>
      </header>

      <div className="mb-6 rounded-xl border border-[#E2E4DC] bg-white p-5">
        <p className={muted}>Stored settings</p><p className="mt-2 text-2xl font-bold text-[#1D382A]">{items.length}</p>
      </div>

      {error && <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">We could not load platform settings: {error.message}</p>}

      <section className="mb-8 rounded-xl border border-[#E2E4DC] bg-white p-5 md:p-6">
        <h2 className="font-[var(--font-playfair)] text-xl font-bold text-[#1D382A]">Add or update a setting</h2>
        <p className={`mt-1 ${muted}`}>Use a unique key. The value must be valid JSON, such as a string, number, boolean, array or object.</p>
        <form action={saveSetting} className="mt-5 grid gap-3">
          <input name="setting_key" required maxLength={100} placeholder="Setting key (e.g. community_name)" className={input}/>
          <input name="description" placeholder="Description (optional)" className={input}/>
          <textarea name="setting_value" required rows={5} defaultValue={'{}'} className={`${input} font-mono`} aria-label="Setting value in JSON"/>
          <div><button className={button}>Save setting</button></div>
        </form>
      </section>

      <section className="rounded-xl border border-[#E2E4DC] bg-white p-5 md:p-6">
        <h2 className="font-[var(--font-playfair)] text-xl font-bold text-[#1D382A]">Current settings</h2>
        <div className="mt-5 space-y-4">
          {items.length === 0 ? <p className={muted}>No settings have been added yet.</p> : items.map(item => <article key={item.setting_key} className="rounded-lg border border-[#E8EAE4] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0"><h3 className="font-semibold text-[#1D382A]">{item.setting_key}</h3>{item.description && <p className={`mt-1 ${muted}`}>{item.description}</p>}<pre className="mt-3 overflow-x-auto rounded-lg bg-[#F6F4EC] p-3 text-xs text-[#34483A]">{displayValue(item.setting_value)}</pre><p className="mt-2 text-xs text-[#89928B]">Updated: {item.updated_at ? new Date(item.updated_at).toLocaleString() : "Not available"}</p></div>
              <form action={deleteSetting}><input type="hidden" name="setting_key" value={item.setting_key}/><button className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700">Delete</button></form>
            </div>
          </article>)}
        </div>
      </section>
    </div>
  </main>;
}
