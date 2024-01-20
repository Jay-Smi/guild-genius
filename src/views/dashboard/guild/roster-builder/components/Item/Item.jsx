import React, { useEffect, memo, forwardRef } from "react";
import { classNames } from "../../../../../../utils/helpers.js";

import { Handle } from "../Handle.jsx";
import { Remove } from "../Remove.jsx";
import {
    StyledActions,
    StyledDragHandle,
    StyledItem,
    StyledWrapper,
} from "./Item.styles.jsx";

export const Item = memo(
    forwardRef(
        (
            {
                dragOverlay,
                dragging,
                disabled,
                fadeIn,
                handleProps,
                height,

                listeners,
                onRemove,
                renderItem,
                sorting,
                style,
                transition,
                transform,
                value,
                wrapperStyle,
                character,
                activeCharacter,
                player,
                activePlayer,
                ...props
            },
            ref
        ) => {
            const isActiveCharacter = activeCharacter
                ? activeCharacter.id === character.id
                : false;
            // console.log("activePlayer", activePlayer);
            // console.log("character", character);
            const isActivePlayer = activePlayer
                ? activePlayer.name === character.player
                : "";

            useEffect(() => {
                if (!dragOverlay) {
                    return;
                }

                document.body.style.cursor = "grabbing";

                return () => {
                    document.body.style.cursor = "";
                };
            }, [dragOverlay]);

            return (
                <StyledWrapper
                    className={classNames(
                        fadeIn && "fadeIn",
                        sorting && "sorting",
                        dragOverlay && "dragOverlay"
                    )}
                    style={{
                        ...wrapperStyle,
                        transition: [transition, wrapperStyle?.transition]
                            .filter(Boolean)
                            .join(", "),
                        "--translate-x": transform
                            ? `${Math.round(transform.x)}px`
                            : undefined,
                        "--translate-y": transform
                            ? `${Math.round(transform.y)}px`
                            : undefined,
                        "--scale-x": transform?.scaleX
                            ? `${transform.scaleX}`
                            : undefined,
                        "--scale-y": transform?.scaleY
                            ? `${transform.scaleY}`
                            : undefined,
                        boxShadow: isActivePlayer ? "0 0 0 1px green" : "",
                    }}
                    ref={ref}
                >
                    <StyledItem
                        className={classNames(
                            dragging && "dragging",
                            dragOverlay && "dragOverlay",
                            disabled && "disabled"
                        )}
                        style={style}
                        {...props}
                    >
                        <StyledDragHandle>
                            <Handle {...handleProps} {...listeners} />
                        </StyledDragHandle>
                        {character.character_name}
                        <StyledActions>
                            {onRemove ? <Remove onClick={onRemove} /> : null}
                        </StyledActions>
                    </StyledItem>
                </StyledWrapper>
            );
        }
    )
);
