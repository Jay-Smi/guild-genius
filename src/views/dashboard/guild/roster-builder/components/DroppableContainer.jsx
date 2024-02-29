import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Container from "./Container/Container";
import { memo } from "react";

const animateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({ ...args, wasDragging: true });

const DroppableContainer = memo(
    ({ children, id, items, style, type, activeId, ...props }) => {
        const {
            attributes,
            isDragging,
            listeners,
            setNodeRef,
            transition,
            transform,
        } = useSortable({
            id,
            data: {
                type: "container",
                children: items,
            },
            animateLayoutChanges,
        });

        return (
            <Container
                ref={setNodeRef}
                style={{
                    ...style,
                    transition,
                    transform: CSS.Translate.toString(transform),
                    opacity: isDragging ? 0.5 : undefined,
                }}
                handleProps={{
                    ...attributes,
                    ...listeners,
                }}
                type={type}
                id={id}
                activeId={activeId}
                {...props}
            >
                {children}
            </Container>
        );
    }
);

DroppableContainer.displayName = "DroppableContainer";

export default DroppableContainer;
