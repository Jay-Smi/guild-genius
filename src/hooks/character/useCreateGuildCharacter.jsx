import { useMutation } from "@tanstack/react-query";
import supabase from "../../services/supabase";
import { queryClient } from "../../config";

export default function useCreateGuildCharacter() {
    return useMutation({
        mutationFn: (formData) => insertCharacter(formData),
        onMutate: (newCharacterInfo) => {
            queryClient.setQueryData(["guild-characters"], (oldCharacters) => [
                ...oldCharacters,
                { ...newCharacterInfo },
            ]);
        },
        onSettled: () => {
            queryClient.invalidateQueries(["guild-characters"]);
            queryClient.invalidateQueries(["user-characters"]);
        },
    });
}

async function insertCharacter(formData) {
    const {
        id,
        character_name,
        class: playerClass,
        spec,
        player_id,
        guild_id,
        discord_name,
        guild_rank,
    } = formData;
    const { data, error } = await supabase.from("characters").insert([
        {
            id,
            character_name,
            class: playerClass,
            spec,
            player_id,
            guild_id,
            discord_name,
            guild_rank,
        },
    ]);
    return { data, error };
}
