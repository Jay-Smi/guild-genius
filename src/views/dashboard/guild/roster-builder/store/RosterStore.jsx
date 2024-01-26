import { createStore, useStore } from "zustand";
import { RosterContext } from "./RosterContextProvider";
import { useContext } from "react";
import { persist, createJSONStorage } from "zustand/middleware";

const initialIds = [
    crypto.randomUUID(),
    crypto.randomUUID(),
    crypto.randomUUID(),
];

const createRosterStore = ({
    categories,
    characters,
    players,
    characterTags,
}) => {
    return createStore(
        persist(
            (set, get) => {
                return {
                    chosenLockouts: [{ type: "all" }],
                    hasAlteredTabContainer: false,
                    hasAcknowledgedAlteredTabContainer: false,
                    selectedTab: 0,
                    selectedInstance: "",
                    categories,
                    characters,
                    players,
                    characterTags,
                    tags: [
                        ...new Set(characterTags.map((tag) => tag.tag_name)),
                    ],
                    tabsContainers: {},
                    containers: [
                        ...categories,
                        ...characters,
                        {
                            id: initialIds[0],
                            type: "raid",
                            data: [initialIds[1], initialIds[2]],
                            name: "Raid 1",
                        },
                        {
                            id: initialIds[1],
                            type: "group",
                            data: [],
                            name: "Group 1",
                        },
                        {
                            id: initialIds[2],
                            type: "group",
                            data: [],
                            name: "Group 2",
                        },

                        {
                            id: "categoriesContainer",
                            type: "container",
                            data: categories.map((category) => category.id),
                        },
                        {
                            id: "raidsContainer",
                            type: "container",
                            data: [initialIds[0]],
                        },
                    ],

                    setSelectedInstance: (selectedInstance) => {
                        set((state) => ({ ...state, selectedInstance }));
                    },

                    setHasAcknowledgedAlteredTabContainer: (
                        hasAcknowledged
                    ) => {
                        set((state) => ({
                            ...state,
                            hasAcknowledgedAlteredTabContainer: hasAcknowledged,
                        }));
                    },

                    setSelectedTab: (selectedTab) =>
                        set((state) => ({ ...state, selectedTab })),

                    createTabsContainer: (tab) =>
                        set((state) => ({
                            ...state,
                            tabsContainers: {
                                ...state.tabsContainers,
                                [tab]: [...get().containers],
                            },
                        })),
                    setTabContainer: (tab, container) => {
                        // console.log("tab", tab);
                        // console.log("container", container);

                        set((state) => ({
                            ...state,
                            tabsContainers: {
                                ...state.tabsContainers,
                                [tab]: container,
                            },
                            hasAlteredTabContainer: true,
                        }));
                    },
                    removeTabContainer: (tab) => {
                        const newTabsContainers = { ...get().tabsContainers };
                        delete newTabsContainers[tab];
                        set((state) => ({
                            ...state,
                            tabsContainers: newTabsContainers,
                        }));
                    },
                    setContainers: (containers) => {
                        const newTabsContainers = {};
                        Object.keys(get().tabsContainers).forEach((tab) => {
                            newTabsContainers[tab] = containers;
                        });
                        set((state) => ({
                            ...state,
                            containers: containers,
                            tabsContainers: newTabsContainers,
                        }));
                    },

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
            },
            {
                name: "roster-builder",
            }
        )
    );
};

export default createRosterStore;

export function useTabsContainers() {
    const rosterContext = useContext(RosterContext);
    return useStore(rosterContext);
}
