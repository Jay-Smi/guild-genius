import { useQuery } from "@tanstack/react-query";
import { getRaids, getRaidsGroups } from "../services/crud/apiRaids";

export default function useRaids() {
    const {
        data: raidGroups,
        error: isRaidsGroupsError,
        isLoading: isLoadingRaidsGroups,
    } = useQuery({
        queryKey: ["raids_groups"],
        queryFn: getRaidsGroups,
        staleTime: Infinity,
        select: (data) => {
            return data.map((raid) => {
                return {
                    id: raid.id,
                    raidGroups: raid.raids_groups.map((raidGroup) => {
                        return raidGroup.group_id;
                    }),
                };
            });
        },
    });
    const {
        data: raids,
        error: isRaidsError,
        isLoading: isLoadingRaids,
    } = useQuery({
        queryKey: ["raids"],
        queryFn: getRaids,
        staleTime: Infinity,
        enabled: !isLoadingRaidsGroups,

        select: (data) => {
            return data.map((raid) => {
                const updated = raidGroups.find(
                    (group) => group.id === raid.id
                );

                return {
                    ...raid,
                    data: updated.raidGroups,
                };
            });
        },
    });

    return {
        raids,
        isLoading: isLoadingRaids || isLoadingRaidsGroups,
        error: isRaidsError || isRaidsGroupsError,
    };
}
