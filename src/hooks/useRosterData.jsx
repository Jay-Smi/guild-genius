import useCategories from "./useCategories";
import useCharacters from "./useCharacters";
import useGroups from "./useGroups";
import usePlayers from "./usePlayers";
import useRaids from "./useRaids";

export default function useRosterData() {
    const {
        categories,
        isLoading: isLoadingCategories,
        error: isCategoriesError,
    } = useCategories();
    const {
        characters,
        isLoading: isLoadingCharacters,
        error: isCharactersError,
    } = useCharacters();
    const {
        raids,
        isLoading: isLoadingRaids,

        error: isRaidsError,
    } = useRaids();
    const {
        groups,
        isLoading: isLoadingGroups,
        error: isGroupsError,
    } = useGroups();
    const {
        players,
        isLoading: isLoadingPlayers,
        error: isPlayersError,
    } = usePlayers();

    return {
        categories,
        characters,
        raids,
        groups,
        players,
        isLoading:
            isLoadingCategories ||
            isLoadingCharacters ||
            isLoadingRaids ||
            isLoadingGroups ||
            isLoadingPlayers,
        error:
            isCategoriesError ||
            isCharactersError ||
            isRaidsError ||
            isGroupsError ||
            isPlayersError,
    };
}
