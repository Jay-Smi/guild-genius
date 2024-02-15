import { useMutation } from "@tanstack/react-query";
import supabase from "../../services/supabase";
import { queryClient } from "../../config";

export default function useCreateGuildPlayers() {
    return useMutation({
        mutationFn: (players) => insertPlayer(players),
        onMutate: (newPlayers) => {
            queryClient.setQueryData(["guild-players"], (oldPlayers) => [
                ...oldPlayers,
                ...newPlayers,
            ]);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["guild-players"] });
        },
    });
}

async function insertPlayer(players) {
    const { data, error } = await supabase.from("players").insert(players);
    return { data, error };
}
