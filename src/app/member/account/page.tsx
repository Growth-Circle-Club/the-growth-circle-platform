import SectionHeading from "../components/section-heading";
import { requireActiveMember } from "@/lib/member";
import PasswordForm from "./password-form";
export const instant = false;
export default async function MemberAccountPage(){const {supabase}=await requireActiveMember();const {data}=await supabase.auth.getUser();return <><SectionHeading eyebrow="ACCOUNT & SECURITY" title="Account settings" description="Manage your sign-in details and keep your account secure."/>
  <div className="member-grid member-grid-2"><section className="member-card"><h2>Sign-in details</h2><p className="member-card-subtitle">The email address associated with your account.</p><div style={{marginTop:18}}><div className="member-field"><label htmlFor="account-email">Email address</label><input id="account-email" value={data.user?.email??""} readOnly/></div></div></section>
  <section className="member-card"><h2>Change password</h2><p className="member-card-subtitle">Choose a strong password you do not use elsewhere.</p><PasswordForm/></section></div>
  <div className="member-alert" style={{marginTop:18}}>Notification preferences are not available yet because the current platform database does not include notification settings. They can be added when the notification feature is designed.</div>
</>}
