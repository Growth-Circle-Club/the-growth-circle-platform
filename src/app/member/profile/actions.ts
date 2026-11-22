"use server";
import { revalidatePath } from "next/cache";
import { requireActiveMember } from "@/lib/member";
export async function updateMemberProfile(formData: FormData) {
  const { supabase,userId } = await requireActiveMember();
  const full_name=String(formData.get("full_name")??"").trim(); const phone=String(formData.get("phone")??"").trim();
  const location=String(formData.get("location")??"").trim(); const bio=String(formData.get("bio")??"").trim();
  if(!full_name || full_name.length>100 || phone.length>40 || location.length>100 || bio.length>600) throw new Error("Please check your profile details and try again.");
  const {error}=await supabase.from("profiles").update({full_name,phone:phone||null,location:location||null,bio:bio||null,updated_at:new Date().toISOString()}).eq("id",userId);
  if(error) throw new Error("Your profile could not be saved. Please try again.");
  revalidatePath("/member"); revalidatePath("/member/profile");
}
