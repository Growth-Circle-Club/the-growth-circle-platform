
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "profile-photos";
const MAX = 3 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ProfilePhotoUpload({
  initialUrl,
  fullName,
}: {
  initialUrl: string | null;
  fullName: string;
}) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState(initialUrl ?? "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  async function upload(file?: File) {
    if (!file) return;

    setMessage("");

    if (!TYPES.includes(file.type)) {
      setFailed(true);
      setMessage("Choose a JPG, PNG or WebP image.");
      return;
    }

    if (file.size > MAX) {
      setFailed(true);
      setMessage("Your image must be 3 MB or smaller.");
      return;
    }

    const supabase = createClient();
    setBusy(true);

    const { data: auth, error: authError } =
      await supabase.auth.getUser();

    if (authError || !auth.user) {
      setBusy(false);
      setFailed(true);
      setMessage("Please sign in again.");
      return;
    }

    const ext =
      file.type === "image/jpeg"
        ? "jpg"
        : file.type === "image/png"
          ? "png"
          : "webp";

    const path = `${auth.user.id}/avatar-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      setBusy(false);
      setFailed(true);
      setMessage(uploadError.message || "Photo upload failed.");
      return;
    }

    const { data: url } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(path);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        profile_image: url.publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", auth.user.id);

    if (updateError) {
      await supabase.storage.from(BUCKET).remove([path]);
      setBusy(false);
      setFailed(true);
      setMessage("Photo uploaded, but profile update failed.");
      return;
    }

    const old = preview
      ?.split(`/${BUCKET}/`)[1]
      ?.split("?")[0];

    if (old && old !== path) {
      await supabase.storage
        .from(BUCKET)
        .remove([decodeURIComponent(old)]);
    }

    setPreview(url.publicUrl);
    setBusy(false);
    setFailed(false);
    setMessage("Profile photo updated.");
    router.refresh();
  }

  async function remove() {
    if (!preview) return;

    setBusy(true);
    setMessage("");

    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      setBusy(false);
      setFailed(true);
      setMessage("Please sign in again.");
      return;
    }

    const path = preview
      .split(`/${BUCKET}/`)[1]
      ?.split("?")[0];

    if (path) {
      const { error } = await supabase.storage
        .from(BUCKET)
        .remove([decodeURIComponent(path)]);

      if (error) {
        setBusy(false);
        setFailed(true);
        setMessage("Photo could not be removed.");
        return;
      }
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        profile_image: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", auth.user.id);

    if (error) {
      setBusy(false);
      setFailed(true);
      setMessage("Profile could not be updated.");
      return;
    }

    setPreview("");
    setBusy(false);
    setFailed(false);
    setMessage("Profile photo removed.");
    router.refresh();
  }

  return (
    <div className="member-photo-row">
      {preview ? (
        <Image
          src={preview}
          alt="Profile photo preview"
          width={120}
          height={120}
          unoptimized
          className="member-photo-preview"
        />
      ) : (
        <div className="member-photo-preview member-photo-fallback">
          {fullName.slice(0, 1).toUpperCase()}
        </div>
      )}

      <div>
        <div className="member-photo-actions">
          <input
            ref={input}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => upload(event.target.files?.[0])}
          />

          <button
            type="button"
            disabled={busy}
            onClick={() => input.current?.click()}
            className="member-button member-button-primary"
          >
            {busy
              ? "Please wait..."
              : preview
                ? "Change photo"
                : "Upload photo"}
          </button>

          {preview && (
            <button
              type="button"
              disabled={busy}
              onClick={remove}
              className="member-button member-button-secondary"
            >
              Remove
            </button>
          )}
        </div>

        <p className="member-card-subtitle">
          JPG, PNG or WebP · Maximum 3 MB
        </p>

        {message && (
          <p
            className={failed ? "member-error" : "member-success"}
            role="status"
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
