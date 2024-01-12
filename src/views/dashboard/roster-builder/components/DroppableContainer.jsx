import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Container from "./Container/Container";

const animateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({ ...args, wasDragging: true });

function DroppableContainer({ children, id, items, style, type, ...props }) {
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
            {...props}
        >
            {children}
        </Container>
    );
}

export default DroppableContainer;
