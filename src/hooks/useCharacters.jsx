import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getCharacters,
    getCharactersTags,
} from "../services/crud/apiCharacters";
import supabase from "../services/supabase";

export default function useCharacters() {
    const {
        data: charactersTags,
        isLoading: isLoadingCharactersTags,
        error: isErrorCharactersTags,
    } = useQuery({
        queryKey: ["characters_tags"],
        queryFn: getCharactersTags,
        staleTime: Infinity,
        placeholderData: [],
        select: (data) => {
            return data.map((character) => {
                return {
                    id: character.id,
                    tags: character.characters_tags.map((tag) => tag.tag_id),
                };
            });
        },
    });

    const {
        data: characters,
        isLoading: isLoadingCharacters,
        error: CharactersError,
    } = useQuery({
        queryKey: ["characters"],
        queryFn: getCharacters,
        staleTime: Infinity,
        enabled: !isLoadingCharactersTags,
        select: (data) => {
            return data.map((character) => {
                const tags = charactersTags.find(
                    (characterTag) => characterTag.id === character.id
                );

                return {
                    ...character,
                    data: tags.tags,
                };
            });
        },
    });

    return {
        characters,
        isLoading: isLoadingCharacters || isLoadingCharactersTags,
        error: CharactersError || isErrorCharactersTags,
    };
}

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
        isLoadingCharacters,
        errorCharacters,
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
