import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Reading & Books | The Growth Circle",
  description: "Our reading programme uses books as a starting point for thoughtful conversations, shared reflection and practical application.",
};

const features = [
    { number: "01", title: "Shared reading", description: "Read together during scheduled sessions and follow the ideas as a group." },
    { number: "02", title: "Open discussion", description: "Explore key points, challenge assumptions and hear different perspectives." },
    { number: "03", title: "Practical application", description: "Consider what each idea means beyond the book and how it can be applied." }
];

export default function Page() {
  return (
    <main>
      <SiteHeader />
      <section className="inner-hero page-shell">
        <p className="eyebrow">READ · THINK · DISCUSS · APPLY</p>
        <h1>Read more thoughtfully. Learn more together.</h1>
        <p className="inner-hero-description">Our reading programme uses books as a starting point for thoughtful conversations, shared reflection and practical application.</p>
      </section>

      <section className="inner-content page-shell">
        <p className="eyebrow">HOW WE READ TOGETHER</p>
        <h2 className="section-heading">A reading experience built around understanding, not rushing.</h2>
        <p className="section-intro">Our current format creates time for both reading and discussion. Members can explore key ideas, ask questions and learn from one another&apos;s interpretations.</p>
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
        <h2>Make reading a shared experience.</h2>
        <p>Discover the community and learn how to take part in our reading sessions.</p>
        <Link className="button button-light" href="/community">Explore the community</Link>
      </section>
      <SiteFooter />
    </main>
  );
}
