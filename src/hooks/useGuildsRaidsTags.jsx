import { useQuery } from "@tanstack/react-query";
import supabase from "../services/supabase";

export function useAllGuildsRaidsTags(guildId) {
    const {
        data: raidsTags,
        error: raidsTagsError,
        isLoading: isLoadingRaidsTags,
    } = useQuery({
        queryKey: ["guilds-raids-tags"],
        queryFn: () => getAllGuildsRaidsTags(guildId),
        enabled: !!guildId,
    });

    return {
        raidsTags,
        raidsTagsError,
        isLoadingRaidsTags,
    };
}

async function getAllGuildsRaidsTags(guildId) {
    const { data, error } = await supabase
        .from("raid_tags")
        .select()
        .eq("guild_id", guildId);
    if (error) throw error;
    return data;
}
