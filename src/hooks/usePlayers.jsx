import { useQuery } from "@tanstack/react-query";
import { getPlayers, getPlayersCharacters } from "../services/apiPlayers";

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
