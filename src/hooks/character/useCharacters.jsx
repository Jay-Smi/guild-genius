import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getCharacters,
    getCharactersTags,
} from "../../services/crud/apiCharacters";
import supabase from "../../services/supabase";

async function getCharactersByDiscordName(discordName) {
    const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("discord_name", discordName);

    if (error) throw error;
    return data;
}

export function useCharactersByDiscordName(discordName) {
    const {
        data: characters,
        isLoading: isLoadingCharacters,
        error: errorCharacters,
    } = useQuery({
        queryKey: ["characters", discordName],
        queryFn: () => getCharactersByDiscordName(discordName),
    });

    return {
        characters,
        isLoadingCharacters,
        errorCharacters,
    };
}

export function useAllGuildsCharacters(guildId) {
    const {
        data: guildCharacters,
        isLoadingCharacters,
        errorCharacters,
    } = useQuery({
        queryKey: ["characters", guildId],
        queryFn: () => getAllGuildsCharacters(guildId),
    });

    return {
        guildCharacters,
        isLoadingCharacters,
        errorCharacters,
    };
}

async function getAllGuildsCharacters(guildId) {
    const { data, error } = await supabase
        .from("characters")
        .select()
        .eq("guild_id", guildId);
    if (error) throw error;
    return data;
}

// export default function useCharacters() {
//     const {
//         data: charactersTags,
//         isLoading: isLoadingCharactersTags,
//         error: isErrorCharactersTags,
//     } = useQuery({
//         queryKey: ["characters_tags"],
//         queryFn: getCharactersTags,
//         staleTime: Infinity,
//         placeholderData: [],
//         select: (data) => {
//             return data.map((character) => {
//                 return {
//                     id: character.id,
//                     tags: character.characters_tags.map((tag) => tag.tag_id),
//                 };
//             });
//         },
//     });

//     const {
//         data: characters,
//         isLoading: isLoadingCharacters,
//         error: CharactersError,
//     } = useQuery({
//         queryKey: ["characters"],
//         queryFn: getCharacters,
//         staleTime: Infinity,
//         enabled: !isLoadingCharactersTags,
//         select: (data) => {
//             return data.map((character) => {
//                 const tags = charactersTags.find(
//                     (characterTag) => characterTag.id === character.id
//                 );

//                 return {
//                     ...character,
//                     data: tags.tags,
//                 };
//             });
//         },
//     });

//     return {
//         characters,
//         isLoading: isLoadingCharacters || isLoadingCharactersTags,
//         error: CharactersError || isErrorCharactersTags,
//     };
// }

// export async function getCharacters() {
//     const { data: characters, error } = await supabase
//         .from("characters")
//         .select("*");
//     if (error) {
//         console.error(error);
//         throw new Error("Characters could not be loaded.");
//     }

//     return characters;
// }

// export async function getCharactersTags() {
//     const { data: characters, error } = await supabase.from("characters")
//         .select(`
//     id,
//     characters_tags (
//       tag_id
//     )
//   `);

//     if (error) {
//         console.error(error);
//         throw new Error("Characters Tags could not be loaded.");
//     }

//     return characters;
// }
