import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Community | The Growth Circle",
  description: "A community of minds on a shared journey of reading, thinking, connecting and growing together.",
};

const conversations = [
  { title: "Reading sessions", text: "We read together, take time to reflect and explore the ideas that matter." },
  { title: "Member conversations", text: "We make room for different perspectives, honest questions and thoughtful exchange." },
  { title: "Meetups & connection", text: "We create opportunities to meet, build relationships and strengthen the circle beyond the page." },
  { title: "Outreach & impact", text: "We take learning outward through initiatives that encourage reading, curiosity and personal development." },
];

const contributions = [
  { number: "01", title: "Share a perspective", text: "Bring your questions, reflections and lived experience into the conversation." },
  { number: "02", title: "Support the circle", text: "Help create a welcoming environment where people can participate and learn." },
  { number: "03", title: "Take learning outward", text: "Use what you discover to make thoughtful contributions in your work and wider community." },
];

export default function CommunityPage() {
  return (
    <main>
      <SiteHeader />
      <section className="community-hero">
        <div className="community-hero-copy">
          <p className="eyebrow eyebrow-light">THE PEOPLE MAKE THE CIRCLE</p>
          <h1>A community of<br />minds. <em>A shared<br />journey.</em></h1>
          <p>Growth happens in the books we read, the questions we ask, the conversations we share and the actions we take together.</p>
          <Link className="button button-gold" href="/get-involved">Explore our community ↓</Link>
        </div>
        <div className="community-shapes" aria-label="Read together. Think together. Connect meaningfully. Grow together.">
          <div className="community-shape shape-one">Read<br />together.</div>
          <div className="community-shape shape-two">Think<br />together.</div>
          <div className="community-shape shape-three">Connect<br />meaningfully.</div>
          <div className="community-shape shape-four">Grow<br />together.</div>
        </div>
      </section>

      <section className="community-experience page-shell">
        <div className="community-experience-intro">
          <p className="eyebrow">WHAT BRINGS US TOGETHER</p>
          <h2>More than a<br />shared reading<br />list.</h2>
          <p>The Growth Circle is shaped by the people who participate, contribute, encourage one another and keep the conversations alive.</p>
        </div>
        <div className="community-accordions">
          {conversations.map((item, index) => (
            <details key={item.title} open={index === 0}>
              <summary>{item.title}<span aria-hidden="true">+</span></summary>
              <p>{item.text}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="contribution-section">
        <div className="page-shell">
          <p className="eyebrow">A CULTURE OF PARTICIPATION</p>
          <h2>Everyone has something to<br />contribute.</h2>
          <div className="contribution-grid">
            {contributions.map((item) => (
              <article key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="community-cta">
        <p className="eyebrow eyebrow-light">FIND YOUR PLACE IN THE CIRCLE</p>
        <h2>Come as you are. Keep<br />growing.</h2>
        <p>Whether you are a student, professional, entrepreneur or simply curious,<br />there is room to learn and contribute.</p>
        <Link className="button button-gold" href="/get-involved">Apply to join ↗</Link>
      </section>
      <SiteFooter />
    </main>
  );
}
