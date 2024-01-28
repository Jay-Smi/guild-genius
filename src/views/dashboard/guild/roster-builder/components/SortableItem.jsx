import { useSortable } from "@dnd-kit/sortable";
import { memo, useEffect, useState } from "react";
import { Item } from "./Item/Item";
import { Sort } from "@mui/icons-material";

// function useMountStatus() {
//     const [isMounted, setIsMounted] = useState(false);

//     useEffect(() => {
//         const timeout = setTimeout(() => setIsMounted(true), 500);

//         return () => clearTimeout(timeout);
//     }, []);

//     return isMounted;
// }

const SortableItem = memo(
    ({ id, index, renderItem, characterId, activeCharacterId }) => {
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

        // const mounted = useMountStatus();
        // const mountedWhileDragging = isDragging && !mounted;

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
                // fadeIn={mountedWhileDragging}
                listeners={listeners}
                renderItem={renderItem}
                characterId={characterId}
                activeCharacterId={activeCharacterId}
            />
        );
    }
);
SortableItem.displayName = "SortableItem";
export default SortableItem;
