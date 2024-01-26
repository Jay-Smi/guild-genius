import { useMutation } from "@tanstack/react-query";
import supabase from "../../services/supabase";

export default function useCreateGroupCharacters() {
    const raidMutation = useMutation({
        mutationFn: (groupCharacters) => insertGroupCharacters(groupCharacters),
    });
    return raidMutation;
}

async function insertGroupCharacters(groupCharacters) {
    const { data, error } = await supabase
        .from("group_characters")
        .insert(groupCharacters);
    if (error) {
        console.log(error);
    }
    return { data, error };
}
