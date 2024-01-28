import { forwardRef, memo, useContext, useMemo, useState } from "react";
import { classNames } from "../../../../../../utils/helpers.js";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { Handle } from "../Handle.jsx";
import {
    StyledRaid,
    StyledGroup,
    StyledCategory,
    StyledDragHandle,
} from "./Container.styles.jsx";
import {
    Badge,
    Box,
    ButtonGroup,
    Chip,
    Divider,
    Grid,
    IconButton,
    Stack,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import { RosterContext } from "../../store/RosterContextProvider.jsx";
import { useStore } from "zustand";
import RaidContainerButtons from "./RaidContainerButtons.jsx";
import NonCategoryContainerButtons from "./NonCategoryContainerButtons.jsx";
import RaidTagForm from "./RaidTagForm.jsx";
import dayjs from "dayjs";

const Container = memo(
    forwardRef(
        (
            {
                children,
                handleProps,
                onClick,
                onRemove,
                label,
                style,
                shadow,
                type,
                overlay,
                id,
                ...props
            },
            ref
        ) => {
            const theme = useTheme();
            const as = onClick ? "button" : "div";
            const [isOpen, setContainerIsOpen] = useState(true);
            const Component =
                type === "raid"
                    ? StyledRaid
                    : type === "group"
                    ? StyledGroup
                    : StyledCategory;
            const [tagDialogOpen, setTagDialogOpen] = useState(false);

            const rosterStore = useContext(RosterContext);
            const selectedTab = useStore(
                rosterStore,
                (state) => state.selectedTab
            );
            const chosenLockouts = useStore(
                rosterStore,
                (state) => state.chosenLockouts
            );
            const tags = useStore(rosterStore, (state) => state.tags);
            const storeContainers = useStore(
                rosterStore,
                (state) => state.containers
            );
            const setStoreContainers = useStore(
                rosterStore,
                (state) => state.setContainers
            );

            const tabsContainers = useStore(
                rosterStore,
                (state) => state.tabsContainers
            );
            const setTabContainer = useStore(
                rosterStore,
                (state) => state.setTabContainer
            );
            const lockoutsIndex = chosenLockouts[selectedTab].id;
            const containers =
                selectedTab === 0
                    ? storeContainers
                    : tabsContainers[lockoutsIndex];

            const setContainers = useMemo(
                () =>
                    selectedTab === 0
                        ? setStoreContainers
                        : (container) =>
                              setTabContainer(lockoutsIndex, container),
                [
                    selectedTab,
                    setStoreContainers,
                    setTabContainer,
                    lockoutsIndex,
                ]
            );

            const container = containers.find(
                (container) => container.id === id
            );
            const categories = useStore(
                rosterStore,
                (state) => state.categories
            );
            const tagsArray = [...tags, "Tanks", "Healers", "Melee", "Ranged"];
            const [popperAnchor, setPopperAnchor] = useState(null);
            const anchorOpen = Boolean(popperAnchor);
            const popperId = anchorOpen ? "delete-popover" : undefined;

            const tagFormInitialState = {};
            tagsArray.forEach((tag) => {
                tagFormInitialState[tag] = {
                    checked: false,
                    amount: undefined,
                };
            });
            const [tagForm, setTagForm] = useState(tagFormInitialState);

            let raidsCharacters = null;
            let raidsGroups = null;
            if (container.type === "raid") {
                raidsGroups = containers.filter(
                    (c) => c.type === "group" && container.data.includes(c.id)
                );
                raidsCharacters = raidsGroups
                    .map((group) => {
                        return containers
                            .filter(
                                (c) =>
                                    c.type === "character" &&
                                    group.data.includes(c.id)
                            )
                            .flat();
                    })
                    .flat();
            }

            const raidContainsDuplicatePlayer = raidsCharacters?.some(
                (character) => {
                    return (
                        raidsCharacters.filter(
                            (c) => c.player_id === character.player_id
                        ).length > 1
                    );
                }
            );

            const raidErrors = [];
            if (raidContainsDuplicatePlayer)
                raidErrors.push("Duplicate Player");

            const handleToggleChecked = (tag) => {
                setTagForm((prevState) => ({
                    ...prevState,
                    [tag]: {
                        ...prevState[tag],
                        checked: !prevState[tag].checked,
                    },
                }));
            };

            const handleSetValue = (tag, amount) => {
                if (isNaN(Number(amount))) return;

                setTagForm((prevState) => ({
                    ...prevState,
                    [tag]: {
                        ...prevState[tag],
                        amount,
                    },
                }));
            };

            function handleClickPopper(event) {
                setPopperAnchor(event.currentTarget);
            }

            function handleClosePopper() {
                setPopperAnchor(null);
            }

            function handleSaveTagForm() {
                const newContainers = containers.map((container) =>
                    container.id === id
                        ? {
                              ...container,
                              tags: Object.keys(tagForm)
                                  .filter((tag) => tagForm[tag].checked)
                                  .map((tag) => ({
                                      tag: tag,
                                      amount: tagForm[tag].amount || null,
                                  })),
                          }
                        : container
                );

                setContainers(newContainers);
                handleCloseDialog();
            }

            function handleRemoveTag(tag) {
                const newContainers = containers.map((container) =>
                    container.id === id
                        ? {
                              ...container,
                              tags: container.tags.filter((t) => t.tag !== tag),
                          }
                        : container
                );

                setContainers(newContainers);
            }

            function toggleOpenContainer() {
                setContainerIsOpen((isOpen) => !isOpen);
            }

            function handleClickOpenDialog() {
                setTagDialogOpen(true);
            }
            function handleCloseDialog() {
                setTagDialogOpen(false);
            }
            function handleAddGroup() {
                const groupId = crypto.randomUUID();

                // Create a new array with the added group
                const newContainers = containers.map((container) =>
                    container.id === id
                        ? {
                              ...container,
                              data: [...container.data, groupId],
                          }
                        : container
                );

                const groupsLength = newContainers.find((c) =>
                    c.data?.includes(groupId)
                ).data.length;

                newContainers.push({
                    id: groupId,
                    type: "group",
                    name: `Group ${groupsLength}`,
                    data: [],
                });
                // Update state with the modified newContainers array
                setContainers(newContainers);
            }

            return (
                <Component
                    {...props}
                    ref={ref}
                    style={style}
                    className={classNames(shadow)}
                    onClick={onClick}
                    tabIndex={onClick ? 0 : undefined}
                    as={as}
                    open={isOpen}
                    type={type}
                    mode={theme.palette.mode}
                >
                    <Box className="containerHeader">
                        <StyledDragHandle
                            className={`handle ${overlay ? "" : "overlay"}`}
                        >
                            <Handle {...handleProps} overlay={overlay} />
                        </StyledDragHandle>
                        {type !== "raid" && (
                            <Typography
                                variant="h4"
                                color={
                                    theme.palette.mode === "dark"
                                        ? theme.palette.text.dark
                                        : theme.palette.text.secondary
                                }
                            >
                                {label}
                            </Typography>
                        )}
                        <ButtonGroup
                            aria-label="outlined primary button group"
                            size="small"
                            spacing={2}
                        >
                            {type === "raid" && (
                                <RaidContainerButtons
                                    handleAddGroup={handleAddGroup}
                                    handleClickOpenDialog={
                                        handleClickOpenDialog
                                    }
                                    type={type}
                                    id={id}
                                />
                            )}
                            {type !== "category" && (
                                <NonCategoryContainerButtons
                                    type={type}
                                    handleClickPopper={handleClickPopper}
                                    handleClosePopper={handleClosePopper}
                                    popperId={popperId}
                                    anchorOpen={anchorOpen}
                                    popperAnchor={popperAnchor}
                                    onRemove={onRemove}
                                />
                            )}

                            <Tooltip
                                title={
                                    type === "raid"
                                        ? "Collapse Raid"
                                        : type === "group"
                                        ? "Collapse Group"
                                        : isOpen
                                        ? "Collapse Category"
                                        : "Expand Category"
                                }
                            >
                                <IconButton
                                    onClick={toggleOpenContainer}
                                    size="small"
                                    sx={{ borderRadius: 1 }}
                                >
                                    {isOpen ? (
                                        <KeyboardDoubleArrowUpIcon
                                            sx={{
                                                width: "22px",
                                                color:
                                                    theme.palette.mode ===
                                                    "dark"
                                                        ? theme.palette.text
                                                              .dark
                                                        : theme.palette
                                                              .grey[500],
                                            }}
                                        />
                                    ) : (
                                        <KeyboardDoubleArrowDownIcon
                                            sx={{
                                                width: "22px",
                                                color:
                                                    theme.palette.mode ===
                                                    "dark"
                                                        ? theme.palette.text
                                                              .dark
                                                        : theme.palette
                                                              .grey[500],
                                            }}
                                        />
                                    )}
                                </IconButton>
                            </Tooltip>
                        </ButtonGroup>
                    </Box>
                    {type === "raid" && (
                        <Grid container>
                            <Grid item xs={4} textAlign="center">
                                <Typography
                                    variant="subtitle1"
                                    color={
                                        theme.palette.mode === "dark"
                                            ? theme.palette.text.dark
                                            : theme.palette.text.secondary
                                    }
                                >
                                    {container.date &&
                                        dayjs(container.date).format(
                                            "ddd MMM DD"
                                        )}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography
                                    variant="subtitle1"
                                    textAlign="center"
                                    color={
                                        theme.palette.mode === "dark"
                                            ? theme.palette.text.dark
                                            : theme.palette.text.secondary
                                    }
                                >
                                    {container.name}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography
                                    variant="subtitle1"
                                    textAlign="center"
                                    color={
                                        theme.palette.mode === "dark"
                                            ? theme.palette.text.dark
                                            : theme.palette.text.secondary
                                    }
                                >
                                    {container.time}
                                </Typography>
                            </Grid>
                        </Grid>
                    )}
                    {type === "raid" && raidErrors.length > 0 && (
                        <Stack
                            direction="row"
                            spacing={1}
                            divider={
                                <Divider orientation="vertical" flexItem />
                            }
                            sx={{
                                p: 2,
                                flexWrap: "wrap",
                                justifyContent: "center",
                                width: "100%",
                            }}
                        >
                            {raidErrors.map((error) => {
                                return (
                                    <Chip
                                        key={error}
                                        label={error}
                                        size="small"
                                        color="error"
                                    />
                                );
                            })}
                        </Stack>
                    )}
                    {isOpen && <ul>{children}</ul>}

                    {/* RAID TAG CHIPS */}

                    {type === "raid" && (
                        <>
                            <Stack
                                direction="row"
                                spacing={1}
                                divider={
                                    <Divider orientation="vertical" flexItem />
                                }
                                sx={{
                                    p: 2,
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                    width: "100%",
                                }}
                            >
                                {container?.tags &&
                                    container.tags?.length > 0 &&
                                    container.tags?.map((tag) => {
                                        return (
                                            <Badge
                                                key={tag.tag}
                                                badgeContent={Number(
                                                    tag.amount
                                                )}
                                                color="secondary"
                                                sx={{ pb: 1 }}
                                            >
                                                <Chip
                                                    label={tag.tag}
                                                    size="small"
                                                    onDelete={() =>
                                                        handleRemoveTag(tag.tag)
                                                    }
                                                />
                                            </Badge>
                                        );
                                    })}
                            </Stack>
                            <RaidTagForm
                                container={container}
                                tagDialogOpen={tagDialogOpen}
                                handleCloseDialog={handleCloseDialog}
                                tagForm={tagForm}
                                handleToggleChecked={handleToggleChecked}
                                handleSetValue={handleSetValue}
                                handleSaveTagForm={handleSaveTagForm}
                                tagsArray={tagsArray}
                            />
                        </>
                    )}
                </Component>
            );
        }
    )
);

export default Container;

Container.displayName = "Container";
