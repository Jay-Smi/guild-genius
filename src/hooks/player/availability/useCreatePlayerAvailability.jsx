import { useMutation } from "@tanstack/react-query";
import supabase from "../../../services/supabase";
import { queryClient } from "../../../config";

export default function useCreatePlayerAvailability() {
    return useMutation({
        mutationFn: (playerAvailability) =>
            insertPlayerAvailability(playerAvailability),
        onMutate: (newPlayerAvailability) => {
            queryClient.setQueryData(
                ["player-availability"],
                (oldPlayerAvailability) => [
                    ...oldPlayerAvailability,
                    { ...newPlayerAvailability },
                ]
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["player-availability"],
            });
        },
    });
}

async function insertPlayerAvailability(playerAvailability) {
    const { data, error } = await supabase
        .from("player_availability")
        .insert([playerAvailability]);

    if (error) console.error(error);
    return data;
}
