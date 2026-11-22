
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SectionHeading from "../../components/section-heading";
import { requireActiveMember } from "@/lib/member";
export const instant = false;
export default async function MemberUpdateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireActiveMember();

  const { data: post, error } = await supabase
    .from("content_posts")
    .select(
      "id,title,excerpt,body,content_type,published_at,cover_image_url"
    )
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (error || !post) notFound();

  return (
    <>
      <Link
        href="/member/updates"
        className="member-button member-button-secondary"
        style={{ marginBottom: 20 }}
      >
        ← All updates
      </Link>

      <SectionHeading
        eyebrow={(post.content_type ?? "UPDATE")
          .replaceAll("_", " ")
          .toUpperCase()}
        title={post.title}
        description={post.excerpt ?? undefined}
      />

      <article className="member-card">
        {post.cover_image_url && (
          <Image
            src={post.cover_image_url}
            alt=""
            width={1200}
            height={600}
            unoptimized
            className="h-auto w-full rounded-xl object-cover"
            style={{ maxHeight: 360, marginBottom: 20 }}
          />
        )}

        {post.published_at && (
          <p className="member-card-subtitle">
            {new Date(post.published_at).toLocaleDateString("en-NG", {
              dateStyle: "long",
            })}
          </p>
        )}

        <div
          style={{
            marginTop: 20,
            color: "#4e5f53",
            fontSize: 13,
            lineHeight: 2,
            whiteSpace: "pre-wrap",
          }}
        >
          {post.body}
        </div>
      </article>
    </>
  );
}
