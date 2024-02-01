import { useMutation } from "@tanstack/react-query";
import supabase from "../../services/supabase";
import { queryClient } from "../../config";

export default function useCreateGuildPlayer() {
    return useMutation({
        mutationFn: (player) => insertPlayer(player),
        onMutate: (newPlayer) => {
            queryClient.setQueryData(["guild-players"], (oldPlayers) => [
                ...oldPlayers,
                { ...newPlayer },
            ]);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["guild-players"] });
        },
    });
}

async function insertPlayer(player) {
    const { data, error } = await supabase.from("players").insert([player]);
    return { data, error };
}
