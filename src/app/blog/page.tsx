import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Blog & Articles | The Growth Circle",
  description: "A space for reflections, lessons and perspectives inspired by books, conversations and the experiences that shape how we grow.",
};

const features = [
    { number: "01", title: "Book reflections", description: "Explore lessons and questions inspired by the books we read." },
    { number: "02", title: "Personal development", description: "Consider practical ideas around mindset, purpose, habits and growth." },
    { number: "03", title: "Community perspectives", description: "Learn from the experiences and insights of people in the Circle." }
];

export default function Page() {
  return (
    <main>
      <SiteHeader />
      <section className="inner-hero page-shell">
        <p className="eyebrow">IDEAS · PERSPECTIVES · REFLECTIONS</p>
        <h1>Thoughts worth sharing. Ideas worth exploring.</h1>
        <p className="inner-hero-description">A space for reflections, lessons and perspectives inspired by books, conversations and the experiences that shape how we grow.</p>
      </section>

      <section className="inner-content page-shell">
        <p className="eyebrow">FROM THE CIRCLE</p>
        <h2 className="section-heading">Learning does not end when the book closes.</h2>
        <p className="section-intro">This is where community ideas and thoughtful contributions can live beyond our reading sessions. Articles and submissions will be added as they are reviewed and published.</p>
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
        <h2>Have an idea to contribute?</h2>
        <p>We welcome thoughtful contributions that encourage learning and meaningful conversation.</p>
        <Link className="button button-light" href="/get-involved">Contribute to the Circle</Link>
      </section>
      <SiteFooter />
    </main>
  );
}
