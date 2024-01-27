import {
    DndContext,
    DragOverlay,
    KeyboardSensor,
    MeasuringStrategy,
    MouseSensor,
    TouchSensor,
    closestCenter,
    closestCorners,
    pointerWithin,
    rectIntersection,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    // arrayMove,
    verticalListSortingStrategy,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";

import Container from "../components/Container/Container";
import DroppableContainer from "../components/DroppableContainer";
import { Item } from "../components/Item/Item";
import SortableItem from "../components/SortableItem";
import { coordinateGetter as multipleContainersCoordinateGetter } from "../../../../../utils/helpers";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Box, Grid, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@emotion/react";
import { create, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { RosterContext } from "../store/RosterContextProvider";
import { FixedSizeList as List } from "react-window";
import {
    isHealer,
    isMelee,
    isRanged,
    isTank,
} from "../../../../../utils/wowHelpers";
// roster lockout-1 default tanks/healers/melee/ranged, characters filtered in by associated tag,
// create custom lockout-1 with any tag, ex. kicks, dispells, etc.

export default function RosterBuilderActual({
    adjustScale = false,
    cancelDrop,
    coordinateGetter = multipleContainersCoordinateGetter,
    getItemStyles = () => ({}),
    wrapperStyle = () => ({}),
    modifiers,
    renderItem,
    strategy = rectSortingStrategy,
    categories: initialCategories,
    characters: initialCharacters,
    players,
}) {
    const rosterStore = useContext(RosterContext);
    const storeContainers = useStore(rosterStore, (state) => state.containers);
    const setStoreContainers = useStore(
        rosterStore,
        (state) => state.setContainers
    );
    const selectedTab = useStore(rosterStore, (state) => state.selectedTab);
    const chosenLockouts = useStore(
        rosterStore,
        (state) => state.chosenLockouts
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
    const containers =
        selectedTab === 0 ? storeContainers : tabsContainers[lockoutsIndex];

    const setContainers = useMemo(
        () =>
            selectedTab === 0
                ? setStoreContainers
                : (containers) => setTabContainer(lockoutsIndex, containers),
        [selectedTab, setStoreContainers, setTabContainer, lockoutsIndex]
    );

    const [activePlayer, setActivePlayer] = useState(null);
    const [activeCharacter, setActiveCharacter] = useState(null);
    const [activeId, setActiveId] = useState(null);
    const lastOverId = useRef(null);
    const recentlyMovedToNewContainer = useRef(false);
    const [clonedItems, setClonedItems] = useState(null);
    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter,
        })
    );

    useEffect(() => {
        requestAnimationFrame(() => {
            recentlyMovedToNewContainer.current = false;
        });
    }, [containers]);

    const findContainer = useCallback(
        (id) => {
            return containers.find((obj) => obj.id === id);
        },
        [containers]
    );

    const handleRemove = useCallback(
        (id) => {
            const cloneContainer = (containerId) => {
                const container = findContainer(containerId);
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
        [containers, findContainer, setContainers]
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

    const collisionDetectionStrategy = useCallback(
        (args) => {
            const activeContainer = activeId ? findContainer(activeId) : null;

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
                                ? findContainer(container.id).type === "raid"
                                : findContainer(container.id).type ===
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
                                findContainer(container.id).type === "raid" ||
                                findContainer(container.id).type === "group"
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
                                findContainer(container.id).type ===
                                    "character" ||
                                findContainer(container.id).type === "group" ||
                                findContainer(container.id).type === "category"
                            );
                        }
                    ),
                });
            }

            // const pointerIntersections = pointerWithin(args);
            // const intersections =
            //     pointerIntersections.length > 0
            //         ? pointerIntersections
            //         : rectIntersection(args);
            // let overId = getFirstCollision(intersections, "id");
            // let overContainer = findContainer(overId);
            // //if dragging character over a container
            // if (overId != null) {
            //     if (
            //         overContainer.type === "category" ||
            //         overContainer.type === "group"
            //     ) {
            //         if (overContainer.data?.length > 0) {
            //             overId = closestCenter({
            //                 ...args,
            //                 droppableContainers:
            //                     args.droppableContainers.filter((container) => {
            //                         const currentContainer = findContainer(
            //                             container.id
            //                         );
            //                         return (
            //                             currentContainer.type === "category" ||
            //                             currentContainer.type === "group"
            //                         );
            //                     }),
            //             })[0]?.id;
            //         }
            //     }
            //     lastOverId.current = overId;
            //     return [{ id: overId }];
            // }
            // if (recentlyMovedToNewContainer.current) {
            //     lastOverId.current = activeId;
            // }
            // return lastOverId.current ? [{ id: lastOverId.current }] : [];
        },
        [activeId, findContainer]
    );

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={collisionDetectionStrategy}
            measuring={{
                droppable: {
                    strategy: MeasuringStrategy.Always,
                },
            }}
            onDragStart={({ active }) => {
                setActiveId(active.id);
                setClonedItems(containers);
                if (isACharacter(active.id)) {
                    setActiveCharacter(active.id);
                }
            }}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            modifiers={modifiers}
        >
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: matchDownMd ? "1fr" : "auto 1fr",
                    gridTemplateRows: matchDownMd ? "0.9fr 1.1fr" : "1fr",
                    height: "calc(100vh - 200px)",
                    overflow: "hidden",
                    backgroundColor:
                        theme.palette.mode === "dark"
                            ? theme.palette.background.dark3
                            : theme.palette.grey[100],
                }}
            >
                <PerfectScrollbar
                    component="div"
                    style={{
                        paddingLeft: "16px",
                        paddingRight: "16px",
                        paddingBottom: "100px",
                    }}
                >
                    <SortableContext
                        items={findContainer("categoriesContainer").data}
                        strategy={strategy}
                    >
                        <Stack
                            spacing={2}
                            direction={matchDownMd ? "row" : "column"}
                        >
                            {findContainer("categoriesContainer").data.map(
                                (categoryId) => {
                                    const currentContainer =
                                        findContainer(categoryId);

                                    return (
                                        <DroppableContainer
                                            key={currentContainer.id}
                                            id={currentContainer.id}
                                            label={currentContainer.name}
                                            items={currentContainer.data}
                                            type={currentContainer.type}
                                        >
                                            <SortableContext
                                                items={currentContainer.data}
                                                strategy={strategy}
                                            >
                                                {currentContainer.data.map(
                                                    (characterId) => {
                                                        const currentCharacter =
                                                            findContainer(
                                                                characterId
                                                            );

                                                        return (
                                                            <SortableItem
                                                                key={
                                                                    currentCharacter.id
                                                                }
                                                                id={
                                                                    currentCharacter.id
                                                                }
                                                                renderItem={
                                                                    renderItem
                                                                }
                                                                containerId={
                                                                    currentContainer.id
                                                                }
                                                                getIndex={
                                                                    getIndex
                                                                }
                                                                characterId={
                                                                    currentCharacter.id
                                                                }
                                                                activeCharacterId={
                                                                    activeCharacter
                                                                }
                                                            />
                                                        );
                                                    }
                                                )}
                                            </SortableContext>
                                        </DroppableContainer>
                                    );
                                }
                            )}
                        </Stack>
                    </SortableContext>
                </PerfectScrollbar>
                <PerfectScrollbar
                    component="div"
                    style={{
                        paddingLeft: "16px",
                        paddingRight: "16px",
                        paddingBottom: "100px",
                    }}
                >
                    <Grid spacing={2} container>
                        {/* //Sortable Raids */}

                        <SortableContext
                            items={findContainer("raidsContainer").data}
                            strategy={strategy}
                        >
                            {findContainer("raidsContainer").data.map(
                                (raidId) => {
                                    const currentRaid = findContainer(raidId);
                                    return (
                                        <Grid
                                            item
                                            key={currentRaid.id}
                                            sx={{
                                                justifyContent: "center",
                                                alignItems: "center",
                                                height: "auto",
                                            }}
                                        >
                                            <DroppableContainer
                                                id={currentRaid.id}
                                                label={currentRaid.name}
                                                items={currentRaid.data}
                                                onRemove={() =>
                                                    handleRemove(currentRaid.id)
                                                }
                                                type={currentRaid.type}
                                            >
                                                <SortableContext
                                                    items={currentRaid.data}
                                                    strategy={strategy}
                                                >
                                                    {currentRaid.data.map(
                                                        (groupId) => {
                                                            const currentGroup =
                                                                findContainer(
                                                                    groupId
                                                                );

                                                            return (
                                                                <DroppableContainer
                                                                    key={
                                                                        currentGroup.id
                                                                    }
                                                                    id={
                                                                        currentGroup.id
                                                                    }
                                                                    label={
                                                                        currentGroup.name
                                                                    }
                                                                    items={
                                                                        currentGroup.data
                                                                    }
                                                                    onRemove={() =>
                                                                        handleRemove(
                                                                            currentGroup.id
                                                                        )
                                                                    }
                                                                    type={
                                                                        currentGroup.type
                                                                    }
                                                                >
                                                                    <SortableContext
                                                                        items={
                                                                            currentGroup?.data
                                                                        }
                                                                        strategy={
                                                                            strategy
                                                                        }
                                                                    >
                                                                        {currentGroup?.data.map(
                                                                            (
                                                                                characterId
                                                                            ) => {
                                                                                const currentCharacter =
                                                                                    findContainer(
                                                                                        characterId
                                                                                    );
                                                                                return (
                                                                                    <SortableItem
                                                                                        key={
                                                                                            currentCharacter?.id
                                                                                        }
                                                                                        id={
                                                                                            currentCharacter?.id
                                                                                        }
                                                                                        style={
                                                                                            getItemStyles
                                                                                        }
                                                                                        wrapperStyle={
                                                                                            wrapperStyle
                                                                                        }
                                                                                        renderItem={
                                                                                            renderItem
                                                                                        }
                                                                                        containerId={
                                                                                            groupId
                                                                                        }
                                                                                        getIndex={
                                                                                            getIndex
                                                                                        }
                                                                                        characterId={
                                                                                            currentCharacter.id
                                                                                        }
                                                                                        activeCharacterId={
                                                                                            activeCharacter
                                                                                        }
                                                                                    />
                                                                                );
                                                                            }
                                                                        )}
                                                                    </SortableContext>
                                                                </DroppableContainer>
                                                            );
                                                        }
                                                    )}
                                                </SortableContext>
                                            </DroppableContainer>
                                        </Grid>
                                    );
                                }
                            )}
                        </SortableContext>
                    </Grid>
                </PerfectScrollbar>
            </Box>
            {createPortal(
                <DragOverlay adjustScale={adjustScale}>
                    {activeId
                        ? isACharacter(activeId)
                            ? renderSortableItemDragOverlay(activeId)
                            : renderContainerDragOverlay(activeId)
                        : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );

    function findPlayer(id) {
        return players.find((player) => player.id === id);
    }

    function isACharacter(id) {
        return findContainer(id).type === "character";
    }

    function handleDragEnd({ active, over }) {
        const overId = over?.id;
        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(overId);

        if (!over) {
            handleDragCancel();
            return;
        }
        if (!activeContainer) {
            setActiveCharacter(null);

            setActiveId(null);
            return;
        }
        if (activeContainer.id === overContainer.id) {
            setActiveCharacter(null);

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

        setActiveCharacter(null);

        setActiveId(null);
    }

    function handleDragOver({ active, over }) {
        const overId = over?.id;
        const activeContainer = findContainer(active.id);
        const activeParent = findParent(active.id);
        if (
            overId == null ||
            activeContainer.type === "category" ||
            activeContainer.type === "raid"
        ) {
            return;
        }
        const overContainer = findContainer(overId);
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
                            container.id === findParent(activeContainer.id).id
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
    }

    function handleDragCancel() {
        if (clonedItems) {
            setContainers(clonedItems);
        }

        setActiveCharacter(null);
        setActiveId(null);
        setClonedItems(null);
    }

    function renderSortableItemDragOverlay(id) {
        return (
            <Item
                value={id}
                style={getItemStyles({
                    containerId: findContainer(id),
                    overIndex: -1,

                    value: id,
                    isSorting: true,
                    isDragging: true,
                    isDragOverlay: true,
                })}
                wrapperStyle={wrapperStyle({ index: 0 })}
                renderItem={renderItem}
                dragOverlay={true}
                characterId={id}
                activeCharacter={activeCharacter?.id || null}
            />
        );
    }

    function renderContainerDragOverlay(containerId) {
        const currentContainer = findContainer(containerId);
        return (
            <Container
                label={currentContainer.name}
                shadow
                onRemove={() => {}}
                type={currentContainer.type}
                overlay={"overlay"}
                id={containerId}
            >
                {currentContainer.type === "category"
                    ? currentContainer.data.map((item, index) => {
                          const currentItem = findContainer(item);
                          return (
                              <Item
                                  key={currentItem.id}
                                  value={currentItem.id}
                                  style={getItemStyles({
                                      containerId,
                                      overIndex: -1,

                                      value: currentItem.id,
                                      isDragging: false,
                                      isSorting: false,
                                      isDragOverlay: false,
                                  })}
                                  wrapperStyle={wrapperStyle({ index })}
                                  renderItem={renderItem}
                                  characterId={currentItem.id}
                                  activeCharacterId={activeCharacter}
                              />
                          );
                      })
                    : currentContainer.type === "raid"
                    ? currentContainer.data.map((group) => {
                          const currentGroup = findContainer(group);
                          return (
                              <Container
                                  label={currentGroup.name}
                                  shadow
                                  key={group}
                                  onRemove={() => {}}
                                  type={currentGroup.type}
                                  id={group}
                              >
                                  {currentGroup.data.map((item) => {
                                      const currentItem = findContainer(item);
                                      return (
                                          <Item
                                              key={currentItem.id}
                                              value={currentItem.id}
                                              style={getItemStyles({
                                                  containerId,
                                                  overIndex: -1,

                                                  value: currentItem.id,
                                                  isDragging: false,
                                                  isSorting: false,
                                                  isDragOverlay: false,
                                              })}
                                              renderItem={renderItem}
                                              characterId={currentItem.id}
                                              activeCharacterId={
                                                  activeCharacter
                                              }
                                          />
                                      );
                                  })}
                              </Container>
                          );
                      })
                    : currentContainer.type === "group"
                    ? currentContainer.data.map((item, index) => {
                          const currentItem = findContainer(item);
                          return (
                              <Item
                                  key={currentItem.id}
                                  value={currentItem.id}
                                  style={getItemStyles({
                                      containerId,
                                      overIndex: -1,

                                      value: currentItem.id,
                                      isDragging: false,
                                      isSorting: false,
                                      isDragOverlay: false,
                                  })}
                                  wrapperStyle={wrapperStyle({ index })}
                                  renderItem={renderItem}
                                  characterId={currentItem.id}
                                  activeCharacter={activeCharacter}
                              />
                          );
                      })
                    : null}
            </Container>
        );
    }
}
