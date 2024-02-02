import { useQuery } from "@tanstack/react-query";
import supabase from "../../../services/supabase";

export default function usePlayerAvailability(playerId) {
    return useQuery({
        queryKey: ["player-availability"],
        queryFn: () => getPlayerAvailability(playerId),
    });
}

async function getPlayerAvailability(playerId) {
    const { data, error } = await supabase
        .from("player_availability")
        .select()
        .eq("player_id", playerId);
    if (error) console.error(error);
    return data;
}
