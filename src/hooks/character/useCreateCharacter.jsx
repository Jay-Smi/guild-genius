import { useMutation } from "@tanstack/react-query";
import supabase from "../../services/supabase";
//group_characters
//groups
//guild_instance_lockouts
//raid_tags
//raids

//invalidate
//"guilds-groups","cf4d9cea-8722-433d-93df-2f636dc7784c"
//"guilds-raids","cf4d9cea-8722-433d-93df-2f636dc7784c"
//"guilds-groups-characters","cf4d9cea-8722-433d-93df-2f636dc7784c"
//"guild-instance-lockouts","cf4d9cea-8722-433d-93df-2f636dc7784c"

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
