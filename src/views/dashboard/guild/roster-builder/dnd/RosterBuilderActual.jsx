import { DragOverlay } from "@dnd-kit/core";
import {
    SortableContext,
    rectSortingStrategy as strategy,
} from "@dnd-kit/sortable";
import { memo, useCallback, useContext, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import Container from "../components/Container/Container";
import DroppableContainer from "../components/DroppableContainer";
import { Item } from "../components/Item/Item";
import SortableItem from "../components/SortableItem";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Box, Grid, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useStore } from "zustand";
import { RosterContext } from "../store/RosterContextProvider";
import {
    isHealer,
    isMelee,
    isRanged,
    isTank,
} from "../../../../../utils/wowHelpers";
import { styled } from "@mui/material";
import { Style } from "@mui/icons-material";

const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== "matchDownMd",
})(({ theme, matchDownMd }) => {
    return {
        display: "grid",
        gridTemplateColumns: matchDownMd ? "1fr" : "auto 1fr",
        gridTemplateRows: matchDownMd ? "0.9fr 1.1fr" : "1fr",
        height: "calc(100vh - 200px)",
        overflow: "hidden",
        backgroundColor:
            theme.palette.mode === "dark"
                ? theme.palette.background.dark3
                : theme.palette.grey[100],
    };
});

const StyledRaidGridItem = styled(Grid)(({ theme }) => {
    return {
        justifyContent: "center",
        alignItems: "center",
        height: "auto",
    };
});

