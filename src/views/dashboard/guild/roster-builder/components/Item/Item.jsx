import { useEffect, memo, forwardRef, useContext, useCallback } from "react";
import { classNames } from "../../../../../../utils/helpers.js";

import { Remove } from "../Remove.jsx";
import { StyledActions, StyledItem, StyledWrapper } from "./Item.styles.jsx";
import { RosterContext } from "../../store/RosterContextProvider.jsx";
import { useStore } from "zustand";
import { Typography, styled, useTheme } from "@mui/material";

const StyledTypography = styled(Typography)(({ theme }) => ({
    fontWeight: "800",
    color:
        theme.palette.mode === "dark"
            ? theme.palette.background.dark3
            : "inherit",
}));

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

            const selectedTab = useStore(
                rosterStore,
                (state) => state.selectedTab
            );

            const chosenLockouts = useStore(
                rosterStore,
                (state) => state.chosenLockouts
            );

            const getContainer = useStore(
                rosterStore,
                (state) => state.getContainer
            );
            const getActualContainer = useCallback(
                (id) => {
                    return selectedTab === 0
                        ? getContainer(id)
                        : getContainer(id, chosenLockouts[selectedTab].id);
                },
                [getContainer, selectedTab, chosenLockouts]
            );

            const character = getActualContainer(characterId);
            const activeCharacter = getActualContainer(activeCharacterId);
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
                        <StyledTypography variant="h5">
                            {character.character_name}
                        </StyledTypography>
                        <StyledActions>
                            {onRemove ? <Remove onClick={onRemove} /> : null}
                        </StyledActions>
                    </StyledItem>
                </StyledWrapper>
            );
        }
    )
);
