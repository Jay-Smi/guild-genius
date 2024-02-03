import { useMutation } from "@tanstack/react-query";
import supabase from "../../../services/supabase";
import { queryClient } from "../../../config";

export default function useDeletePlayerAvailability() {
    return useMutation({
        mutationFn: (playerAvailabilityId) =>
            deletePlayerAvailability(playerAvailabilityId),
        onMutate: (playerAvailabilityId) => {
            queryClient.setQueryData(
                ["player-availability"],
                (oldPlayerAvailability) =>
                    oldPlayerAvailability.filter(
                        (availability) =>
                            availability.id !== playerAvailabilityId
                    )
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["player-availability"],
            });
        },
    });
}

async function deletePlayerAvailability(playerAvailabilityId) {
    const { data, error } = await supabase
        .from("player_availability")
        .delete()
        .eq("id", playerAvailabilityId);

    if (error) console.error(error);
    return data;
}
