import { useQuery } from "@tanstack/react-query";
import supabase from "../../../services/supabase";

export default function useGuildAvailability(guildId) {
    return useQuery({
        queryKey: ["guild-availability"],
        queryFn: () => getGuildAvailability(guildId),
    });
}

async function getGuildAvailability(guildId) {
    const { data, error } = await supabase
        .from("player_availability")
        .select()
        .eq("guild_id", guildId);
    if (error) console.error(error);
    return data;
}
