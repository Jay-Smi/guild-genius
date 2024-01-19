import { useQuery } from "@tanstack/react-query";
import supabase from "../services/supabase";

export function useGuildInstanceLockout(startDate, guildId) {
    const {
        data: lockout,
        error: lockoutError,
        isLoading: isLoadingLockout,
    } = useQuery({
        queryKey: ["guild-instance-lockout", startDate, guildId],
        queryFn: () => getLockoutByStartDate(startDate, guildId),
    });

    return {
        lockout,
        lockoutError,
        isLoadingLockout,
    };
}

async function getLockoutByStartDate(startDate, guildId) {
    const { data, error } = await supabase
        .from("guild_instance_lockouts")
        .select()
        .eq("start_date", startDate)
        .eq("guild_id", guildId);
    if (error) throw error;
    return data;
}
