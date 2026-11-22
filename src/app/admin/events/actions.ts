
"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminPermission } from "@/lib/admin";

const eventTypes = [
  "meetup",
  "workshop",
  "school_outreach",
  "community",
  "other",
];

function parseNairaToKobo(value: string): number | null {
  if (!value.trim()) return null;

  const amount = value.trim();

  if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
    return null;
  }

  const [naira, kobo = ""] = amount.split(".");
  const result = Number(naira) * 100 + Number(kobo.padEnd(2, "0"));

  return Number.isSafeInteger(result) ? result : null;
}

export async function createEvent(formData: FormData) {
  const supabase = await requireAdminPermission("events.manage");

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    redirect("/login");
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const eventType = String(formData.get("event_type") ?? "");
  const venue = String(formData.get("venue") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const startsAt = String(formData.get("starts_at") ?? "");
  const endsAt = String(formData.get("ends_at") ?? "");
  const capacityValue = String(formData.get("capacity") ?? "");
  const status = String(formData.get("status") ?? "draft");
  const visibility = String(formData.get("visibility") ?? "members_only");

  const paymentType = String(formData.get("payment_type") ?? "free");
  const ticketPriceValue = String(
    formData.get("ticket_price_naira") ?? ""
  );
  const contributionMinimumValue = String(
    formData.get("contribution_minimum_naira") ?? ""
  );

  if (
    !title ||
    !startsAt ||
    !eventTypes.includes(eventType) ||
    !["draft", "upcoming"].includes(status) ||
    !["members_only", "public", "mixed"].includes(visibility) ||
    !["free", "paid", "optional_contribution"].includes(paymentType)
  ) {
    redirect("/admin/events/new?error=invalid");
  }

  let ticketPriceKobo: number | null = null;
  let contributionMinimumKobo: number | null = null;

  if (paymentType === "paid") {
    ticketPriceKobo = parseNairaToKobo(ticketPriceValue);

    if (ticketPriceKobo === null || ticketPriceKobo <= 0) {
      redirect("/admin/events/new?error=payment");
    }
  }

  if (paymentType === "optional_contribution") {
    if (contributionMinimumValue.trim()) {
      contributionMinimumKobo = parseNairaToKobo(
        contributionMinimumValue
      );

      if (
        contributionMinimumKobo === null ||
        contributionMinimumKobo <= 0
      ) {
        redirect("/admin/events/new?error=payment");
      }
    }
  }

  const startDate = new Date(`${startsAt}:00+01:00`);
  const endDate = endsAt
    ? new Date(`${endsAt}:00+01:00`)
    : null;

  if (
    Number.isNaN(startDate.getTime()) ||
    (endDate && (
      Number.isNaN(endDate.getTime()) ||
      endDate <= startDate
    ))
  ) {
    redirect("/admin/events/new?error=date");
  }

  const capacity = capacityValue ? Number(capacityValue) : null;

  if (
    capacity !== null &&
    (!Number.isInteger(capacity) || capacity < 1)
  ) {
    redirect("/admin/events/new?error=capacity");
  }

  // Validate and upload the optional event cover image.
  const imageEntry = formData.get("cover_image");
  let coverImageUrl: string | null = null;
  let uploadedImagePath: string | null = null;

  if (imageEntry instanceof File && imageEntry.size > 0) {
    const allowedTypes: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    };

    const extension = allowedTypes[imageEntry.type];

    if (!extension || imageEntry.size > 5 * 1024 * 1024) {
      redirect("/admin/events/new?error=image");
    }

    uploadedImagePath = `${userId}/${randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("event-covers")
      .upload(uploadedImagePath, imageEntry, {
        contentType: imageEntry.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Event image upload failed:", uploadError.message);
      redirect("/admin/events/new?error=image");
    }

    const { data: publicUrlData } = supabase.storage
      .from("event-covers")
      .getPublicUrl(uploadedImagePath);

    coverImageUrl = publicUrlData.publicUrl;
  } else if (imageEntry && !(imageEntry instanceof File)) {
    redirect("/admin/events/new?error=image");
  }

  const { error } = await supabase.from("events").insert({
    title,
    description: description || null,
    event_type: eventType,
    venue: venue || null,
    address: address || null,
    starts_at: startDate.toISOString(),
    ends_at: endDate?.toISOString() ?? null,
    capacity,
    status,
    visibility,
    payment_type: paymentType,
    ticket_price_kobo: ticketPriceKobo,
    contribution_minimum_kobo: contributionMinimumKobo,
    currency: "NGN",
    cover_image_url: coverImageUrl,
    created_by: userId,
  });

  if (error) {
    if (uploadedImagePath) {
      await supabase.storage
        .from("event-covers")
        .remove([uploadedImagePath]);
    }

    console.error("Event creation failed:", error.message);
    redirect("/admin/events/new?error=save");
  }

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/member/events");

  redirect("/admin/events?created=1");
}
