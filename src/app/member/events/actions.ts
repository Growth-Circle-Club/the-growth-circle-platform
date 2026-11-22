"use server";
import { revalidatePath } from "next/cache";
import { requireActiveMember } from "@/lib/member";
export async function registerForMemberEvent(eventId:string){const {supabase,userId}=await requireActiveMember();
  const {data:existing}=await supabase.from("event_registrations").select("id,attendance_status").eq("event_id",eventId).eq("profile_id",userId).maybeSingle();
  if(existing){revalidatePath("/member/events");return;}
  const {error}=await supabase.from("event_registrations").insert({event_id:eventId,profile_id:userId,attendance_status:"registered"});
  if(error)throw new Error("We could not register you for this event. Please try again.");
  revalidatePath("/member/events");}
