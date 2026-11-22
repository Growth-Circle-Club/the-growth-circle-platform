
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Overview", href: "/admin" },
  { name: "Membership Applications", href: "/admin/applications" },
  { name: "Community Members", href: "/admin/members" },
  { name: "Books & Reading", href: "/admin/reading" },
  { name: "Events & Activities", href: "/admin/events" },
  { name: "Content Management", href: "/admin/content" },
  { name: "Settings", href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col bg-[#1D382A] p-6 text-white md:min-h-screen md:w-64">
      <div className="mb-10">
        <p className="text-sm font-semibold tracking-[0.2em] text-[#D9A441]">
          THE GROWTH CIRCLE
        </p>
        <p className="mt-2 text-xs text-white/60">Administration</p>
      </div>

      <nav className="flex flex-col gap-2">
        {navigation.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-4 py-3 text-sm transition ${
                active
                  ? "bg-white/15 font-semibold text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-10">
        <Link
          href="/"
          className="text-sm text-white/60 transition hover:text-white"
        >
          ← Back to website
        </Link>
      </div>
    </aside>
  );
}
