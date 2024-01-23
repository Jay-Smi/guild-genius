import { createStore } from "zustand";

const createRosterStore = ({
    categories,
    characters,
    players,
    characterTags,
}) => {
    return createStore((set, get) => {
        return {
            chosenLockouts: [{ type: "all" }],

            categories,
            characters,
            players,
            characterTags,
            tags: [...new Set(characterTags.map((tag) => tag.tag_name))],

            containers: [
                ...categories,
                ...characters,
                {
                    id: "initialRaid1",
                    type: "raid",
                    data: ["initialGroup1", "initialGroup2"],
                    name: "Raid 1",
                },
                {
                    id: "initialGroup1",
                    type: "group",
                    data: [],
                    name: "Group 1",
                },
                {
                    id: "initialGroup2",
                    type: "group",
                    data: [],
                    name: "Group 2",
                },
                {
                    id: "initialRaid2",
                    type: "raid",
                    data: ["initialGroup3", "initialGroup4"],
                    name: "Raid 2",
                },
                {
                    id: "initialGroup3",
                    type: "group",
                    data: [],
                    name: "Group 3",
                },
                {
                    id: "initialGroup4",
                    type: "group",
                    data: [],
                    name: "Group 4",
                },
                {
                    id: "categoriesContainer",
                    type: "container",
                    data: categories.map((category) => category.id),
                },
                {
                    id: "raidsContainer",
                    type: "container",
                    data: ["initialRaid1", "initialRaid2"],
                },
            ],

            setContainers: (containers) =>
                set((state) => ({
                    ...state,
                    containers: containers,
                })),

            getCharacter: (characterId) =>
                get().characters.find(
                    (character) => character.id === characterId
                ),
            setChosenLockouts: (chosenLockouts) =>
                set((state) => ({
                    ...state,
                    chosenLockouts: chosenLockouts,
                })),
            addContainer: (container) =>
                set((state) => ({
                    ...state,
                    containers: [...state.containers, container],
                })),
        };
    });
};

export default createRosterStore;
