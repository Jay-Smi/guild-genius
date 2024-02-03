import { useMutation } from "@tanstack/react-query";
import supabase from "../../services/supabase";
import { queryClient } from "../../config";

export default function useUpdateOwnPlayer() {
    return useMutation({
        mutationFn: (player) => updateOwnPlayer(player),
        onMutate: (player) => {
            queryClient.setQueryData(["players"], () => [player]);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["players"] });
        },
    });
}

async function updateOwnPlayer(player) {
    const { data, error } = await supabase
        .from("players")
        .update(player)
        .eq("id", player.id);

    if (error) console.error(error);
    return data;
}
