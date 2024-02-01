import { useMutation } from "@tanstack/react-query";
import supabase from "../../services/supabase";
import { queryClient } from "../../config";

export default function useDeleteGuildCharacterTags() {
    return useMutation({
        mutationFn: (tagsArray) => deleteCharacterTags(tagsArray),
        // onMutate: (tagsArray) => {
        //     queryClient.setQueryData(["guild-character-tags"], (oldTags) => {
        //         const newTags = oldTags.filter(
        //             (tag) => !tagsArray.includes(tag.tag_id)
        //         );
        //         return newTags;
        //     });
        // },
        onSettled: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return (
                        query.queryKey[0] === "guild-character-tags" ||
                        query.queryKey[0] === "guild-characters" ||
                        query.queryKey[0] === "guild-players"
                    );
                },
            });
        },
    });
}

async function deleteCharacterTags(tagsArray) {
    const { data, error } = await supabase
        .from("character_tags")
        .delete()
        .in("id", tagsArray);
    return { data, error };
}
