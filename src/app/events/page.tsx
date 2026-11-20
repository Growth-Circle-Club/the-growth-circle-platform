import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Events | The Growth Circle",
  description: "From community meetups to learning experiences, our events create opportunities to connect, share ideas and build relationships.",
};

const features = [
    { number: "01", title: "Community meetups", description: "Spend time together, build connections and continue conversations beyond reading sessions." },
    { number: "02", title: "Learning experiences", description: "Take part in activities that encourage reflection, knowledge-sharing and practical growth." },
    { number: "03", title: "Outreach", description: "Explore opportunities to share knowledge and encourage learning beyond our community." }
];

export default function Page() {
  return (
    <main>
      <SiteHeader />
      <section className="inner-hero page-shell">
        <p className="eyebrow">LEARN · CONNECT · EXPERIENCE</p>
        <h1>Good conversations deserve room beyond the page.</h1>
        <p className="inner-hero-description">From community meetups to learning experiences, our events create opportunities to connect, share ideas and build relationships.</p>
      </section>

      <section className="inner-content page-shell">
        <p className="eyebrow">GROWING TOGETHER</p>
        <h2 className="section-heading">Experiences that bring the community closer.</h2>
        <p className="section-intro">We create spaces for members and friends of the Circle to meet, exchange ideas and enjoy learning together. Event announcements and registration details will be published here.</p>
        <div className="inner-feature-grid">
          {features.map((feature) => (
            <article className="inner-feature-card" key={feature.number}>
              <p className="card-kicker">{feature.number}</p>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="inner-cta">
        <p className="eyebrow eyebrow-light">TAKE THE NEXT STEP</p>
        <h2>Be part of the next gathering.</h2>
        <p>Connect with the community to hear about upcoming events and ways to participate.</p>
        <Link className="button button-light" href="/community">Discover the community</Link>
      </section>
      <SiteFooter />
    </main>
  );
}
