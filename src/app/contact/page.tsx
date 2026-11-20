import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Contact | The Growth Circle",
  description: "Have a question, an idea, or a proposal? We'd be glad to hear from you.",
};

export default function ContactPage() {
  return (
    <main>
      <SiteHeader />
      <section className="contact-hero page-shell">
        <p className="eyebrow eyebrow-light">LET&apos;S CONNECT</p>
        <h1>A conversation can<br />be the <em>beginning.</em></h1>
        <p>Have a question, an idea, or a proposal? We&apos;d be glad to hear from you.</p>
      </section>

      <section className="contact-layout page-shell">
        <div className="contact-intro">
          <p className="eyebrow">GET IN TOUCH</p>
          <h2>Reach the Growth Circle team.</h2>
          <p>Use the form to send your enquiry. Choose the topic that best describes what you&apos;d like to discuss and we&apos;ll direct it to the right place.</p>
          <div className="contact-info-block">
            <p className="card-kicker">MEMBERSHIP</p>
            <p>Interested in joining? Visit the membership application page to learn about the process.</p>
            <Link href="/get-involved">Membership information ↗</Link>
          </div>
          <div className="contact-info-block">
            <p className="card-kicker">SOCIAL MEDIA</p>
            <p>Follow our community updates, reading reflections and activities on our social channels.</p>
            <span className="muted-note">Social links to be configured</span>
          </div>
        </div>

        <div className="contact-form-card">
          <h2>Send us a message.</h2>
          <p className="form-note">Fields marked with * are required.</p>
          <form>
            <div className="form-row">
              <label>Full name *<input type="text" name="name" placeholder="Your name" required /></label>
              <label>Email address *<input type="email" name="email" placeholder="you@example.com" required /></label>
            </div>
            <label>What is this about?
              <select name="topic" defaultValue="general">
                <option value="general">General enquiry</option>
                <option value="membership">Membership</option>
                <option value="volunteering">Volunteering</option>
                <option value="partnership">Partnership</option>
                <option value="support">Supporting our work</option>
              </select>
            </label>
            <label>Your message *<textarea name="message" placeholder="Tell us a little about your enquiry..." rows={5} required /></label>
            <button className="button" type="button" disabled>Send message ↗</button>
          </form>
          <p className="prototype-note">This form is currently a UI prototype and does not send messages to an inbox.</p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
