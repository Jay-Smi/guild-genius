import { useQuery } from "@tanstack/react-query";
import supabase from "../../services/supabase";

export default function useAllUserGuilds(guildIdArray) {
    const enabled = guildIdArray?.length > 0 && guildIdArray[0] !== null;

    const {
        data: userGuilds,
        isLoadingUserGuilds,
        errorUserGuilds,
    } = useQuery({
        queryKey: ["user-guilds"],
        queryFn: () => getAllUserGuilds(guildIdArray),
        enabled,
    });

    return {
        userGuilds,
        isLoadingUserGuilds,
        errorUserGuilds,
    };
}

async function getAllUserGuilds(guildIdArray) {
    const { data, error } = await supabase
        .from("guilds")
        .select()
        .in("id", guildIdArray);
    if (error) throw error;
    return data;
}
