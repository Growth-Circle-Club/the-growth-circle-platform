import Link from "next/link";

const links = [
  ["About", "/about"],
  ["Reading & Books", "/reading"],
  ["Blog", "/blog"],
  ["Events", "/events"],
  ["Community", "/community"],
] as const;

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="The Growth Circle home">
        <span className="brand-name">THE GROWTH CIRCLE</span>
        <span className="brand-tagline">READ. CONNECT. GROW.</span>
      </Link>
      <nav className="main-nav" aria-label="Main navigation">
        {links.map(([label, href]) => (
          <Link href={href} key={href}>{label}</Link>
        ))}
      </nav>
      <div className="header-actions">
        <Link className="button button-dark button-small" href="/get-involved">Join the community ↗</Link>
      </div>
    </header>
  );
}
