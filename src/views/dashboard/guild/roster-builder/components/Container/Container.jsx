import React, { forwardRef, useContext, useState } from "react";
import { classNames } from "../../../../../../utils/helpers.js";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";

import { Handle } from "../Handle.jsx";
import { Remove } from "../Remove.jsx";
import {
    StyledContainer,
    StyledRaid,
    StyledGroup,
    StyledCategory,
    StyledActions,
    StyledContainerHeader,
    StyledDragHandle,
    StyledLabel,
} from "./Container.styles.jsx";
import {
    Badge,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import EditAttributesIcon from "@mui/icons-material/EditAttributes";
import { RosterContext } from "../../store/RosterContextProvider.jsx";
import { useStore } from "zustand";

const Container = forwardRef(
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
        const as = onClick ? "button" : "div";
        const [isOpen, setIsOpen] = useState(true);
        const Component =
            type === "raid"
                ? StyledRaid
                : type === "group"
                ? StyledGroup
                : StyledCategory;
        const [tagDialogOpen, setTagDialogOpen] = useState(false);

        const rosterStore = useContext(RosterContext);
        const containers = useStore(rosterStore, (state) => state.containers);
        const tags = useStore(rosterStore, (state) => state.tags);
        const setContainers = useStore(
            rosterStore,
            (state) => state.setContainers
        );
        const container = containers.find((container) => container.id === id);
        const categories = useStore(rosterStore, (state) => state.categories);
        const tagsArray = [...tags, "Tanks", "Healers", "Melee", "Ranged"];

        const tagFormInitialState = {};
        tagsArray.forEach((tag) => {
            tagFormInitialState[tag] = {
                checked: false,
                amount: undefined,
            };
        });
        const [tagForm, setTagForm] = useState(tagFormInitialState);

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

        function handleSaveTagForm() {
            const newContainers = [...containers];
            const raidContainer = newContainers.find(
                (container) => container.id === id
            );
            const raidTags = Object.keys(tagForm)
                .filter((tag) => tagForm[tag].checked)
                .map((tag) => {
                    return { tag: tag, amount: tagForm[tag].amount };
                });
            raidContainer.tags = raidTags;
            setContainers(newContainers);
            handleCloseDialog();
        }

        function handleRemoveTag(tag) {
            const newContainers = [...containers];
            const raidContainer = newContainers.find(
                (container) => container.id === id
            );
            const raidTags = raidContainer.tags.filter((t) => t.tag !== tag);
            raidContainer.tags = raidTags;
            setContainers(newContainers);
        }

        function toggleOpen() {
            setIsOpen((isOpen) => !isOpen);
        }

        function handleClickOpenDialog() {
            setTagDialogOpen(true);
        }
        function handleCloseDialog() {
            setTagDialogOpen(false);
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
            >
                {label ? (
                    <Box className="containerHeader">
                        <StyledDragHandle
                            className={`handle ${overlay ? "" : "overlay"}`}
                        >
                            <Handle {...handleProps} overlay={overlay} />
                        </StyledDragHandle>
                        <StyledLabel>{label}</StyledLabel>

                        {type === "raid" && (
                            <>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    divider={
                                        <Divider
                                            orientation="vertical"
                                            flexItem
                                        />
                                    }
                                >
                                    {container.tags &&
                                        container.tags.length > 0 &&
                                        container.tags.map((tag) => {
                                            return (
                                                <Badge
                                                    key={tag.tag}
                                                    badgeContent={Number(
                                                        tag.amount
                                                    )}
                                                    color="secondary"
                                                >
                                                    <Chip
                                                        label={tag.tag}
                                                        size="small"
                                                        onDelete={() =>
                                                            handleRemoveTag(
                                                                tag.tag
                                                            )
                                                        }
                                                    />
                                                </Badge>
                                            );
                                        })}
                                </Stack>
                                <Dialog
                                    open={tagDialogOpen}
                                    onClose={handleCloseDialog}
                                >
                                    <DialogTitle
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            fontSize: "1.5em",
                                        }}
                                    >
                                        {container.name}
                                    </DialogTitle>
                                    <Divider sx={{ mb: 2 }} />
                                    <DialogContent>
                                        <DialogContentText>
                                            Set the number of tags (0 for
                                            exclusive) to control raid
                                            composition.
                                        </DialogContentText>
                                        <Divider sx={{ mt: 2, mb: 2 }} />
                                        <Stack spacing={1}>
                                            {tagsArray.map((tag) => {
                                                return (
                                                    <Grid container key={tag}>
                                                        <Grid
                                                            item
                                                            xs={5}
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent:
                                                                    "center",
                                                                alignItems:
                                                                    "center",
                                                            }}
                                                        >
                                                            <Typography>
                                                                {tag}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            xs={2}
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent:
                                                                    "center",
                                                                alignItems:
                                                                    "center",
                                                            }}
                                                        >
                                                            <Switch
                                                                checked={
                                                                    tagForm[tag]
                                                                        .checked
                                                                }
                                                                onChange={() =>
                                                                    handleToggleChecked(
                                                                        tag
                                                                    )
                                                                }
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            xs={5}
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent:
                                                                    "center",
                                                                alignItems:
                                                                    "center",
                                                            }}
                                                        >
                                                            <TextField
                                                                sx={{
                                                                    width: "50%",
                                                                }}
                                                                inputProps={{
                                                                    sx: {
                                                                        textAlign:
                                                                            "center",
                                                                    },
                                                                }}
                                                                value={
                                                                    tagForm[tag]
                                                                        .amount ??
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleSetValue(
                                                                        tag,
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                disabled={
                                                                    !tagForm[
                                                                        tag
                                                                    ].checked
                                                                }
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                );
                                            })}
                                        </Stack>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleCloseDialog}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleSaveTagForm}>
                                            Save
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </>
                        )}
                        {type === "raid" && (
                            <SpeedDial
                                ariaLabel="SpeedDial openIcon "
                                icon={<SpeedDialIcon />}
                                sx={{
                                    position: "fixed",
                                    transform: "translate(80px, 65px)",
                                }}
                                FabProps={{
                                    sx: { width: "32px", height: "30px" },
                                }}
                                direction="down"
                            >
                                <SpeedDialAction
                                    icon={
                                        <EditAttributesIcon
                                            onClick={handleClickOpenDialog}
                                        />
                                    }
                                    tooltipTitle="Edit Tags"
                                />
                                {onRemove ? (
                                    <SpeedDialAction
                                        icon={<DeleteIcon onClick={onRemove} />}
                                        tooltipTitle="Delete Raid"
                                    />
                                ) : null}
                            </SpeedDial>
                        )}

                        <StyledActions className="buttons">
                            {isOpen ? (
                                <IconButton onClick={toggleOpen}>
                                    <KeyboardDoubleArrowUpIcon />
                                </IconButton>
                            ) : (
                                <IconButton onClick={toggleOpen}>
                                    <KeyboardDoubleArrowDownIcon />
                                </IconButton>
                            )}
                        </StyledActions>
                    </Box>
                ) : null}
                {isOpen && <ul>{children}</ul>}
            </Component>
        );
    }
);

export default Container;

Container.displayName = "Container";
