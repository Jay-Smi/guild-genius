import { closestCorners, getFirstCollision, KeyboardCode } from "@dnd-kit/core";
const defaultInitializer = (index) => index;

export function createRange(length, initializer = defaultInitializer) {
    return [...new Array(length)].map((_, index) => initializer(index));
}

const directions = [
    KeyboardCode.Down,
    KeyboardCode.Right,
    KeyboardCode.Up,
    KeyboardCode.Left,
];

export const coordinateGetter = (
    event,
    { context: { active, droppableRects, droppableContainers, collisionRect } }
) => {
    if (directions.includes(event.code)) {
        event.preventDefault();

        if (!active || !collisionRect) {
            return;
        }

        const filteredContainers = [];

        droppableContainers.getEnabled().forEach((entry) => {
            if (!entry || entry?.disabled) {
                return;
            }

            const rect = droppableRects.get(entry.id);

            if (!rect) {
                return;
            }

            const data = entry.data.current;

            if (data) {
                const { type, children } = data;

                if (type === "container" && children?.length > 0) {
                    if (active.data.current?.type !== "container") {
                        return;
                    }
                }
            }

            switch (event.code) {
                case KeyboardCode.Down:
                    if (collisionRect.top < rect.top) {
                        filteredContainers.push(entry);
                    }
                    break;
                case KeyboardCode.Up:
                    if (collisionRect.top > rect.top) {
                        filteredContainers.push(entry);
                    }
                    break;
                case KeyboardCode.Left:
                    if (collisionRect.left >= rect.left + rect.width) {
                        filteredContainers.push(entry);
                    }
                    break;
                case KeyboardCode.Right:
                    if (collisionRect.left + collisionRect.width <= rect.left) {
                        filteredContainers.push(entry);
                    }
                    break;
            }
        });

        const collisions = closestCorners({
            active,
            collisionRect: collisionRect,
            droppableRects,
            droppableContainers: filteredContainers,
            pointerCoordinates: null,
        });
        const closestId = getFirstCollision(collisions, "id");

        if (closestId != null) {
            const newDroppable = droppableContainers.get(closestId);
            const newNode = newDroppable?.node.current;
            const newRect = newDroppable?.rect.current;

            if (newNode && newRect) {
                if (newDroppable.id === "placeholder") {
                    return {
                        x:
                            newRect.left +
                            (newRect.width - collisionRect.width) / 2,
                        y:
                            newRect.top +
                            (newRect.height - collisionRect.height) / 2,
                    };
                }

                if (newDroppable.data.current?.type === "container") {
                    return {
                        x: newRect.left + 20,
                        y: newRect.top + 74,
                    };
                }

                return {
                    x: newRect.left,
                    y: newRect.top,
                };
            }
        }
    }

    return undefined;
};

export function classNames(...args) {
    // Initialize an empty array to store individual class names
    const result = [];

    // Iterate over each argument
    args.forEach((arg) => {
        if (
            typeof arg === "string" ||
            typeof arg === "number" ||
            typeof arg === "boolean"
        ) {
            // If the argument is a string, number, or boolean, add it to the result array
            result.push(String(arg));
        } else if (arg && typeof arg === "object") {
            // If the argument is an object, iterate over its keys
            for (const key in arg) {
                // If the value corresponding to the key is truthy, add the key to the result array
                if (arg[key]) {
                    result.push(key);
                }
            }
        } else if (Array.isArray(arg)) {
            // If the argument is an array, recursively call the classNames function
            // with the array elements and add the result to the result array
            const nestedResult = classNames(...arg);
            if (nestedResult) {
                result.push(nestedResult);
            }
        }
    });

    // Join the individual class names with a space and return the result
    return result.join(" ");
}
