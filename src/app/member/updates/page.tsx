
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "../components/section-heading";
import { requireActiveMember } from "@/lib/member";

export const instant = false;

export default async function MemberUpdatesPage() {
  const { supabase } = await requireActiveMember();

  const { data: posts } = await supabase
    .from("content_posts")
    .select(
      "id,title,excerpt,content_type,published_at,cover_image_url"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <>
      <SectionHeading
        eyebrow="WHAT'S HAPPENING"
        title="Community updates"
        description="Announcements, book reviews, articles and useful updates from The Growth Circle."
      />

      {posts?.length ? (
        <div className="member-grid member-grid-2">
          {posts.map((post) => (
            <article className="member-card" key={post.id}>
              {post.cover_image_url && (
                <Image
                  src={post.cover_image_url}
                  alt={post.title}
                  width={800}
                  height={450}
                  unoptimized
                  style={{
                    width: "100%",
                    maxHeight: 190,
                    borderRadius: 10,
                    objectFit: "cover",
                    marginBottom: 15,
                  }}
                />
              )}

              <span className="member-pill">
                {post.content_type.replaceAll("_", " ")}
              </span>

              <h2 style={{ marginTop: 12 }}>{post.title}</h2>

              {post.excerpt && (
                <p className="member-card-subtitle">{post.excerpt}</p>
              )}

              {post.published_at && (
                <p className="member-card-subtitle">
                  {new Date(post.published_at).toLocaleDateString("en-NG", {
                    dateStyle: "medium",
                  })}
                </p>
              )}

              <Link
                href={`/member/updates/${post.id}`}
                className="member-button member-button-primary"
                style={{ marginTop: 14 }}
              >
                Read update
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="member-empty">
          There are no published community updates yet.
        </div>
      )}
    </>
  );
}
