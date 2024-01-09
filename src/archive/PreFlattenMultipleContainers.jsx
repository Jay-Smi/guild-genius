import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
    closestCenter,
    pointerWithin,
    rectIntersection,
    DndContext,
    DragOverlay,
    getFirstCollision,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensors,
    useSensor,
    MeasuringStrategy,
    closestCorners,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { coordinateGetter as multipleContainersCoordinateGetter } from "../utils/helpers";
import { Item } from "../components/Item/Item";
import Container from "../components/Container/Container";
import DroppableContainer from "../ui/sortable/DroppableContainer";
import SortableItem from "../ui/sortable/SortableItem";
import { createRange } from "../utils/helpers";
import { characters } from "../data/data";

// roster categories default tanks/healers/melee/ranged, characters filtered in by associated tag,
// create custom categories with any tag, ex. kicks, dispells, etc.

export function MultipleContainers({
    adjustScale = false,
    itemCount = 3,
    cancelDrop,
    items: initialItems = characters,
    containerStyle,
    coordinateGetter = multipleContainersCoordinateGetter,
    getItemStyles = () => ({}),
    wrapperStyle = () => ({}),
    modifiers,
    renderItem,
    strategy = verticalListSortingStrategy,
}) {
    const [unrostered, setUnrostered] = useState(initialItems.unrostered);
    const [raids, setRaids] = useState(initialItems.raids);
    //delete this something
    const [containers, setContainers] = useState([
        {
            id: "1",
            type: "raid",
            subcontainers: ["", "", ""],
            subcontainerType: "group",
        },
        {
            id: "1",
            type: "category",
            subcontainers: [
                {
                    lists: [],
                    type: "character",
                },
            ],
        },
        {
            id: "1",
            type: "character",
            parent: {
                type: "group",
                id: "1",
            },
        },
        {
            id: "1",
            type: "group",
            subcontainer: [
                {
                    lists: ["1"],
                    type: "character",
                },
            ],
        },
        {
            id: "1",
            type: "lockout",
            subcontainer: [
                {
                    lists: ["1"],
                    type: "raid",
                },
                {
                    lists: ["1"],
                    type: "category",
                },
            ],
        },
    ]);
    ////
    [
        {
            id: "raid-1",
            subcontainers: ["group-1", "group-2"],
            validPrefix: ["group"],
        },
        {
            id: "group-2",
            subcontainers: ["char-1", "char-2"],
            parent: "raid-1",
            validPrefix: ["character"],
        },
    ];
    const [unrosteredContainers, setUnrosteredContainers] = useState(
        Object.keys(unrostered)
    );
    const [raidContainers, setRaidContainers] = useState(Object.keys(raids));
    const [raidGroupContainers, setRaidGroupContainers] = useState(() => {
        const raidGroups = {};

        for (const key in raids) {
            raidGroups[key] = Object.keys(raids[key]);
        }

        return raidGroups;
    });

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
    }, [unrostered, raids]);

    const isARaidGroup = useCallback(
        (id) => {
            return Object.values(raidGroupContainers).some((groups) =>
                groups.includes(id)
            );
        },
        [raidGroupContainers]
    );

    const isAContainer = useCallback(
        (id) => {
            return (
                unrosteredContainers.includes(id) ||
                raidContainers.includes(id) ||
                isARaidGroup(id)
            );
        },
        [raidContainers, unrosteredContainers, isARaidGroup]
    );

    const isARaid = useCallback(
        (id) => {
            return raidContainers.includes(id);
        },
        [raidContainers]
    );

    const isUnrosteredContainer = useCallback(
        (id) => {
            return unrosteredContainers.includes(id);
        },
        [unrosteredContainers]
    );

    const findRaidContainer = useCallback(
        (id) => {
            if (isARaidGroup(id)) {
                return Object.keys(raids).find((raidKey) =>
                    Object.keys(raids[raidKey]).includes(id)
                );
            }
            return raidContainers.find((raidKey) =>
                Object.values(raids[raidKey]).some((group) =>
                    group.some((character) => character.id === id)
                )
            );
        },
        [raidContainers, raids, isARaidGroup]
    );

    const collisionDetectionStrategy = useCallback(
        (args) => {
            if (activeId && isAContainer(activeId)) {
                if (isARaid(activeId)) {
                    return pointerWithin({
                        ...args,
                        droppableContainers: args.droppableContainers.filter(
                            (container) => isARaid(container.id)
                        ),
                    });
                } else if (isUnrosteredContainer(activeId)) {
                    return pointerWithin({
                        ...args,
                        droppableContainers: args.droppableContainers.filter(
                            (container) => isUnrosteredContainer(container.id)
                        ),
                    });
                } else if (isARaidGroup(activeId)) {
                    return closestCenter({
                        ...args,
                        droppableContainers: args.droppableContainers.filter(
                            (container) => isAContainer(container.id)
                        ),
                    });
                } else {
                    console.warn("activeId is an unrecognized container");
                }
            }

            const pointerIntersections = pointerWithin(args);

            const intersections =
                pointerIntersections.length > 0
                    ? pointerIntersections
                    : rectIntersection(args);
            let overId = getFirstCollision(intersections, "id");

            //if dragging character over a container
            if (overId != null) {
                if (isUnrosteredContainer(overId) || isARaidGroup(overId)) {
                    let containerItems = null;
                    if (isUnrosteredContainer(overId))
                        containerItems = unrostered[overId];

                    if (isARaidGroup(overId)) {
                        const raid = findRaidContainer(overId);
                        containerItems = raids[raid][overId];
                    }
                    ////////////////////////////////CD strategy broken
                    if (containerItems?.length > 0) {
                        overId = closestCenter({
                            ...args,
                            droppableContainers:
                                args.droppableContainers.filter(
                                    (container) =>
                                        isUnrosteredContainer(container.id) ||
                                        isARaidGroup(container.id)
                                ),
                        })[0]?.id;
                    }
                }

                lastOverId.current = overId;

                return [{ id: overId }];
            }

            if (recentlyMovedToNewContainer.current) {
                lastOverId.current = activeId;
            }

            return lastOverId.current ? [{ id: lastOverId.current }] : [];
        },
        [
            activeId,
            unrostered,
            raids,
            isAContainer,
            isARaid,
            isARaidGroup,
            isUnrosteredContainer,
            findRaidContainer,
        ]
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
                setClonedItems({ unrostered, raids });
            }}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            cancelDrop={cancelDrop}
            onDragCancel={handleDragCancel}
            modifiers={modifiers}
        >
            <div
                style={{
                    display: "flex",
                }}
            >
                <div
                    style={{
                        display: "inline-grid",
                        boxSizing: "border-box",
                        padding: 20,
                        gridAutoFlow: "row",
                    }}
                >
                    <SortableContext
                        items={unrosteredContainers}
                        strategy={strategy}
                    >
                        {unrosteredContainers.map((containerId) => (
                            <DroppableContainer
                                key={containerId}
                                id={containerId}
                                label={`${containerId}`}
                                items={unrostered[containerId]}
                                style={containerStyle}
                                onRemove={() => handleRemove(containerId)}
                                index={containerId}
                            >
                                <SortableContext
                                    items={unrostered[containerId]}
                                    strategy={strategy}
                                >
                                    {unrostered[containerId].map(
                                        (character, index) => {
                                            return (
                                                <SortableItem
                                                    key={character.id}
                                                    id={character.id}
                                                    index={index}
                                                    style={getItemStyles}
                                                    wrapperStyle={wrapperStyle}
                                                    renderItem={renderItem}
                                                    containerId={containerId}
                                                    getIndex={getIndex}
                                                />
                                            );
                                        }
                                    )}
                                </SortableContext>
                            </DroppableContainer>
                        ))}
                    </SortableContext>
                </div>
                <div
                    style={{
                        display: "inline-grid",
                        boxSizing: "border-box",
                        padding: 20,
                        gridAutoFlow: "row",
                    }}
                >
                    {/* //Sortable Raids */}
                    <SortableContext items={raidContainers} strategy={strategy}>
                        {raidContainers.map((raidContainerId) => (
                            <DroppableContainer
                                key={raidContainerId}
                                id={raidContainerId}
                                label={`${raidContainerId}`}
                                items={raids[raidContainerId]}
                                style={containerStyle}
                                onRemove={() => handleRemove(raidContainerId)}
                            >
                                {/* //Sortable Raid Groups */}
                                <SortableContext
                                    items={raidGroupContainers[raidContainerId]}
                                    strategy={strategy}
                                >
                                    {raidGroupContainers[raidContainerId].map(
                                        (raidGroupContainerId) => (
                                            <DroppableContainer
                                                key={raidGroupContainerId}
                                                id={raidGroupContainerId}
                                                label={`${raidGroupContainerId}`}
                                                items={
                                                    raids[raidContainerId][
                                                        raidGroupContainerId
                                                    ]
                                                }
                                                style={containerStyle}
                                                onRemove={() =>
                                                    handleRemove(
                                                        raidGroupContainerId
                                                    )
                                                }
                                            >
                                                {/* //Sortable Characters */}
                                                <SortableContext
                                                    items={
                                                        raids[raidContainerId][
                                                            raidGroupContainerId
                                                        ]
                                                    }
                                                    strategy={strategy}
                                                >
                                                    {raids[raidContainerId][
                                                        raidGroupContainerId
                                                    ].map(
                                                        (character, index) => {
                                                            return (
                                                                <SortableItem
                                                                    key={
                                                                        character.id
                                                                    }
                                                                    id={
                                                                        character.id
                                                                    }
                                                                    index={
                                                                        index
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
                                                                        raidGroupContainerId
                                                                    }
                                                                    getIndex={
                                                                        getIndex
                                                                    }
                                                                />
                                                            );
                                                        }
                                                    )}
                                                </SortableContext>
                                            </DroppableContainer>
                                        )
                                    )}
                                </SortableContext>
                            </DroppableContainer>
                        ))}
                    </SortableContext>
                </div>
            </div>
            {createPortal(
                <DragOverlay adjustScale={adjustScale}>
                    {activeId
                        ? isAContainer(activeId)
                            ? renderContainerDragOverlay(activeId)
                            : renderSortableItemDragOverlay(activeId)
                        : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );

    function findUnrosteredContainer(id) {
        return unrosteredContainers.find((key) =>
            unrostered[key].some((item) => item.id === id)
        );
    }

    function isInUnrostered(id) {
        return unrosteredContainers.some((key) =>
            unrostered[key].some((item) => item.id === id)
        );
    }

    function isInRaid(id) {
        return Object.values(raids).some((raid) =>
            Object.values(raid).some((group) =>
                group.some((character) => character.id === id)
            )
        );
    }

    function findRaidGroupContainer(id) {
        let res = null;

        raidContainers.find((raidKey) => {
            Object.keys(raids[raidKey]).some((groupKey) => {
                raids[raidKey][groupKey].some((character) => {
                    if (character.id === id) {
                        res = groupKey;
                    }
                });
            });
        });
        return res;
    }

    function findContainer(id) {
        if (isAContainer(id)) {
            if (raidContainers.includes(id)) return id;
            if (isARaidGroup(id)) return findRaidContainer(id);
        }

        if (isInUnrostered(id)) {
            return findUnrosteredContainer(id);
        }
        if (isInRaid(id)) {
            return findRaidGroupContainer(id);
        }
    }

    function getIndex(id) {
        const container = findContainer(id);

        if (!container) {
            return -1;
        }

        let index;
        if (isARaidGroup(id)) {
            index = raidGroupContainers[container].findIndex(
                (item) => item === id
            );
        }
        if (isInUnrostered(id)) {
            index = unrostered[container].findIndex((item) => item.id === id);
        }
        if (isInRaid(id)) {
            index = raids[findRaidContainer(id)][container].findIndex(
                (item) => item.id === id
            );
        }

        return index;
    }

    function handleDragEnd({ active, over }) {
        if (isAContainer(active.id) && over?.id) {
            if (isARaid(active.id)) {
                setRaidContainers((containers) => {
                    const activeIndex = containers.indexOf(active.id);
                    const overIndex = containers.indexOf(over.id);
                    return arrayMove(containers, activeIndex, overIndex);
                });
            } else if (isARaidGroup(active.id)) {
                setRaidGroupContainers((containers) => {
                    const activeRaid = findRaidContainer(active.id);
                    const overRaid = findRaidContainer(over.id);
                    const activeIndex = containers[activeRaid].indexOf(
                        active.id
                    );
                    const overIndex = containers[overRaid].indexOf(over.id);

                    if (activeRaid !== overRaid) {
                        setRaids((prevRaids) => {
                            const sourceGroup = active.id;
                            const targetGroup = over.id;

                            return {
                                ...prevRaids,
                                [overRaid]: {
                                    ...prevRaids[overRaid],
                                    [targetGroup]: [
                                        ...prevRaids[overRaid][targetGroup],
                                        ...prevRaids[activeRaid][sourceGroup], // Move the entire raid group
                                    ],
                                },
                                [activeRaid]: {
                                    ...prevRaids[activeRaid],
                                    [sourceGroup]: [], // Empty the source raid group
                                },
                            };
                        });

                        return {
                            ...containers,
                            [activeRaid]: containers[activeRaid].filter(
                                (item) => item !== active.id
                            ),
                            [overRaid]: [...containers[overRaid], active.id], // Add the raid group to the new raid
                        };
                    }

                    return {
                        ...containers,
                        [activeRaid]: arrayMove(
                            containers[activeRaid],
                            activeIndex,
                            overIndex
                        ),
                    };
                });
            } else if (isUnrosteredContainer(active.id)) {
                setUnrosteredContainers((containers) => {
                    const activeIndex = containers.indexOf(active.id);
                    const overIndex = containers.indexOf(over.id);
                    return arrayMove(containers, activeIndex, overIndex);
                });
            }
        }

        const activeContainer = findContainer(active.id);

        if (!activeContainer) {
            setActiveId(null);
            return;
        }

        const overId = over?.id;

        if (overId == null) {
            setActiveId(null);
            return;
        }

        const overContainer = findContainer(overId);

        if (isARaid(overContainer)) {
            setActiveId(null);
            return;
        }

        // if (overContainer) {
        //     if (isARaidGroup(overContainer)) {
        //         setRaids((raids) => {
        //             const activeIndex = getIndex(active.id);
        //             const overIndex = getIndex(overId);
        //             const activeContainer = findContainer(active.id);
        //             const overContainer = findContainer(overId);
        //             return {
        //                 ...raids,
        //                 [findRaidContainer(active.id)]: {
        //                     ...raids[findRaidContainer(active.id)],
        //                     [activeContainer]: raids[
        //                         findRaidContainer(active.id)
        //                     ][activeContainer].filter(
        //                         (item) => item.id !== active.id
        //                     ),
        //                     [overContainer]: [
        //                         ...raids[findRaidContainer(active.id)][
        //                             overContainer
        //                         ].slice(0, overIndex),
        //                         raids[findRaidContainer(active.id)][
        //                             activeContainer
        //                         ][activeIndex],
        //                         ...raids[findRaidContainer(active.id)][
        //                             overContainer
        //                         ].slice(
        //                             overIndex,
        //                             raids[findRaidContainer(active.id)][
        //                                 overContainer
        //                             ].length
        //                         ),
        //                     ],
        //                 },
        //             };
        //         });
        //     }
        //     if (isUnrosteredContainer(overContainer)) {
        //         setUnrostered((unrostered) => {
        //             const activeIndex = getIndex(active.id);
        //             const overIndex = getIndex(overId);
        //             const activeContainer = findContainer(active.id);
        //             const overContainer = findContainer(overId);
        //             return {
        //                 ...unrostered,
        //                 [activeContainer]: unrostered[activeContainer].filter(
        //                     (item) => item.id !== active.id
        //                 ),
        //                 [overContainer]: [
        //                     ...unrostered[overContainer].slice(0, overIndex),
        //                     unrostered[activeContainer][activeIndex],
        //                     ...unrostered[overContainer].slice(
        //                         overIndex,
        //                         unrostered[overContainer].length
        //                     ),
        //                 ],
        //             };
        //         });
        //     }
        // }

        setActiveId(null);
    }

    function handleDragOver({ active, over }) {
        const overId = over?.id;

        if (
            overId == null ||
            isUnrosteredContainer(active.id) ||
            isARaid(active.id)
        ) {
            return;
        }

        const overContainer = findContainer(overId);
        const activeContainer = findContainer(active.id);
        console.log(activeContainer, overContainer);
        // if (!overContainer || !activeContainer) {
        //     return;
        // }

        if (activeContainer !== overContainer) {
            if (isARaidGroup(active.id) && !isUnrosteredContainer(over.id)) {
                //raid group being dragged over different raid

                setRaids((raids) => {
                    const activeRaidGroupIndex = getIndex(active.id);
                    const { [active.id]: _, ...updatedRaidGroup } =
                        raids[activeContainer];
                    recentlyMovedToNewContainer.current = true;
                    setRaidGroupContainers((containers) => {
                        return {
                            ...containers,
                            [overContainer]: [
                                ...containers[overContainer],
                                active.id,
                            ],
                            [activeContainer]: containers[
                                activeContainer
                            ].filter((item) => item !== active.id),
                        };
                    });
                    return {
                        ...raids,
                        [overContainer]: {
                            ...raids[overContainer],
                            [active.id]: raids[activeContainer][active.id],
                        },
                        [activeContainer]: updatedRaidGroup,
                    };
                });
            }
            //below here can only be an Item

            //handles characters between raid groups
            if (isARaidGroup(overId) && !isInUnrostered(active.id)) {
                console.log("between raid groups");
            }
            //handles characters between unrostered categories
            if (isUnrosteredContainer(overContainer) && !isInRaid(active.id)) {
                setUnrostered((unrostered) => {
                    const activeIndex = getIndex(active.id);
                    const overIndex = getIndex(overId);
                    const activeContainer = findContainer(active.id);
                    const overContainer = findContainer(overId);
                    return {
                        ...unrostered,
                        [activeContainer]: unrostered[activeContainer].filter(
                            (item) => item.id !== active.id
                        ),
                        [overContainer]: [
                            ...unrostered[overContainer].slice(0, overIndex),
                            unrostered[activeContainer][activeIndex],
                            ...unrostered[overContainer].slice(
                                overIndex,
                                unrostered[overContainer].length
                            ),
                        ],
                    };
                });
            }

            if (
                (isInUnrostered(active.id) && isARaidGroup(overId)) ||
                isInRaid(overId)
            ) {
                const activeIndex = getIndex(active.id);
                const activeContainer = findContainer(active.id);
                const overIndex = getIndex(overId);
                const overRaidGroup = overId;
                const overRaid = findContainer(over.id);

                setRaids((raids) => {
                    setUnrostered((unrostered) => {
                        return {
                            ...unrostered,
                            [activeContainer]: unrostered[
                                activeContainer
                            ].filter((item) => item.id !== active.id),
                        };
                    });
                    return {
                        ...raids,
                        [overRaid]: {
                            ...raids[overRaid],
                            [overRaidGroup]: [
                                ...raids[overRaid][overRaidGroup].slice(
                                    0,
                                    overIndex
                                ),
                                unrostered[activeContainer][activeIndex],
                                ...raids[overRaid][overRaidGroup].slice(
                                    overIndex,
                                    raids[overRaid][overRaidGroup].length
                                ),
                            ],
                        },
                    };
                });
            }

            // setItems((items) => {
            //     const activeItems = items[activeContainer];
            //     const overItems = items[overContainer];
            //     const overIndex = overItems.findIndex(
            //         (item) => item.id === overId
            //     );
            //     const activeIndex = activeItems.findIndex(
            //         (item) => item.id === active.id
            //     );
            //     let newIndex;
            //     if (overId in items) {
            //         newIndex = overItems.length + 1;
            //     } else {
            //         const isBelowOverItem =
            //             over &&
            //             active.rect.current.translated &&
            //             active.rect.current.translated.top >
            //                 over.rect.top + over.rect.height;
            //         const modifier = isBelowOverItem ? 1 : 0;
            //         newIndex =
            //             overIndex >= 0
            //                 ? overIndex + modifier
            //                 : overItems.length + 1;
            //     }
            //     recentlyMovedToNewContainer.current = true;
            //     return {
            //         ...items,
            //         [activeContainer]: items[activeContainer].filter(
            //             (item) => item.id !== active.id
            //         ),
            //         [overContainer]: [
            //             ...items[overContainer].slice(0, newIndex),
            //             items[activeContainer][activeIndex],
            //             ...items[overContainer].slice(
            //                 newIndex,
            //                 items[overContainer].length
            //             ),
            //         ],
            //     };
            // });
        }
    }

    function handleDragCancel() {
        if (clonedItems) {
            setItems(clonedItems);
        }

        setActiveId(null);
        setClonedItems(null);
    }

    function handleRemove(containerID) {
        setContainers((containers) =>
            containers.filter((id) => id !== containerID)
        );
    }

    function renderSortableItemDragOverlay(id) {
        return (
            <Item
                value={id}
                style={getItemStyles({
                    containerId: findContainer(id),
                    overIndex: -1,
                    index: getIndex(id),
                    value: id,
                    isSorting: true,
                    isDragging: true,
                    isDragOverlay: true,
                })}
                wrapperStyle={wrapperStyle({ index: 0 })}
                renderItem={renderItem}
                dragOverlay
            />
        );
    }

    function renderContainerDragOverlay(containerId) {
        return (
            <Container
                label={`${containerId}`}
                style={{
                    height: "100%",
                }}
                shadow
                onRemove={() => {}}
            >
                {isUnrosteredContainer(containerId)
                    ? unrostered[containerId].map((item, index) => {
                          return (
                              <Item
                                  key={item.id}
                                  value={item.id}
                                  style={getItemStyles({
                                      containerId,
                                      overIndex: -1,
                                      index: getIndex(item.id),
                                      value: item.id,
                                      isDragging: false,
                                      isSorting: false,
                                      isDragOverlay: false,
                                  })}
                                  wrapperStyle={wrapperStyle({ index })}
                                  renderItem={renderItem}
                              />
                          );
                      })
                    : isARaid(containerId)
                    ? raidGroupContainers[containerId].map((group, index) => {
                          return (
                              <Container
                                  label={`${group}`}
                                  style={{
                                      height: "100%",
                                  }}
                                  shadow
                                  key={group}
                                  onRemove={() => {}}
                              >
                                  {raids[containerId][group].map(
                                      (item, index) => {
                                          return (
                                              <Item
                                                  key={item.id}
                                                  value={item.id}
                                                  style={getItemStyles({
                                                      containerId,
                                                      overIndex: -1,
                                                      index: getIndex(item.id),
                                                      value: item.id,
                                                      isDragging: false,
                                                      isSorting: false,
                                                      isDragOverlay: false,
                                                  })}
                                                  wrapperStyle={wrapperStyle({
                                                      index,
                                                  })}
                                                  renderItem={renderItem}
                                              />
                                          );
                                      }
                                  )}
                              </Container>
                          );
                      })
                    : isARaidGroup(containerId)
                    ? raids[findRaidContainer(containerId)][containerId].map(
                          (item, index) => {
                              return (
                                  <Item
                                      key={item.id}
                                      value={item.id}
                                      style={getItemStyles({
                                          containerId,
                                          overIndex: -1,
                                          index: getIndex(item.id),
                                          value: item.id,
                                          isDragging: false,
                                          isSorting: false,
                                          isDragOverlay: false,
                                      })}
                                      wrapperStyle={wrapperStyle({ index })}
                                      renderItem={renderItem}
                                  />
                              );
                          }
                      )
                    : null}
            </Container>
        );
    }
}
