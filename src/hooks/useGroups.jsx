import { useQuery } from "@tanstack/react-query";
import { getGroups, getGroupsCharacters } from "../services/apiGroups";

export default function useGroups() {
    const {
        data: groupsCharacters,
        isLoading: isLoadingGroupsCharacters,
        error: groupsCharactersError,
    } = useQuery({
        queryKey: ["groups_characters"],
        queryFn: getGroupsCharacters,
        staleTime: Infinity,
        select: (data) => {
            return data.map((group) => {
                return {
                    id: group.id,
                    groupCharacters: group.groups_characters.map(
                        (character) => {
                            return character.character_id;
                        }
                    ),
                };
            });
        },
    });

    const {
        data: groups,
        isLoading: isLoadingGroups,
        error: groupsError,
    } = useQuery({
        queryKey: ["groups"],
        queryFn: getGroups,
        staleTime: Infinity,
        enabled: !isLoadingGroupsCharacters,

        select: (data) => {
            return data.map((group) => {
                const groupCharacters = groupsCharacters.find(
                    (groupCharacter) => groupCharacter.id === group.id
                );

                return {
                    ...group,
                    data: groupCharacters.groupCharacters,
                };
            });
        },
    });

    return {
        groups,
        isLoading: isLoadingGroups || isLoadingGroupsCharacters,
        error: groupsError || groupsCharactersError,
    };
}
