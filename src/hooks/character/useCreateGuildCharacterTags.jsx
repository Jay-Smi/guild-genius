import { useMutation } from "@tanstack/react-query";
import supabase from "../../services/supabase";
import { queryClient } from "../../config";

export default function useCreateGuildCharacterTags() {
    return useMutation({
        mutationFn: (tagsArray) => insertCharacterTags(tagsArray),
        onMutate: (newTags) => {
            queryClient.setQueryData(["guild-character-tags"], (oldTags) => {
                console.log("oldTags", oldTags);
                // return [...oldTags, ...newTags];
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["guild-character-tags"],
            });
        },
    });
}

async function insertCharacterTags(tagsArray) {
    console.log("tagsArray", tagsArray);
    const { data, error } = await supabase
        .from("character_tags")
        .insert(tagsArray);
    return { data, error };
}
