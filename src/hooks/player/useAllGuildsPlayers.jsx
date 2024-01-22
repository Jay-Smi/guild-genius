import { useQuery } from "@tanstack/react-query";
import supabase from "../../services/supabase";

export default function useAllGuildsPlayers(guildId) {
    const {
        data: guildPlayers,
        isLoadingPlayers,
        errorPlayers,
    } = useQuery({
        queryKey: ["players", guildId],
        queryFn: () => getAllGuildsPlayers(guildId),
    });

    return {
        guildPlayers,
        isLoadingPlayers,
        errorPlayers,
    };
}

async function getAllGuildsPlayers(guildId) {
    const { data, error } = await supabase
        .from("players")
        .select()
        .eq("guild_id", guildId);
    if (error) throw error;
    return data;
}
