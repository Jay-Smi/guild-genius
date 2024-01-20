import { useQuery } from "@tanstack/react-query";
import supabase from "../services/supabase";

export function useAllGuildsGroups(guildId) {
    const {
        data: groups,
        error: groupsError,
        isLoading: isLoadingGroups,
    } = useQuery({
        queryKey: ["guilds-groups", guildId],
        queryFn: () => getAllGuildsGroups(guildId),
    });

    return {
        groups,
        groupsError,
        isLoadingGroups,
    };
}

async function getAllGuildsGroups(guildId) {
    const { data, error } = await supabase
        .from("groups")
        .select()
        .eq("guild_id", guildId);
    if (error) throw error;
    return data;
}

export function useAllGuildsGroupCharacters(guildId) {
    const {
        data: guildGroupCharacters,
        error: groupCharactersError,
        isLoading: isLoadingGroupCharacters,
    } = useQuery({
        queryKey: ["guilds-groups-characters", guildId],
        queryFn: () => getAllGuildsGroupCharacters(guildId),
    });

    return {
        guildGroupCharacters,
        groupCharactersError,
        isLoadingGroupCharacters,
    };
}

async function getAllGuildsGroupCharacters(guildId) {
    const { data, error } = await supabase
        .from("group_characters")
        .select()
        .eq("guild_id", guildId);
    if (error) throw error;
    return data;
}

// export default function useGroups() {
//     const {
//         data: groupsCharacters,
//         isLoading: isLoadingGroupsCharacters,
//         error: groupsCharactersError,
//     } = useQuery({
//         queryKey: ["groups_characters"],
//         queryFn: getGroupsCharacters,
//         staleTime: Infinity,
//         select: (data) => {
//             return data.map((group) => {
//                 return {
//                     id: group.id,
//                     groupCharacters: group.groups_characters.map(
//                         (character) => {
//                             return character.character_id;
//                         }
//                     ),
//                 };
//             });
//         },
//     });

//     const {
//         data: groups,
//         isLoading: isLoadingGroups,
//         error: groupsError,
//     } = useQuery({
//         queryKey: ["groups"],
//         queryFn: getGroups,
//         staleTime: Infinity,
//         enabled: !isLoadingGroupsCharacters,

//         select: (data) => {
//             return data.map((group) => {
//                 const groupCharacters = groupsCharacters.find(
//                     (groupCharacter) => groupCharacter.id === group.id
//                 );

//                 return {
//                     ...group,
//                     data: groupCharacters.groupCharacters,
//                 };
//             });
//         },
//     });

//     return {
//         groups,
//         isLoading: isLoadingGroups || isLoadingGroupsCharacters,
//         error: groupsError || groupsCharactersError,
//     };
// }

// export async function getGroups() {
//     const { data: groups, error } = await supabase.from("groups").select("*");
//     if (error) {
//         console.error(error);
//         throw new Error("Groups could not be loaded.");
//     }

//     return groups;
// }

// export async function getGroupsCharacters() {
//     const { data: groups, error } = await supabase.from("groups").select(`
//     id,
//     groups_characters (
//       character_id
//     )
//   `);

//     if (error) {
//         console.error(error);
//         throw new Error("Groups Characters could not be loaded.");
//     }

//     return groups;
// }
