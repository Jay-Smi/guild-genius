import { useMutation } from "@tanstack/react-query";
import supabase from "../../services/supabase";
import { queryClient } from "../../config";

export default function useDeleteGuildInstanceLockouts() {
    const lockoutMutation = useMutation({
        mutationFn: (lockoutId) => deleteGuildInstanceLockouts(lockoutId),
        onSuccess: () => {
            queryClient.invalidateQueries(["guild-instance-lockouts"]);
            queryClient.invalidateQueries(["guild-raids"]);
            queryClient.invalidateQueries(["guild-raids-tags"]);
            queryClient.invalidateQueries(["guild-groups"]);
            queryClient.invalidateQueries(["guild-groups-characters"]);
        },
    });
    return lockoutMutation;
}

async function deleteGuildInstanceLockouts(lockoutId) {
    const { error } = await supabase
        .from("guild_instance_lockouts")
        .delete()
        .eq("id", lockoutId);
    if (error) throw error;
}
