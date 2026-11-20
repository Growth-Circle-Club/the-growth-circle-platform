import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "About The Growth Circle | The Growth Circle",
  description: "The Growth Circle brings curious, ambitious people together to read, exchange perspectives and turn useful ideas into everyday growth.",
};

const features = [
    { number: "01", title: "Read with intention", description: "Explore books and ideas that challenge assumptions and open up new perspectives." },
    { number: "02", title: "Think beyond the page", description: "Make space for reflection, questions and different points of view." },
    { number: "03", title: "Grow together", description: "Encourage one another to apply useful lessons in real life." }
];

export default function Page() {
  return (
    <main>
      <SiteHeader />
      <section className="inner-hero page-shell">
        <p className="eyebrow">OUR STORY · OUR PURPOSE</p>
        <h1>A community built around learning and growing together.</h1>
        <p className="inner-hero-description">The Growth Circle brings curious, ambitious people together to read, exchange perspectives and turn useful ideas into everyday growth.</p>
      </section>

      <section className="inner-content page-shell">
        <p className="eyebrow">WHAT WE BELIEVE</p>
        <h2 className="section-heading">Books are the vehicle. Community is the environment. Growth is the outcome.</h2>
        <p className="section-intro">We believe learning becomes more meaningful when people have room to reflect, ask questions, share experiences and put ideas into practice.</p>
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
        <h2>There is room in the circle for you.</h2>
        <p>Bring your curiosity, your questions and your perspective. We can learn from one another.</p>
        <Link className="button button-light" href="/get-involved">Get involved</Link>
      </section>
      <SiteFooter />
    </main>
  );
}
