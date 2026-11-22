export default function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <header className="member-page-heading"><p className="member-eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="member-page-description">{description}</p>}</header>;
}