const RosterBuilderActual = memo(({ handleRemove, containers }) => {
    const rosterStore = useContext(RosterContext);

    const activeId = useStore(rosterStore, (state) => state.activeId);

    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));

    //swap from UUID to int
    //swap category to int, with const lookup
    //
    // sort list before saving to zustand
    // update lookups to that list to be faster
    //
    // or swap to index based lookups
    return (
        <>
            <StyledBox matchDownMd={matchDownMd}>
                <PerfectScrollbar
                    component="div"
                    style={{
                        paddingLeft: "16px",
                        paddingRight: "16px",
                        paddingBottom: "100px",
                    }}
                >
                    <SortableContext
                        items={containers.categoriesContainer.data}
                        strategy={strategy}
                    >
                        <Stack
                            spacing={2}
                            direction={matchDownMd ? "row" : "column"}
                        >
                            {containers.categoriesContainer.data.map(
                                (categoryId) => {
                                    const currentContainer =
                                        containers[categoryId];

                                    return (
                                        <DroppableContainer
                                            key={currentContainer.id}
                                            id={currentContainer.id}
                                            label={currentContainer.name}
                                            items={currentContainer.data}
                                            type={currentContainer.type}
                                            activeId={activeId}
                                        >
                                            <SortableContext
                                                items={currentContainer.data}
                                                strategy={strategy}
                                            >
                                                {currentContainer.data.map(
                                                    (characterId, index) => {
                                                        const currentCharacter =
                                                            containers[
                                                                characterId
                                                            ];

                                                        return (
                                                            <SortableItem
                                                                key={
                                                                    currentCharacter.id
                                                                }
                                                                id={
                                                                    currentCharacter.id
                                                                }
                                                                containerId={
                                                                    currentContainer.id
                                                                }
                                                                characterId={
                                                                    currentCharacter.id
                                                                }
                                                                activeCharacterId={
                                                                    activeId
                                                                }
                                                            />
                                                        );
                                                    }
                                                )}
                                            </SortableContext>
                                        </DroppableContainer>
                                    );
                                }
                            )}
                        </Stack>
                    </SortableContext>
                </PerfectScrollbar>
                <PerfectScrollbar
                    component="div"
                    style={{
                        paddingLeft: "16px",
                        paddingRight: "16px",
                        paddingBottom: "100px",
                    }}
                >
                    <Grid spacing={2} container>
                        {/* //Sortable Raids */}

                        <SortableContext
                            items={containers.raidsContainer.data}
                            strategy={strategy}
                        >
                            {containers.raidsContainer.data.map((raidId) => {
                                const currentRaid = containers[raidId];
                                return (
                                    <StyledRaidGridItem
                                        item
                                        key={currentRaid.id}
                                    >
                                        <DroppableContainer
                                            id={currentRaid.id}
                                            label={currentRaid.name}
                                            items={currentRaid.data}
                                            onRemove={() =>
                                                handleRemove(currentRaid.id)
                                            }
                                            type={currentRaid.type}
                                            activeId={activeId}
                                        >
                                            <SortableContext
                                                items={currentRaid.data}
                                                strategy={strategy}
                                            >
                                                {currentRaid.data.map(
                                                    (groupId) => {
                                                        const currentGroup =
                                                            containers[groupId];

                                                        return (
                                                            <DroppableContainer
                                                                key={
                                                                    currentGroup.id
                                                                }
                                                                id={
                                                                    currentGroup.id
                                                                }
                                                                label={
                                                                    currentGroup.name
                                                                }
                                                                items={
                                                                    currentGroup.data
                                                                }
                                                                onRemove={() =>
                                                                    handleRemove(
                                                                        currentGroup.id
                                                                    )
                                                                }
                                                                type={
                                                                    currentGroup.type
                                                                }
                                                                activeId={
                                                                    activeId
                                                                }
                                                            >
                                                                <SortableContext
                                                                    items={
                                                                        currentGroup?.data
                                                                    }
                                                                    strategy={
                                                                        strategy
                                                                    }
                                                                >
                                                                    {currentGroup?.data.map(
                                                                        (
                                                                            characterId
                                                                        ) => {
                                                                            const currentCharacter =
                                                                                containers[
                                                                                    characterId
                                                                                ];
                                                                            return (
                                                                                <SortableItem
                                                                                    key={
                                                                                        currentCharacter?.id
                                                                                    }
                                                                                    id={
                                                                                        currentCharacter?.id
                                                                                    }
                                                                                    containerId={
                                                                                        groupId
                                                                                    }
                                                                                    characterId={
                                                                                        currentCharacter.id
                                                                                    }
                                                                                    activeCharacterId={
                                                                                        activeId
                                                                                    }
                                                                                    raidId={
                                                                                        currentRaid.id
                                                                                    }
                                                                                />
                                                                            );
                                                                        }
                                                                    )}
                                                                </SortableContext>
                                                            </DroppableContainer>
                                                        );
                                                    }
                                                )}
                                            </SortableContext>
                                        </DroppableContainer>
                                    </StyledRaidGridItem>
                                );
                            })}
                        </SortableContext>
                    </Grid>
                </PerfectScrollbar>
            </StyledBox>
            {createPortal(
                <DragOverlay adjustScale={false}>
                    {activeId
                        ? isACharacter(activeId)
                            ? renderSortableItemDragOverlay(activeId)
                            : renderContainerDragOverlay(activeId)
                        : null}
                </DragOverlay>,
                document.body
            )}
        </>
    );

    function isACharacter(id) {
        return containers[id].type === "character";
    }

    function renderSortableItemDragOverlay(id) {
        return (
            <Item
                value={id}
                style={{
                    containerId: id,
                    overIndex: -1,

                    value: id,
                    isSorting: true,
                    isDragging: true,
                    isDragOverlay: true,
                }}
                dragOverlay={true}
                characterId={id}
                activeCharacter={activeId || null}
            />
        );
    }

    function renderContainerDragOverlay(containerId) {
        const currentContainer = containers[containerId];
        return (
            <Container
                label={currentContainer.name}
                shadow
                onRemove={() => {}}
                type={currentContainer.type}
                overlay={"overlay"}
                id={containerId}
            >
                {currentContainer.type === "category"
                    ? currentContainer.data.map((item) => {
                          const currentItem = containers[item];
                          return (
                              <Item
                                  key={currentItem.id}
                                  value={currentItem.id}
                                  style={{
                                      containerId,
                                      overIndex: -1,

                                      value: currentItem.id,
                                      isDragging: false,
                                      isSorting: false,
                                      isDragOverlay: false,
                                  }}
                                  characterId={currentItem.id}
                                  activeCharacterId={activeId}
                              />
                          );
                      })
                    : currentContainer.type === "raid"
                    ? currentContainer.data.map((group) => {
                          const currentGroup = containers[group];
                          return (
                              <Container
                                  label={currentGroup.name}
                                  shadow
                                  key={group}
                                  onRemove={() => {}}
                                  type={currentGroup.type}
                                  id={group}
                              >
                                  {currentGroup.data.map((item) => {
                                      const currentItem = containers[item];
                                      return (
                                          <Item
                                              key={currentItem.id}
                                              value={currentItem.id}
                                              style={{
                                                  containerId,
                                                  overIndex: -1,

                                                  value: currentItem.id,
                                                  isDragging: false,
                                                  isSorting: false,
                                                  isDragOverlay: false,
                                              }}
                                              characterId={currentItem.id}
                                              activeCharacterId={activeId}
                                          />
                                      );
                                  })}
                              </Container>
                          );
                      })
                    : currentContainer.type === "group"
                    ? currentContainer.data.map((item) => {
                          const currentItem = containers[item];
                          return (
                              <Item
                                  key={currentItem.id}
                                  value={currentItem.id}
                                  style={{
                                      containerId,
                                      overIndex: -1,

                                      value: currentItem.id,
                                      isDragging: false,
                                      isSorting: false,
                                      isDragOverlay: false,
                                  }}
                                  characterId={currentItem.id}
                                  activeCharacter={activeId}
                              />
                          );
                      })
                    : null}
            </Container>
        );
    }
});

RosterBuilderActual.displayName = "RosterBuilderActual";
export default RosterBuilderActual;
