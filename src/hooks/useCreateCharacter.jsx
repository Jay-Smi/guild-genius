import { useMutation } from "@tanstack/react-query";
import supabase from "../services/supabase";

export default function useCreateCharacter() {
    const characterMutation = useMutation({
        mutationFn: (formData) => insertCharacter(formData),
    });
    return characterMutation;
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
