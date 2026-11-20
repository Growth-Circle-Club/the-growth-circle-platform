import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link className="footer-brand" href="/" aria-label="The Growth Circle home">
        <span className="brand-name">THE GROWTH CIRCLE · READ. CONNECT. GROW.</span>
      </Link>
      <span className="footer-message">A community that grows together, one book at a time.</span>
    </footer>
  );
}
