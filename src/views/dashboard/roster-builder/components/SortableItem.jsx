import { useSortable } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { Item } from "./Item/Item";

function useMountStatus() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setIsMounted(true), 500);

        return () => clearTimeout(timeout);
    }, []);

    return isMounted;
}

function SortableItem({
    disabled,
    id,
    index,
    renderItem,
    style,
    containerId,
    getIndex,
    character,
    activeCharacter,
    player,
    activePlayer,
}) {
    const {
        setNodeRef,
        setActivatorNodeRef,
        listeners,
        isDragging,
        isSorting,
        over,
        overIndex,
        transform,
        transition,
    } = useSortable({
        id,
    });

    const mounted = useMountStatus();
    const mountedWhileDragging = isDragging && !mounted;

    return (
        <Item
            ref={setNodeRef}
            value={id}
            dragging={isDragging}
            sorting={isSorting}
            handleProps={{ ref: setActivatorNodeRef }}
            index={index}
            transition={transition}
            transform={transform}
            fadeIn={mountedWhileDragging}
            listeners={listeners}
            renderItem={renderItem}
            character={character}
            activeCharacter={activeCharacter}
            player={player}
            activePlayer={activePlayer}
        />
    );
}

export default SortableItem;
