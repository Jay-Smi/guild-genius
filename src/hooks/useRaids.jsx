import { useQuery } from "@tanstack/react-query";
import supabase from "../services/supabase";

export function useAllGuildsRaids(guildId) {
    const {
        data: raids,
        error: raidsError,
        isLoading: isLoadingRaids,
    } = useQuery({
        queryKey: ["guilds-raids", guildId],
        queryFn: () => getAllGuildsRaids(guildId),
    });

    return {
        raids,
        raidsError,
        isLoadingRaids,
    };
}

async function getAllGuildsRaids(guildId) {
    const { data, error } = await supabase
        .from("raids")
        .select()
        .eq("guild_id", guildId);
    if (error) throw error;
    return data;
}

// export default function useRaids() {
//     const {
//         data: raidGroups,
//         error: isRaidsGroupsError,
//         isLoading: isLoadingRaidsGroups,
//     } = useQuery({
//         queryKey: ["raids_groups"],
//         queryFn: getRaidsGroups,
//         staleTime: Infinity,
//         select: (data) => {
//             return data.map((raid) => {
//                 return {
//                     id: raid.id,
//                     raidGroups: raid.raids_groups.map((raidGroup) => {
//                         return raidGroup.group_id;
//                     }),
//                 };
//             });
//         },
//     });
//     const {
//         data: raids,
//         error: isRaidsError,
//         isLoading: isLoadingRaids,
//     } = useQuery({
//         queryKey: ["raids"],
//         queryFn: getRaids,
//         staleTime: Infinity,
//         enabled: !isLoadingRaidsGroups,

//         select: (data) => {
//             return data.map((raid) => {
//                 const updated = raidGroups.find(
//                     (group) => group.id === raid.id
//                 );

//                 return {
//                     ...raid,
//                     data: updated.raidGroups,
//                 };
//             });
//         },
//     });

//     return {
//         raids,
//         isLoading: isLoadingRaids || isLoadingRaidsGroups,
//         error: isRaidsError || isRaidsGroupsError,
//     };
// }

// export async function getRaids() {
//     const { data: characters, error } = await supabase
//         .from("raids")
//         .select("*");
//     if (error) {
//         console.error(error);
//         throw new Error("Raids could not be loaded.");
//     }

//     return characters;
// }

// export async function getRaidsGroups() {
//     const { data: raids, error } = await supabase.from("raids").select(`
//     id,
//     raids_groups (
//       group_id
//     )
//   `);

//     if (error) {
//         console.error(error);
//         throw new Error("Raids Groups could not be loaded.");
//     }

//     return raids;
// }
