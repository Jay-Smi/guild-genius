import { useQuery } from "@tanstack/react-query";
import supabase from "../services/supabase";

export function useAllGuildsRaids(guildId) {
    const {
        data: raids,
        error: raidsError,
        isLoading: isLoadingRaids,
    } = useQuery({
        queryKey: ["guilds-raids"],
        queryFn: () => getAllGuildsRaids(guildId),
        enabled: !!guildId,
    });

    return {
        raids,
        raidsError,
        isLoadingRaids,
    };
}

async function getAllGuildsRaids(guildId) {
    const { data, error } = await supabase
        .from("raids")
        .select()
        .eq("guild_id", guildId);
    if (error) throw error;
    return data;
}
