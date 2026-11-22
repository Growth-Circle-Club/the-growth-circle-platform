
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function EventImageUpload() {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#35483D]">
        Event Cover Image
      </label>

      <input
        type="file"
        name="cover_image"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            setPreview(URL.createObjectURL(file));
          } else {
            setPreview(null);
          }
        }}
        className="w-full rounded-lg border border-[#E2E4DC] bg-white px-4 py-3 text-sm"
      />

      <p className="mt-2 text-xs text-[#758078]">
        Upload a JPG, PNG or WebP image. Maximum size: 5 MB.
      </p>

      {preview && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-[#35483D]">
            Image Preview
          </p>
          <Image
            src={preview}
            alt="Event cover preview"
            width={1200}
            height={600}
            unoptimized
            className="h-48 w-full rounded-xl border border-[#E2E4DC] object-cover"
          />
        </div>
      )}
    </div>
  );
}
