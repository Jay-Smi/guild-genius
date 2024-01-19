import { useMutation, useQuery } from "@tanstack/react-query";
import supabase from "../../services/supabase";
import { useSession } from "./useSession";
import { queryClient } from "../../config";

async function getProfileByUserId(userId) {
    const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("user_id", userId);
    if (error) throw error;
    return data;
}

export default function useProfile(userId) {
    const {
        data: profile,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["profile", userId],
        queryFn: () => getProfileByUserId(userId),
    });

    return {
        profile,
        isLoading,
        error,
    };
}

async function insertProfileByUserId(userId, displayName, discordName) {
    const insert = await supabase.from("profiles").insert({
        user_id: userId,
        display_name: displayName,
        discord_name: discordName,
    });

    return insert;
}

export function useInsertProfile(userId, displayName, discordName) {
    const profileMutation = useMutation({
        mutationFn: () =>
            insertProfileByUserId(userId, displayName, discordName),
    });
    return profileMutation;
}
