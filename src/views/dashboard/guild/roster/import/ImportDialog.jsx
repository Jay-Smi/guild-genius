import {
    Box,
    Chip,
    Dialog,
    Grid,
    Slide,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";
import { useState, forwardRef, useMemo, useCallback } from "react";
import TopBar from "./TopBar";
import ImportList from "./ImportList";
import PerfectScrollbar from "react-perfect-scrollbar";
import { gridSpacing } from "../../../../../store/constant";
import DiscordRoles from "./DiscordRoles";
import RoleMatch from "./RoleMatch";
import TagMatch from "./TagMatch";
import Controls from "./Controls";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ImportDialog({
    importData: initialData,
    isPlayers,
    open,
    handleClose,
}) {
    const theme = useTheme();

    const importData = useMemo(() => initialData, []);

    const [validationErrors, setValidationErrors] = useState({
        playersMissingRank: [...importData],
    });

    const paperProps = useMemo(
        () => ({
            style: {
                backgroundColor: theme.palette.background.dark3,
            },
        }),
        [theme.palette.background.dark3]
    );

    const [checked, setChecked] = useState(
        importData.map((obj) => obj.discord_name)
    );

    const [assignedRoles, setAssignedRoles] = useState({
        gm: [],
        officer: [],
        member: [],
        trial: [],
        tags: [],
    });

    const uniqueRoles = new Set();
    importData.forEach((obj) => {
        obj.roles
            .filter((role) => role.trim() !== "")
            .forEach((role) => {
                uniqueRoles.add(role);
            });
    });
    const roles = [...uniqueRoles];

    const checkValidation = useCallback(
        (props) => {
            const newChecked = props.checked || checked;
            const newRoles = props.roles || assignedRoles;
            const checkedPlayersWithoutRankAssigned = importData.filter(
                (player) => {
                    if (
                        newChecked.includes(player.discord_name) &&
                        player.roles.length > 0
                    ) {
                        const hasMatchingRole = player.roles.some((role) => {
                            return Object.values(newRoles)
                                .flat()
                                .includes(role);
                        });

                        return !hasMatchingRole;
                    }

                    return false;
                }
            );
            setValidationErrors((prev) => ({
                ...prev,
                playersMissingRank: checkedPlayersWithoutRankAssigned,
            }));
        },
        [importData, assignedRoles, checked]
    );

    const handleToggleChecked = useCallback(
        (discord_name) => {
            const currentIndex = checked.indexOf(discord_name);
            const newChecked = [...checked];

            if (currentIndex === -1) {
                newChecked.push(discord_name);
            } else {
                newChecked.splice(currentIndex, 1);
            }
            setChecked((oldChecked) => {
                checkValidation({ checked: newChecked });
                return newChecked;
            });
        },
        [checked, checkValidation]
    );

    const handleRoleChange = useCallback(
        (role, value) => {
            setAssignedRoles((prev) => {
                const updatedRoles = {
                    ...prev,
                    [role]: value,
                };
                checkValidation({ roles: updatedRoles, checked: checked });
                return updatedRoles;
            });
        },
        [checkValidation, checked]
    );

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            PaperProps={paperProps}
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <TopBar handleClose={handleClose} />
                </Grid>
                <Grid
                    item
                    xs={12}
                    sx={{
                        ml: "24px",
                    }}
                >
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={3}>
                            <ImportList
                                importData={importData}
                                checked={checked}
                                handleToggleChecked={handleToggleChecked}
                                validationErrors={validationErrors}
                            />
                        </Grid>
                        <Grid item xs={9}>
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={8}>
                                    <Grid container spacing={gridSpacing}>
                                        <Grid item xs={12}>
                                            <DiscordRoles roles={roles} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <RoleMatch
                                                roles={roles}
                                                assignedRoles={assignedRoles}
                                                handleRoleChange={
                                                    handleRoleChange
                                                }
                                                validationErrors={
                                                    validationErrors
                                                }
                                                setValidationErrors={
                                                    setValidationErrors
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TagMatch
                                                roles={roles}
                                                assignedRoles={assignedRoles}
                                                handleRoleChange={
                                                    handleRoleChange
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={4}>
                                    <Controls
                                        assignedRoles={assignedRoles}
                                        importData={importData}
                                        checked={checked}
                                        validationErrors={validationErrors}
                                        handleClose={handleClose}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Dialog>
    );
}

export default ImportDialog;
