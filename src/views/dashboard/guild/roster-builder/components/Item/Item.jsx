import React, { useEffect, memo, forwardRef, useContext } from "react";
import { classNames } from "../../../../../../utils/helpers.js";

import { Handle } from "../Handle.jsx";
import { Remove } from "../Remove.jsx";
import {
    StyledActions,
    StyledDragHandle,
    StyledItem,
    StyledWrapper,
} from "./Item.styles.jsx";
import { RosterContext } from "../../store/RosterContextProvider.jsx";
import { useStore } from "zustand";
import { Typography, useTheme } from "@mui/material";

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
                characterId,
                activeCharacterId,

                ...props
            },
            ref
        ) => {
            const theme = useTheme();
            const rosterStore = useContext(RosterContext);
            const character = useStore(rosterStore, (state) =>
                state.getCharacter(characterId)
            );
            const activeCharacter = useStore(rosterStore, (state) =>
                state.getCharacter(activeCharacterId)
            );

            const isActivePlayer =
                activeCharacter &&
                character.player_id === activeCharacter.player_id;
            useEffect(() => {
                if (!dragOverlay) {
                    return;
                }

                document.body.style.cursor = "grabbing";

                return () => {
                    document.body.style.cursor = "";
                };
            }, [dragOverlay]);

            const lowerCaseClass = character.class.toLowerCase();

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
                        borderRadius: "5px",
                    }}
                    ref={ref}
                >
                    <StyledItem
                        className={classNames(
                            dragging && "dragging",
                            dragOverlay && "dragOverlay",
                            disabled && "disabled"
                        )}
                        style={{
                            ...style,
                            backgroundColor:
                                isActivePlayer &&
                                characterId !== activeCharacterId
                                    ? theme.palette.error.dark
                                    : `${theme.palette.wow[lowerCaseClass]}${
                                          theme.palette.mode === "dark"
                                              ? "B5"
                                              : "F9"
                                      }`,
                        }}
                        {...props}
                        {...handleProps}
                        {...listeners}
                    >
                        {/* <StyledDragHandle>
                            <Handle />
                        </StyledDragHandle> */}
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: "800",
                                color:
                                    theme.palette.mode === "dark"
                                        ? theme.palette.background.dark3
                                        : "inherit",
                            }}
                        >
                            {character.character_name}
                        </Typography>
                        <StyledActions>
                            {onRemove ? <Remove onClick={onRemove} /> : null}
                        </StyledActions>
                    </StyledItem>
                </StyledWrapper>
            );
        }
    )
);
