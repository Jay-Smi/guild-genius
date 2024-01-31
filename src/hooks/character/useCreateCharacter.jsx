import { useMutation } from "@tanstack/react-query";
import supabase from "../../services/supabase";
import { queryClient } from "../../config";

export default function useCreateCharacter() {
    return useMutation({
        mutationFn: (formData) => insertCharacter(formData),
    });
}

async function insertCharacter(formData) {
    const {
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
