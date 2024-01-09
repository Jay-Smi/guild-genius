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
    const [items, setItems] = useState(
        initialItems ?? {
            Healers: createRange(itemCount, (index) => `A${index + 1}`),
            B: createRange(itemCount, (index) => `B${index + 1}`),
            C: createRange(itemCount, (index) => `C${index + 1}`),
            D: createRange(itemCount, (index) => `D${index + 1}`),
        }
    );

    const [containers, setContainers] = useState({
        unrostered: Object.keys(items.unrostered),
        raids: Object.keys(items.raids),
        raidGroups: Object.keys(items.raids).reduce((result, raidKey) => {
            const groups = Object.keys(items.raids[raidKey]);
            result[raidKey] = groups;
            return result;
        }, {}),
    });
    console.log(containers);
    // const [containers, setContainers] = useState(Object.keys(items));
    const [activeId, setActiveId] = useState(null);
    const lastOverId = useRef(null);
    const recentlyMovedToNewContainer = useRef(false);

    const collisionDetectionStrategy = useCallback(
        (args) => {
            if (activeId && activeId in items) {
                return closestCenter({
                    ...args,
                    droppableContainers: args.droppableContainers.filter(
                        (container) => container.id in items
                    ),
                });
            }

            const pointerIntersections = pointerWithin(args);
            const intersections =
                pointerIntersections.length > 0
                    ? pointerIntersections
                    : rectIntersection(args);
            let overId = getFirstCollision(intersections, "id");

            if (overId != null) {
                if (overId in items) {
                    const containerItems = items[overId];

                    if (containerItems.length > 0) {
                        overId = closestCenter({
                            ...args,
                            droppableContainers:
                                args.droppableContainers.filter(
                                    (container) =>
                                        container.id !== overId &&
                                        containerItems.includes(container.id)
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
        [activeId, items]
    );
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
    }, [items]);

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
                setClonedItems(items);
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
                        items={containers.unrostered}
                        strategy={strategy}
                    >
                        {containers.unrostered.map((containerId) => (
                            <DroppableContainer
                                key={containerId}
                                id={containerId}
                                label={`${containerId}`}
                                items={items.unrostered[containerId]}
                                style={containerStyle}
                                onRemove={() => handleRemove(containerId)}
                            >
                                <SortableContext
                                    items={items.unrostered[containerId]}
                                    strategy={strategy}
                                >
                                    {items.unrostered[containerId].map(
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
                    <SortableContext
                        items={containers.raids}
                        strategy={strategy}
                    >
                        {containers.raids.map((raidContainerId) => (
                            <DroppableContainer
                                key={raidContainerId}
                                id={raidContainerId}
                                label={`${raidContainerId}`}
                                items={items.raids[raidContainerId]}
                                style={containerStyle}
                                onRemove={() => handleRemove(raidContainerId)}
                            >
                                {/* //Sortable Raid Groups */}
                                <SortableContext
                                    items={
                                        containers.raidGroups[raidContainerId]
                                    }
                                    strategy={strategy}
                                >
                                    {containers.raidGroups[raidContainerId].map(
                                        (raidGroupContainerId) => (
                                            <DroppableContainer
                                                key={raidGroupContainerId}
                                                id={raidGroupContainerId}
                                                label={`${raidGroupContainerId}`}
                                                items={
                                                    items.raids[
                                                        raidContainerId
                                                    ][raidGroupContainerId]
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
                                                        items.raids[
                                                            raidContainerId
                                                        ][raidGroupContainerId]
                                                    }
                                                    strategy={strategy}
                                                >
                                                    {items.raids[
                                                        raidContainerId
                                                    ][raidGroupContainerId].map(
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
                        ? containers.unrostered.includes(activeId) ||
                          containers.raids.includes(activeId)
                            ? renderContainerDragOverlay(activeId)
                            : renderSortableItemDragOverlay(activeId)
                        : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );

    function findContainer(id) {
        if (id in items) {
            return id;
        }

        return Object.keys(items).find((key) =>
            items[key].some((item) => item.id === id)
        );
    }

    function getIndex(id) {
        const container = findContainer(id);

        if (!container) {
            return -1;
        }

        const index = items[container].findIndex((item) => item.id === id);

        return index;
    }

    function handleDragEnd({ active, over }) {
        if (active.id in items && over?.id) {
            setContainers((containers) => {
                const activeIndex = containers.indexOf(active.id);
                const overIndex = containers.indexOf(over.id);

                return arrayMove(containers, activeIndex, overIndex);
            });
        }

        const activeContainer = findContainer(active.id);
        console.log(activeContainer);

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

        if (overContainer) {
            const activeIndex = items[activeContainer].findIndex(
                (item) => item.id === active.id
            );
            const overIndex = items[overContainer].findIndex(
                (item) => item.id === over.id
            );

            if (activeIndex !== overIndex) {
                setItems((items) => ({
                    ...items,
                    [overContainer]: arrayMove(
                        items[overContainer],
                        activeIndex,
                        overIndex
                    ),
                }));
            }
        }

        setActiveId(null);
    }

    function handleDragOver({ active, over }) {
        const overId = over?.id;

        if (overId == null || active.id in items) {
            return;
        }

        const overContainer = findContainer(overId);
        const activeContainer = findContainer(active.id);

        if (!overContainer || !activeContainer) {
            return;
        }

        if (activeContainer !== overContainer) {
            setItems((items) => {
                const activeItems = items[activeContainer];
                const overItems = items[overContainer];
                const overIndex = overItems.findIndex(
                    (item) => item.id === overId
                );
                const activeIndex = activeItems.findIndex(
                    (item) => item.id === active.id
                );

                let newIndex;

                if (overId in items) {
                    newIndex = overItems.length + 1;
                } else {
                    const isBelowOverItem =
                        over &&
                        active.rect.current.translated &&
                        active.rect.current.translated.top >
                            over.rect.top + over.rect.height;

                    const modifier = isBelowOverItem ? 1 : 0;

                    newIndex =
                        overIndex >= 0
                            ? overIndex + modifier
                            : overItems.length + 1;
                }

                recentlyMovedToNewContainer.current = true;

                return {
                    ...items,
                    [activeContainer]: items[activeContainer].filter(
                        (item) => item.id !== active.id
                    ),
                    [overContainer]: [
                        ...items[overContainer].slice(0, newIndex),
                        items[activeContainer][activeIndex],
                        ...items[overContainer].slice(
                            newIndex,
                            items[overContainer].length
                        ),
                    ],
                };
            });
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
            >
                {items[containerId].map((item, index) => (
                    <Item
                        key={item.id}
                        value={item.id}
                        style={getItemStyles({
                            containerId,
                            overIndex: -1,
                            index: getIndex(item),
                            value: item,
                            isDragging: false,
                            isSorting: false,
                            isDragOverlay: false,
                        })}
                        wrapperStyle={wrapperStyle({ index })}
                        renderItem={renderItem}
                    />
                ))}
            </Container>
        );
    }
}
