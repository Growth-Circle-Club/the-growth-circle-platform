
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "./admin-sidebar";
import LogoutButton from "./logout-button";
import Link from "next/link";

export const instant = false;
const dashboardSections = [
  {
    title: "Membership Applications",
    description: "Review and manage applications to join the community.",
    status: "Application management",
    href: "/admin/applications",
  },
  {
    title: "Community Members",
    description: "View and manage your community members.",
    status: "Member directory",
    href: "/admin/members",
  },
  {
    title: "Books & Reading",
    description: "Manage books, reading schedules and discussions.",
    status: "Reading management",
    href: "/admin/reading",
  },
  {
    title: "Events & Activities",
    description: "Organise meetups, events and community activities.",
    status: "Event management",
    href: "/admin/events",
  },
  {
    title: "Content Management",
    description: "Organise announcements and community content.",
    status: "Content management",
    href: "/admin/content",
  },
  {
    title: "Settings",
    description: "Manage administrative settings and account access.",
    status: "Administration",
    href: "/admin/settings",
  },
];


export default async function AdminPage() {
  const supabase = await createClient();

  const { data, error: authError } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (authError || !claims?.sub) {
    redirect("/login");
  }

  const { data: isMainAdmin, error: roleError } =
    await supabase.rpc("is_main_admin");

  if (roleError || !isMainAdmin) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-[#F6F4EC] md:flex">
      <AdminSidebar />

      <div className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#4F6F4A]">
              THE GROWTH CIRCLE
            </p>

            <h1 className="mt-3 font-[var(--font-playfair)] text-3xl font-bold text-[#1D382A] md:text-4xl">
              Dashboard Overview
            </h1>

            <p className="mt-2 text-sm text-[#758078]">
              Welcome to your community administration space.
            </p>
          </div>

          <LogoutButton />
        </header>

        <section className="mb-10">
          <div className="mb-5">
            <h2 className="font-[var(--font-playfair)] text-xl font-bold text-[#1D382A]">
              Community Management
            </h2>
            <p className="mt-1 text-sm text-[#758078]">
              Your central space for managing Growth Circle.
            </p>
          </div>

<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
  {dashboardSections.map((section) => (
    <Link
      key={section.title}
      href={section.href}
      className="rounded-xl border border-[#E2E4DC] bg-white p-6 transition hover:border-[#A7C08A] hover:shadow-sm"
    >
      <p className="text-xs font-medium text-[#4F6F4A]">
        {section.status}
      </p>

      <h3 className="mt-3 font-semibold text-[#1D382A]">
        {section.title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#758078]">
        {section.description}
      </p>
    </Link>
  ))}
</div>
        </section>

        <section className="rounded-xl border border-[#E2E4DC] bg-white p-6">
          <h2 className="font-[var(--font-playfair)] text-lg font-bold text-[#1D382A]">
            Your Community, One Step at a Time
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#758078]">
            This dashboard will bring together membership, reading activities,
            events and content management as the platform develops.
          </p>
        </section>
      </div>
    </main>
  );
}
