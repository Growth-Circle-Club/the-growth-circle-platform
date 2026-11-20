import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Get Involved | The Growth Circle",
  description: "Join the community, contribute your skills, partner with our initiatives or support the work.",
};

const pathways = [
  { id: "membership", title: "Become a member", kicker: "JOIN THE COMMUNITY", description: "Take part in shared reading, thoughtful conversations and a community committed to continuous development.", points: ["Application-based membership", "Reading and discussion activities", "Community connection and participation"], action: "Apply for membership", href: "/contact" },
  { id: "volunteer", title: "Volunteer your time", kicker: "SHARE YOUR SKILLS", description: "Bring your time, experience or skills to help make our activities more meaningful and engaging.", points: ["Content and social media", "Reading and discussion support", "Events and community coordination"], action: "Offer to volunteer", href: "/contact" },
  { id: "partner", title: "Partner with us", kicker: "BUILD WITH US", description: "Work with us on initiatives that encourage reading, learning and personal development.", points: ["Aligned organisational partnerships", "Learning and outreach initiatives", "Collaborative community programmes"], action: "Discuss a partnership", href: "/contact" },
  { id: "support", title: "Support our work", kicker: "HELP THE CIRCLE GROW", description: "Your contribution can help create more room for reading, connection and community impact.", points: ["Support reading activities", "Contribute to outreach efforts", "Help sustain community programmes"], action: "Ask how to support", href: "/contact" },
];

export default function GetInvolvedPage() {
  return (
    <main>
      <SiteHeader />
      <section className="involved-hero page-shell">
        <p className="eyebrow eyebrow-light">BE PART OF THE JOURNEY</p>
        <h1>There is more<br />than one way to<br /><em>grow together.</em></h1>
        <p>Join the community, contribute your skills, partner with our initiatives or support the work. Every meaningful contribution helps create room for growth.</p>
      </section>

      <section className="pathways-section page-shell">
        <div className="pathways-intro">
          <p className="eyebrow">CHOOSE YOUR PATHWAY</p>
          <h2>Get involved.</h2>
          <p>Explore the different ways to take part in the Growth Circle journey.</p>
          <nav className="pathway-links" aria-label="Ways to get involved">
            {pathways.map((pathway) => <a href={`#${pathway.id}`} key={pathway.id}>{pathway.title}<span>↗</span></a>)}
          </nav>
        </div>
        <div className="pathway-details">
          {pathways.map((pathway) => (
            <article className="pathway-card" id={pathway.id} key={pathway.id}>
              <p className="eyebrow">{pathway.kicker}</p>
              <h2>{pathway.title}</h2>
              <p>{pathway.description}</p>
              <ul>{pathway.points.map((point) => <li key={point}>{point}</li>)}</ul>
              <Link className="button" href={pathway.href}>{pathway.action} ↓</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="involved-contact">
        <div className="involved-contact-inner page-shell">
          <div>
            <p className="eyebrow">START A CONVERSATION</p>
            <h2>Tell us how you&apos;d like<br />to get involved.</h2>
            <p>Share your details and area of interest. The Growth Circle team can follow up with the relevant next steps.</p>
            <small>This is a UI prototype. Form submission will be connected to the platform when backend services are implemented.</small>
          </div>
          <form className="interest-form">
            <div className="form-row">
              <label>Your name<input type="text" name="name" placeholder="Full name" /></label>
              <label>Email address<input type="email" name="email" placeholder="you@example.com" /></label>
            </div>
            <label>I&apos;m interested in
              <select name="interest" defaultValue="membership">
                <option value="membership">Membership</option><option value="volunteering">Volunteering</option><option value="partnership">Partnership</option><option value="support">Supporting our work</option>
              </select>
            </label>
            <button className="button" type="button" disabled>Send my interest ↗</button>
          </form>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
