import { getURL } from "../getURL";
import supabase from "../supabase";

export async function signInWithDiscord() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
    });
    console.log(data, error);
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
}

export async function getUser() {
    const {
        data: { user },
    } = supabase.auth.getUser();
    return user;
}

export async function getSession() {
    const session = supabase.auth.getSession();
    return session;
}
