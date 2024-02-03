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
        queryKey: ["profile"],
        queryFn: () => getProfileByUserId(userId),
    });

    return {
        profile,
        isLoading,
        error,
    };
}

async function insertProfileByUserId(newProfile) {
    const insert = await supabase.from("profiles").insert([newProfile]);

    return insert;
}

export function useInsertProfile() {
    const profileMutation = useMutation({
        mutationFn: (newProfile) => insertProfileByUserId(newProfile),
        onMutate: (newProfile) => {
            queryClient.setQueryData(["profile"], () => [newProfile]);
        },
        onSettled: () => queryClient.invalidateQueries(["profile"]),
    });
    return profileMutation;
}
