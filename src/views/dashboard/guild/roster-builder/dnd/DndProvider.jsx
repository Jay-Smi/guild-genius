import {
    DndContext,
    KeyboardSensor,
    MeasuringStrategy,
    MouseSensor,
    TouchSensor,
    closestCorners,
    rectIntersection,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { useCallback, useContext, useMemo, useState } from "react";
import { RosterContext } from "../store/RosterContextProvider";
import { useStore } from "zustand";
import { coordinateGetter } from "../../../../../utils/helpers";
import { arrayMove } from "@dnd-kit/sortable";
import RosterBuilderActual from "./RosterBuilderActual";
import {
    isHealer,
    isMelee,
    isRanged,
    isTank,
} from "../../../../../utils/wowHelpers";
function DndProvider({ children }) {
    console.log("DndProvider Mount");
    const rosterStore = useContext(RosterContext);
    const activeId = useStore(rosterStore, (state) => state.activeId);
    const selectedTab = useStore(rosterStore, (state) => state.selectedTab);
    const chosenLockouts = useStore(
        rosterStore,
        (state) => state.chosenLockouts
    );
    const setActiveId = useStore(rosterStore, (state) => state.setActiveId);
    const getContainer = useStore(rosterStore, (state) => state.getContainer);
    const getActualContainer = useCallback(
        (id) => {
            return selectedTab === 0
                ? getContainer(id)
                : getContainer(id, chosenLockouts[selectedTab].id);
        },
        [getContainer, selectedTab, chosenLockouts]
    );
    const storeContainers = useStore(rosterStore, (state) => state.containers);
    const setStoreContainers = useStore(
        rosterStore,
        (state) => state.setContainers
    );
    const tabsContainers = useStore(
        rosterStore,
        (state) => state.tabsContainers
    );
    const setTabContainer = useStore(
        rosterStore,
        (state) => state.setTabContainer
    );
    const lockoutsIndex = chosenLockouts[selectedTab].id;
    const containers = useMemo(
        () =>
            selectedTab === 0 ? storeContainers : tabsContainers[lockoutsIndex],
        [selectedTab, storeContainers, tabsContainers, lockoutsIndex]
    );

    const setContainers = useMemo(
        () =>
            selectedTab === 0
                ? setStoreContainers
                : (containers) => setTabContainer(lockoutsIndex, containers),
        [selectedTab, setStoreContainers, setTabContainer, lockoutsIndex]
    );

    const [clonedItems, setClonedItems] = useState(null);
    const activeContainer = activeId ? getActualContainer(activeId) : null;
    console.log("activeContainer", activeContainer);
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter,
        })
    );

    const collisionDetectionStrategy = useCallback(
        (args) => {
            if (
                activeContainer.type === "raid" ||
                activeContainer.type === "category"
            ) {
                return rectIntersection({
                    ...args,
                    droppableContainers: args.droppableContainers.filter(
                        (container) => {
                            return container.id === activeContainer.id
                                ? false
                                : activeContainer.type === "raid"
                                ? getActualContainer(container.id).type ===
                                  "raid"
                                : getActualContainer(container.id).type ===
                                  "category";
                        }
                    ),
                });
            }

            if (activeContainer.type === "group") {
                return closestCorners({
                    ...args,
                    droppableContainers: args.droppableContainers.filter(
                        (container) => {
                            return (
                                getActualContainer(container.id).type ===
                                    "raid" ||
                                getActualContainer(container.id).type ===
                                    "group"
                            );
                        }
                    ),
                });
            }

            if (activeContainer.type === "character") {
                return rectIntersection({
                    ...args,
                    droppableContainers: args.droppableContainers.filter(
                        (container) => {
                            return (
                                getActualContainer(container.id).type ===
                                    "character" ||
                                getActualContainer(container.id).type ===
                                    "group" ||
                                getActualContainer(container.id).type ===
                                    "category"
                            );
                        }
                    ),
                });
            }
        },
        [activeContainer, getActualContainer]
    );
    const findParent = useCallback(
        (id) => {
            return containers?.find((container) =>
                container.data?.includes(id)
            );
        },
        [containers]
    );
    const getIndex = useCallback(
        (id) => {
            const parentContainer = findParent(id);
            return parentContainer.data.indexOf(id);
        },
        [findParent]
    );

    const handleDragCancel = useCallback(() => {
        if (clonedItems) {
            setContainers(clonedItems);
        }

        setActiveId(null);
        setClonedItems(null);
    }, [clonedItems, setContainers, setActiveId]);

    const handleDragEnd = useCallback(
        ({ active, over }) => {
            const overId = over?.id;
            const activeContainer = getActualContainer(active.id);
            const overContainer = getActualContainer(overId);

            if (!over) {
                handleDragCancel();
                return;
            }
            if (!activeContainer) {
                setActiveId(null);
                return;
            }
            if (activeContainer.id === overContainer.id) {
                setActiveId(null);
                return;
            }

            const activeIndex = getIndex(activeContainer.id);
            const overIndex = getIndex(overContainer.id);
            const newContainers = containers.map((container) => {
                if (container.id === findParent(active.id).id) {
                    return {
                        ...container,
                        data: arrayMove(container.data, activeIndex, overIndex),
                    };
                }
                return container;
            });
            setContainers(newContainers);

            setActiveId(null);
        },
        [
            containers,
            getActualContainer,
            getIndex,
            setActiveId,
            setContainers,
            findParent,
            handleDragCancel,
        ]
    );

    const handleDragOver = useCallback(
        ({ active, over }) => {
            const overId = over?.id;
            const activeContainer = getActualContainer(active.id);
            const activeParent = findParent(active.id);
            if (
                overId == null ||
                activeContainer.type === "category" ||
                activeContainer.type === "raid"
            ) {
                return;
            }
            const overContainer = getActualContainer(overId);
            const overParent = findParent(overId);

            if (
                activeContainer.type === "character" ||
                activeContainer.type === "group"
            ) {
                //if dragging inside the same container
                if (
                    activeParent.id === overContainer.id ||
                    overParent.data.includes(active.id)
                ) {
                    return;
                }
                if (activeContainer.type === "group") {
                    if (
                        overContainer.type === "raid" ||
                        overContainer.type === "group"
                    ) {
                        const newContainers = containers.map((container) => {
                            const raidParent =
                                overContainer.type === "group"
                                    ? overParent
                                    : overContainer;
                            if (
                                container.id ===
                                findParent(activeContainer.id).id
                            ) {
                                return {
                                    ...container,
                                    data: container.data.filter(
                                        (item) => item !== active.id
                                    ),
                                };
                            }
                            if (container.id === raidParent.id) {
                                return {
                                    ...container,
                                    data: [...container.data, active.id],
                                };
                            }
                            if (container.id === active.id) {
                                return {
                                    ...container,
                                };
                            }
                            return container;
                        });
                        setContainers(newContainers);
                    }
                }

                if (activeContainer.type === "character") {
                    if (
                        overContainer.type === "category" ||
                        overContainer.type === "group" ||
                        overContainer.type === "character"
                    ) {
                        const overParentContainer =
                            overContainer.type === "character"
                                ? overParent
                                : overContainer;
                        const newContainers = containers.map((container) => {
                            if (container.id === findParent(active.id).id) {
                                return {
                                    ...container,
                                    data: container.data.filter(
                                        (item) => item !== active.id
                                    ),
                                };
                            }
                            if (container.id === overParentContainer.id) {
                                return {
                                    ...container,
                                    data: [...container.data, active.id],
                                };
                            }
                            if (container.id === active.id) {
                                return {
                                    ...container,
                                };
                            }
                            return container;
                        });
                        setContainers(newContainers);
                    }
                }
            }
        },
        [containers, getActualContainer, findParent, setContainers]
    );
    const handleDragStart = useCallback(
        ({ active }) => {
            setActiveId(active.id);
            setClonedItems(containers);
        },
        [setActiveId, containers]
    );

    const handleRemove = useCallback(
        (id) => {
            const cloneContainer = (containerId) => {
                const container = getActualContainer(containerId);
                return container ? { ...container } : null;
            };

            const cloneAndUpdateContainers = (
                originalContainers,
                updatedContainer
            ) => {
                return originalContainers.map((container) =>
                    container.id === updatedContainer.id
                        ? updatedContainer
                        : { ...container }
                );
            };

            let modifiedContainers = [...containers];

            const removedContainer = cloneContainer(id);

            if (removedContainer && removedContainer.data.length > 0) {
                if (removedContainer.type === "group") {
                    removedContainer.data.forEach((characterId) => {
                        const character = cloneContainer(characterId);
                        if (character && character.tags) {
                            const category = modifiedContainers.find(
                                (container) =>
                                    container.name === character.tags[0]
                            );
                            if (category) {
                                const updatedCategory = {
                                    ...category,
                                    data: [...category.data, characterId],
                                };
                                modifiedContainers = cloneAndUpdateContainers(
                                    modifiedContainers,
                                    updatedCategory
                                );
                            }
                        } else {
                            let role = "";
                            if (character && isTank(character)) role = "Tanks";
                            else if (character && isHealer(character))
                                role = "Healers";
                            else if (character && isMelee(character))
                                role = "Melee";
                            else if (character && isRanged(character))
                                role = "Ranged";

                            const category = modifiedContainers.find(
                                (container) => container.name === role
                            );

                            if (category) {
                                const updatedCategory = {
                                    ...category,
                                    data: [...category.data, characterId],
                                };
                                modifiedContainers = cloneAndUpdateContainers(
                                    modifiedContainers,
                                    updatedCategory
                                );
                            }
                        }
                    });
                }
                if (removedContainer.type === "raid") {
                    removedContainer.data.forEach((groupId) => {
                        const group = cloneContainer(groupId);
                        if (group) {
                            group.data.forEach((characterId) => {
                                const character = cloneContainer(characterId);
                                if (character && character.tags) {
                                    const category = modifiedContainers.find(
                                        (container) =>
                                            container.name === character.tags[0]
                                    );
                                    if (category) {
                                        const updatedCategory = {
                                            ...category,
                                            data: [
                                                ...category.data,
                                                characterId,
                                            ],
                                        };
                                        modifiedContainers =
                                            cloneAndUpdateContainers(
                                                modifiedContainers,
                                                updatedCategory
                                            );
                                    }
                                } else {
                                    let role = "";
                                    if (character && isTank(character))
                                        role = "Tanks";
                                    else if (character && isHealer(character))
                                        role = "Healers";
                                    else if (character && isMelee(character))
                                        role = "Melee";
                                    else if (character && isRanged(character))
                                        role = "Ranged";

                                    const category = modifiedContainers.find(
                                        (container) => container.name === role
                                    );

                                    if (category) {
                                        const updatedCategory = {
                                            ...category,
                                            data: [
                                                ...category.data,
                                                characterId,
                                            ],
                                        };
                                        modifiedContainers =
                                            cloneAndUpdateContainers(
                                                modifiedContainers,
                                                updatedCategory
                                            );
                                    }
                                }
                            });
                        }
                    });
                }
            }

            const parentContainerIndex = modifiedContainers.findIndex(
                (container) => container.data?.includes(id)
            );

            if (parentContainerIndex !== -1) {
                const parentContainer = cloneContainer(
                    modifiedContainers[parentContainerIndex].id
                );
                parentContainer.data = parentContainer.data.filter(
                    (item) => item !== id
                );

                modifiedContainers = cloneAndUpdateContainers(
                    modifiedContainers,
                    parentContainer
                );
            }

            const newContainers = modifiedContainers.filter(
                (container) => container.id !== id
            );

            setContainers(newContainers);
        },
        [containers, setContainers, getActualContainer]
    );
    const measuring = useMemo(
        () => ({
            droppable: {
                strategy: MeasuringStrategy.Always,
            },
        }),
        []
    );
    return (
        <DndContext
            sensors={sensors}
            collisionDetection={collisionDetectionStrategy}
            measuring={measuring}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <RosterBuilderActual
                containers={containers}
                handleRemove={handleRemove}
            />
        </DndContext>
    );
}

export default DndProvider;
