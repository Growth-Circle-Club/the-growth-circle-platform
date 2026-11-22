import SectionHeading from "../components/section-heading";
import { requireActiveMember } from "@/lib/member";
import { updateMemberProfile } from "./actions";
import ProfilePhotoUpload from "./profile-photo-upload";
export const instant = false;
export default async function MemberProfilePage(){const {profile}=await requireActiveMember();return <>
  <SectionHeading eyebrow="YOUR DETAILS" title="My profile" description="Keep your details up to date so the community can get to know you."/>
  <div className="member-grid member-grid-2">
    <section className="member-card"><h2>Profile photo</h2><p className="member-card-subtitle">Add a photo so members can recognise you in the community.</p><div style={{marginTop:20}}><ProfilePhotoUpload initialUrl={profile.profile_image} fullName={profile.full_name??"Member"}/></div></section>
    <section className="member-card"><h2>Membership</h2><p className="member-card-subtitle">Your Growth Circle membership status.</p><div style={{marginTop:18}}><span className="member-pill">Active member</span></div><p className="member-card-subtitle" style={{marginTop:12}}>Your profile information is visible to you and authorised community administrators.</p></section>
    <section className="member-card" style={{gridColumn:"1 / -1"}}><h2>Personal information</h2><p className="member-card-subtitle">Update the details associated with your member profile.</p>
      <form action={updateMemberProfile} className="member-form" style={{marginTop:20}}><div className="member-form-row"><div className="member-field"><label htmlFor="full_name">Full name</label><input id="full_name" name="full_name" defaultValue={profile.full_name??""} maxLength={100} required/></div><div className="member-field"><label htmlFor="phone">Phone number</label><input id="phone" name="phone" defaultValue={profile.phone??""} maxLength={40}/></div></div>
      <div className="member-form-row"><div className="member-field"><label htmlFor="location">Location</label><input id="location" name="location" defaultValue={profile.location??""} maxLength={100} placeholder="e.g. Lagos, Nigeria"/></div><div className="member-field"><label htmlFor="bio">A little about you</label><textarea id="bio" name="bio" defaultValue={profile.bio??""} maxLength={600} placeholder="Share a little about your interests and growth journey."/></div></div>
      <div><button type="submit" className="member-button member-button-primary">Save profile</button></div></form>
    </section>
  </div>
</>}
