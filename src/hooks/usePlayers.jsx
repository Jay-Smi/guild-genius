import { useMutation, useQuery } from "@tanstack/react-query";
import { getPlayers, getPlayersCharacters } from "../services/crud/apiPlayers";
import supabase from "../services/supabase";
import { queryClient } from "../config";

export default function usePlayers() {
    const {
        data: playersCharacters,
        isLoading: isLoadingPlayersCharacters,
        error: playersCharactersError,
    } = useQuery({
        queryKey: ["players_characters"],
        queryFn: getPlayersCharacters,
        staleTime: Infinity,
        select: (data) => {
            return data.map((player) => {
                return {
                    playerId: player.id,
                    playerCharacters: player.players_characters.map(
                        (character) => character.character_id
                    ),
                };
            });
        },
    });

    const {
        data: players,
        isLoading: isLoadingPlayers,
        error: playerError,
    } = useQuery({
        queryKey: ["players"],
        queryFn: getPlayers,
        staleTime: Infinity,
        select: (data) => {
            const updatedPlayers = data.map((player) => {
                const playerCharacters = playersCharacters.find(
                    (playerCharacter) => playerCharacter.playerId === player.id
                );

                return {
                    ...player,
                    data: playerCharacters.playerCharacters,
                };
            });

            return updatedPlayers;
        },
    });

    return {
        players,
        isLoading: isLoadingPlayers || isLoadingPlayersCharacters,
        error: playerError || playersCharactersError,
    };
}

async function getPlayersByDiscordName(discordName) {
    const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("discord_name", discordName);
    if (error) throw error;
    return data;
}

export function usePlayersByDiscordName(discordName) {
    const {
        data: players,
        isLoading: isLoadingPlayers,
        error: playerError,
    } = useQuery({
        queryKey: ["players"],
        queryFn: () => getPlayersByDiscordName(discordName),
    });

    return {
        players,
        isLoading: isLoadingPlayers,
        error: playerError,
    };
}

async function insertPlayer(player) {
    const { data, error } = await supabase.from("players").insert([player]);

    if (error) throw error;
    return data;
}

export function useInsertPlayer() {
    return useMutation({
        mutationFn: (player) => insertPlayer(player),
        onMutate: (newPlayer) => {
            queryClient.setQueryData(["players"], (old) => [...old, newPlayer]);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["players"]);
        },
    });
}
