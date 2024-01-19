import useProfile from "./auth/useProfile";
import { useCharactersByDiscordName } from "./useCharacters";
import { usePlayersByDiscordName } from "./usePlayers";

export default function useUserInfo(userId, discordName) {
    const { profile, isLoading, error } = useProfile(userId);
    const { characters, isLoadingCharacters, errorCharacters } =
        useCharactersByDiscordName(discordName);
    const { players, isLoadingPlayers, errorPlayers } =
        usePlayersByDiscordName(discordName);

    const isLoadingAny = isLoading || isLoadingCharacters || isLoadingPlayers;
    const isErrorAny = error || errorCharacters || errorPlayers;

    return {
        profile,
        characters,
        players,
        isLoading: isLoadingAny,
        error: isErrorAny,
    };
}
