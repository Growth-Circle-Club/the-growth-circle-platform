import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";


const journey = [
  ["01", "READ", "Read", "Explore ideas and perspectives through shared reading."],
  ["02", "THINK", "Think", "Pause, reflect and question what the ideas mean."],
  ["03", "DISCUSS", "Discuss", "Exchange perspectives in thoughtful conversations."],
  ["04", "APPLY", "Apply", "Turn useful insights into intentional action."],
];

const discover = [
  ["01 / IDEAS", "Stories & articles", "Thoughtful perspectives and ideas from our community.", "/blog"],
  ["02 / TOGETHER", "Events & meetups", "Connect beyond the page through shared experiences.", "/events"],
  ["03 / CONTRIBUTE", "Get involved", "Share your skills, volunteer or support our work.", "/get-involved"],
];



export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section className="hero page-shell">
        <div className="hero-copy">
          <p className="eyebrow">A COMMUNITY THAT GROWS TOGETHER</p>
          <h1>Make room for<br />a new perspective.</h1>
          <p className="hero-description">
            A community that grows together, one book at a time. Read thoughtfully,
            share ideas, and turn what you learn into meaningful growth.
          </p>
          <div className="hero-actions">
            <Link className="button button-dark" href="/join">Become a member</Link>
            <Link className="button button-outline" href="/community">Explore the community</Link>
          </div>
          <p className="hero-path">READ <span>→</span> THINK <span>→</span> DISCUSS <span>→</span> APPLY <span>→</span> GROW</p>
        </div>

        <div className="hero-art" aria-label="Growth Circle brand statement">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-copy">
            <p className="eyebrow eyebrow-light">READ. CONNECT. GROW.</p>
            <h2>Books are the<br />vehicle.<br />Community is the<br />environment.</h2>
            <span className="gold-rule" />
            <p className="art-outcome">Growth is the outcome.</p>
            <p className="art-caption">A circle of minds. A community of readers.</p>
          </div>
          <span className="art-dot dot-one" />
          <span className="art-dot dot-two" />
        </div>
      </section>

      <section className="statement-strip">
        <div className="page-shell strip-inner">
          <p>More than reading. A place to think, connect and grow.</p>
          <span>PURPOSE <b>·</b> PERSPECTIVE <b>·</b> PRACTICAL GROWTH</span>
        </div>
      </section>

      <section className="experience-section page-shell" id="experience">
        <p className="eyebrow">THE GROWTH CIRCLE EXPERIENCE</p>
        <h2 className="section-heading">A simple path to meaningful growth.</h2>
        <p className="section-intro">Books open the door. Conversation and application help make the learning last.</p>
        <div className="journey-grid">
          {journey.map(([number, label, title, description]) => (
            <article className="journey-card" key={number}>
              <p className="card-kicker">{number} / {label}</p>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="why-section">
        <div className="page-shell why-grid">
          <div className="why-feature">
            <p className="eyebrow eyebrow-light">A SPACE FOR</p>
            <h2>Curious minds.<br />Open conversations.<br />Shared progress.</h2>
            <p>Learn alongside people who challenge and encourage you.</p>
            <div className="feature-mark"><span /><span /><span /></div>
          </div>
          <div className="why-copy">
            <p className="eyebrow">WHY GROWTH CIRCLE</p>
            <h2 className="section-heading">Growth happens better together.</h2>
            <p>
              We bring ambitious, curious people together to read, exchange ideas
              and support one another’s growth. Everyone has something to learn,
              and everyone has something to contribute.
            </p>
            <Link className="button button-outline button-compact" href="/community">Discover our community</Link>
          </div>
        </div>
      </section>

      <section className="reading-section page-shell" id="reading">
        <p className="eyebrow">READ WITH US</p>
        <h2 className="section-heading">Ideas worth exploring together.</h2>
        <p className="section-intro">Discover our reading programmes and the conversations around them.</p>
        <div className="featured-reading">
          <div className="book-art">
            <span className="book-label">THE<br />GROWTH<br />CIRCLE</span>
            <span className="book-spine" />
          </div>
          <div className="featured-copy">
            <p className="eyebrow eyebrow-light">OUR READING PROGRAMME</p>
            <h3>Read. Reflect. Grow.</h3>
            <p>Our reading sessions create room to explore meaningful ideas, ask better questions and learn from one another.</p>
            <Link className="button button-light" href="/reading">Explore reading programmes</Link>
          </div>
          <div className="reading-decoration" aria-hidden="true">READ<br />THINK<br />GROW</div>
        </div>
      </section>

      <section className="discover-section">
        <div className="page-shell">
          <p className="eyebrow">MORE FROM THE CIRCLE</p>
          <h2 className="section-heading">There is more to discover.</h2>
       
<div className="discover-grid">
  {discover.map(([kicker, title, description, href]) => (
    <Link className="discover-card" href={href} key={kicker}>
      <p className="card-kicker">{kicker}</p>
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="card-arrow">
        Explore <b>↗</b>
      </span>
    </Link>
  ))}
</div>

        </div>
      </section>

      <section className="closing-cta">
        <p className="eyebrow eyebrow-light">YOUR NEXT CHAPTER STARTS HERE</p>
        <h2>Come grow with us.</h2>
        <p>Bring your curiosity. Share your perspective. Be part of a community that grows together.</p>
        <Link href="/join" className="cta-link">Join the Growth Circle <span>→</span></Link>
      </section>

      <SiteFooter />
    </main>
  );
}
