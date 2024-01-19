import supabase from "../supabase";

export async function getProfileByUserId(userId) {
    return await supabase.from("profiles").select("*").eq("user_id", userId);
}
