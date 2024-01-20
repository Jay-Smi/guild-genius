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
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import Container from "./components/Container/Container";
import DroppableContainer from "./components/DroppableContainer";
import { Item } from "./components/Item/Item";
import SortableItem from "./components/SortableItem";
import { coordinateGetter as multipleContainersCoordinateGetter } from "../../../../utils/helpers";

// roster lockout-1 default tanks/healers/melee/ranged, characters filtered in by associated tag,
// create custom lockout-1 with any tag, ex. kicks, dispells, etc.

export function RosterBuilderActual({
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
    raids: initialRaids,
    groups: initialGroups,
    players,
}) {
    const updatedCharacters = initialCharacters.map((character) => {
        return {
            ...character,
            player: players.find((player) => player.data.includes(character.id))
                .name,
        };
    });
    const [containers, setContainers] = useState([
        ...initialCategories,
        ...initialRaids,
        ...initialGroups,
        ...updatedCharacters,
        {
            id: "categoriesContainer",
            type: "container",
            data: initialCategories.map((category) => category.id),
        },
        {
            id: "raidsContainer",
            type: "container",
            data: initialRaids.map((raid) => raid.id),
        },
    ]);
    const [activePlayer, setActivePlayer] = useState(null);
    const [activeCharacter, setActiveCharacter] = useState(null);
    const [activeId, setActiveId] = useState(null);
    const lastOverId = useRef(null);
    const recentlyMovedToNewContainer = useRef(false);
    const [clonedItems, setClonedItems] = useState(null);

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
                    setActivePlayer(findPlayer(active.id));
                    setActiveCharacter(findContainer);
                }
            }}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            modifiers={modifiers}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                }}
            >
                <div
                    style={{
                        display: "flex",

                        padding: 20,
                        flexDirection: "column",
                        height: "100%",
                        overflow: "scroll",
                    }}
                >
                    <SortableContext
                        items={findContainer("categoriesContainer").data}
                        strategy={strategy}
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
                                        onRemove={() =>
                                            handleRemove(currentContainer.id)
                                        }
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
                                                            getIndex={getIndex}
                                                            character={
                                                                currentCharacter
                                                            }
                                                            activeCharacter={
                                                                activeCharacter
                                                            }
                                                            activePlayer={
                                                                activePlayer
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
                </div>
                <div
                    style={{
                        display: "flex",
                        boxSizing: "border-box",

                        padding: 20,
                        flexDirection: "column",

                        gap: "20px",
                    }}
                >
                    {/* //Sortable Raids */}

                    <SortableContext
                        items={findContainer("raidsContainer").data}
                        strategy={strategy}
                    >
                        {findContainer("raidsContainer").data.map((raidId) => {
                            const currentRaid = findContainer(raidId);
                            return (
                                <DroppableContainer
                                    key={currentRaid.id}
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
                                        {currentRaid.data.map((groupId) => {
                                            const currentGroup =
                                                findContainer(groupId);
                                            return (
                                                <DroppableContainer
                                                    key={currentGroup.id}
                                                    id={currentGroup.id}
                                                    label={currentGroup.name}
                                                    items={currentGroup.data}
                                                    onRemove={() =>
                                                        handleRemove(
                                                            currentGroup.id
                                                        )
                                                    }
                                                    type={currentGroup.type}
                                                >
                                                    <SortableContext
                                                        items={
                                                            currentGroup?.data
                                                        }
                                                        strategy={strategy}
                                                    >
                                                        {currentGroup?.data.map(
                                                            (characterId) => {
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
                                                                        character={
                                                                            currentCharacter
                                                                        }
                                                                        activeCharacter={
                                                                            activeCharacter
                                                                        }
                                                                        activePlayer={
                                                                            activePlayer
                                                                        }
                                                                    />
                                                                );
                                                            }
                                                        )}
                                                    </SortableContext>
                                                </DroppableContainer>
                                            );
                                        })}
                                    </SortableContext>
                                </DroppableContainer>
                            );
                        })}
                    </SortableContext>
                </div>
            </div>
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
        return players.find((player) => player.data.includes(id));
    }

    function isACharacter(id) {
        return findContainer(id).type === "character";
    }

    function findParent(id) {
        return containers.find((container) => container.data.includes(id));
    }

    function getIndex(id) {
        const parentContainer = findParent(id);
        return parentContainer.data.indexOf(id);
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
            setActivePlayer(null);
            setActiveId(null);
            return;
        }
        if (activeContainer.id === overContainer.id) {
            setActiveCharacter(null);
            setActivePlayer(null);
            setActiveId(null);
            return;
        }

        const activeIndex = getIndex(activeContainer.id);
        const overIndex = getIndex(overContainer.id);

        setContainers((containers) => {
            const newContainers = containers.map((container) => {
                if (container.id === findParent(active.id).id) {
                    return {
                        ...container,
                        data: arrayMove(container.data, activeIndex, overIndex),
                    };
                }
                return container;
            });
            return newContainers;
        });
        console.log("here");
        setActiveCharacter(null);
        setActivePlayer(null);
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
                    setContainers((containers) => {
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
                        return newContainers;
                    });
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

                    setContainers((containers) => {
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
                        return newContainers;
                    });
                }
            }
        }
    }

    function handleDragCancel() {
        if (clonedItems) {
            setContainers(clonedItems);
        }
        setActivePlayer(null);
        setActiveCharacter(null);
        setActiveId(null);
        setClonedItems(null);
    }

    function handleRemove() {
        // setContainers((containers) =>
        //     containers.filter((id) => id !== containerID)
        // );
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
                dragOverlay
                character={findContainer(id)}
                activeCharacter={activeCharacter}
                activePlayer={activePlayer}
            />
        );
    }

    function renderContainerDragOverlay(containerId) {
        const currentContainer = findContainer(containerId);
        return (
            <Container
                label={containerId}
                shadow
                onRemove={() => {}}
                type={currentContainer.type}
                overlay={"overlay"}
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
                                  character={currentItem}
                                  activeCharacter={findContainer(activeId)}
                                  player={findPlayer(currentItem.id)}
                                  activePlayer={activePlayer}
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
                                              character={currentItem}
                                              activeCharacter={activeCharacter}
                                              activePlayer={activePlayer}
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
                                  character={currentItem}
                                  activeCharacter={activeCharacter}
                                  activePlayer={activePlayer}
                              />
                          );
                      })
                    : null}
            </Container>
        );
    }
}
