import { useMutation } from "@tanstack/react-query";
import supabase from "../../services/supabase";

export default function useCreateRaidTags() {
    const mutation = useMutation({
        mutationFn: (raidTags) => insertRaidTags(raidTags),
    });
    return mutation;
}

async function insertRaidTags(raidTags) {
    const { data, error } = await supabase.from("raid_tags").insert(raidTags);
    if (error) {
        console.log(error);
    }
    return { data, error };
}
