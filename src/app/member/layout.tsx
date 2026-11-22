import type { ReactNode } from "react";
import { requireActiveMember } from "@/lib/member";
import MemberNav from "./components/member-nav";
import "./member-portal.css";

export default async function MemberLayout({ children }: { children: ReactNode }) {
  const { profile } = await requireActiveMember();
  return <div className="member-app"><MemberNav fullName={profile.full_name ?? "Growth Circle member"} profileImage={profile.profile_image} />
    <main className="member-main"><div className="member-content">{children}</div><footer className="member-footer"><span>THE GROWTH CIRCLE</span><span>Read. Connect. Grow.</span></footer></main>
  </div>;
}
