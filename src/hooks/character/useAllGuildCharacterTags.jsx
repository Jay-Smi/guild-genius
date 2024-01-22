import { useQuery } from "@tanstack/react-query";
import supabase from "../../services/supabase";

export default function useAllGuildCharacterTags(guildId) {
    const {
        data: guildCharacterTags,
        isLoading: isLoadingCharacterTags,
        error: errorCharacterTags,
    } = useQuery({
        queryKey: ["character_tags", guildId],
        queryFn: () => getAllGuildsCharacterTags(guildId),
    });

    return {
        guildCharacterTags,
        isLoadingCharacterTags,
        errorCharacterTags,
    };
}

async function getAllGuildsCharacterTags(guildId) {
    const { data, error } = await supabase
        .from("character_tags")
        .select()
        .eq("guild_id", guildId);
    if (error) throw error;
    return data;
}
