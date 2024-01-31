import { queryClient } from "../../config";
import { useMutation } from "@tanstack/react-query";
import supabase from "../../services/supabase";

export default function useDeleteGuildCharacter() {
    return useMutation({
        mutationFn: (characterId) => deleteCharacter(characterId),
        onMutate: (characterId) => {
            queryClient.setQueryData(["guild-characters"], (oldData) => {
                const newCharacters = oldData.filter(
                    (character) => character.id !== characterId
                );
                return newCharacters;
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["guild-characters"] });
        },
    });
}

async function deleteCharacter(characterId) {
    const { data, error } = await supabase
        .from("characters")
        .delete()
        .eq("id", characterId);
    return { data, error };
}
