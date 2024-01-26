import { useMutation } from "@tanstack/react-query";
import supabase from "../../services/supabase";

export default function useCreateGroups() {
    const mutation = useMutation({
        mutationFn: (groups) => insertRaid(groups),
    });
    return mutation;
}

async function insertRaid(groups) {
    const { data, error } = await supabase.from("groups").insert(groups);
    if (error) {
        console.log(error);
    }
    return { data, error };
}
