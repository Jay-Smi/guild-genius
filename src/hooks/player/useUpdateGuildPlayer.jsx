import { useMutation } from "@tanstack/react-query";
import supabase from "../../services/supabase";
import { queryClient } from "../../config";

export default function useUpdateGuildPlayer() {
    return useMutation({
        mutationFn: (player) => updateGuildPlayer(player),
        onMutate: (player) => {
            queryClient.setQueryData(["guild-players"], (old) => {
                return old.map((p) => (p.id === player.id ? player : p));
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["guild-players"] });
        },
    });
}

async function updateGuildPlayer(player) {
    const { data, error } = await supabase
        .from("players")
        .update(player)
        .eq("id", player.id);

    if (error) console.error(error);
    return data;
}
