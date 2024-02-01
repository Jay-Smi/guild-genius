import { useMutation } from "@tanstack/react-query";
import supabase from "../../services/supabase";
import { queryClient } from "../../config";

export default function useDeleteGuildPlayer() {
    return useMutation({
        mutationFn: (playerId) => deletePlayer(playerId),
        // onMutate: (playerId) => {
        //     queryClient.setQueriesData(["guild-players"], (oldPlayers) => {
        //         const newPlayers = oldPlayers.filter(
        //             (player) => player.id !== playerId
        //         );
        //         return newPlayers;
        //     });
        // },
        onSettled: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return (
                        query.queryKey[0] === "guild-players" ||
                        query.queryKey[0] === "guild-characters" ||
                        query.queryKey[0] === "guild-character-tags"
                    );
                },
            });
        },
    });
}

async function deletePlayer(playerId) {
    const { data, error } = await supabase
        .from("players")
        .delete()
        .eq("id", playerId);
    return { data, error };
}
