import { useQuery } from "@tanstack/react-query";
import useProfile from "./auth/useProfile";
import { useCharactersByDiscordName } from "./character/useCharacters";
import { usePlayersByDiscordName } from "./usePlayers";
import supabase from "../services/supabase";
import { useStore } from "../store";

export default function useGuild(guildId, enabled = false) {
    const {
        data: guild,
        isLoadingGuild,
        errorGuild,
    } = useQuery({
        queryKey: ["guild", guildId],
        queryFn: () => getGuildById(guildId),
        enabled: enabled,
    });

    return {
        guild,
        isLoadingGuild,
        errorGuild,
    };
}

async function getGuildById(guildId) {
    const { data, error } = await supabase
        .from("guilds")
        .select("*")
        .eq("id", guildId);
    if (error) throw error;
    return data;
}
