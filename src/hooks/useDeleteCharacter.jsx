import { useMutation } from "@tanstack/react-query";
import supabase from "../services/supabase";
import { queryClient } from "../config";

export default function useDeleteCharacter(discordName) {
    const characterMutation = useMutation({
        mutationFn: (characterId) => deleteCharacter(characterId),
        onSuccess: () => {
            queryClient.invalidateQueries(["characters", discordName]);
        },
    });
    return characterMutation;
}

async function deleteCharacter(characterId) {
    const { data, error } = await supabase
        .from("characters")
        .delete()
        .eq("id", characterId);
    return { data, error };
}
