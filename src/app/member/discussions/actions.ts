"use server";
import { revalidatePath } from "next/cache";
import { requireActiveMember } from "@/lib/member";
export async function submitDiscussionContribution(formData:FormData){const {supabase,userId,profile}=await requireActiveMember();const sessionId=String(formData.get("reading_session_id")??"");const topic=String(formData.get("topic")??"").trim();const contribution=String(formData.get("contribution")??"").trim();
  if(!sessionId||!topic||!contribution||topic.length>160||contribution.length>3000)throw new Error("Please complete the form and keep within the stated limits.");
  const {error}=await supabase.from("reading_discussions").insert({reading_session_id:sessionId,user_id:userId,display_name:profile.full_name,topic,contribution,is_published:false});
  if(error)throw new Error("Your contribution could not be submitted. Please try again.");revalidatePath("/member/discussions");}
