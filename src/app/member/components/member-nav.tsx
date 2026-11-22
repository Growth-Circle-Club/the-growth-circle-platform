
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const links = [
  ["/member", "Overview", "⌂"],
  ["/member/profile", "My profile", "◉"],
  ["/member/reading", "Books & reading", "▤"],
  ["/member/discussions", "Discussions", "☷"],
  ["/member/updates", "Community updates", "✳"],
  ["/member/events", "Events", "▦"],
  ["/member/account", "Account", "⚙"],
];

export default function MemberNav({
  fullName,
  profileImage,
}: {
  fullName: string;
  profileImage: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside className="member-sidebar">
      <Link href="/member" className="member-brand">
        <span className="member-brand-mark">GC</span>
        <span>
          <strong>THE GROWTH CIRCLE</strong>
          <small>MEMBER SPACE</small>
        </span>
      </Link>

      <div className="member-person">
        {profileImage ? (
          <Image
            src={profileImage}
            alt=""
            width={44}
            height={44}
            unoptimized
            className="member-avatar"
          />
        ) : (
          <span className="member-avatar member-avatar-fallback">
            {fullName.slice(0, 1).toUpperCase()}
          </span>
        )}

        <span>
          <strong>{fullName}</strong>
          <small>Active member</small>
        </span>
      </div>

      <nav className="member-links" aria-label="Member navigation">
        {links.map(([href, label, icon]) => {
          const active =
            href === "/member"
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={
                active ? "member-nav-link active" : "member-nav-link"
              }
            >
              <span aria-hidden="true">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="member-sidebar-bottom">
        <p>READ. CONNECT. GROW.</p>
        <button
          type="button"
          onClick={signOut}
          className="member-signout"
        >
          Sign out ↗
        </button>
      </div>
    </aside>
  );
}
