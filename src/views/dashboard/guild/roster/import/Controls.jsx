import {
    Box,
    Button,
    Divider,
    List,
    ListItem,
    Stack,
    Typography,
    styled,
    useTheme,
} from "@mui/material";
import { useStore } from "../../../../../store";
import { memo, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import useCreateGuildPlayers from "../../../../../hooks/player/useCreateGuildPlayers";
import toast from "react-hot-toast";

const StyledList = styled(List)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    padding: 0,
    paddingBottom: "50px",
}));

const StyledListItem = styled(ListItem, {
    shouldForwardProp: (prop) => prop !== "index",
})(({ theme, index }) => ({
    backgroundColor:
        index % 2 === 0
            ? theme.palette.background.dark2
            : theme.palette.background.dark1,
}));

const Controls = memo(
    ({ assignedRoles, importData, checked, validationErrors, handleClose }) => {
        const theme = useTheme();

        const borderRadius = useStore((state) => state.borderRadius);

        const { playersMissingRank } = validationErrors;

        const isError = playersMissingRank.length > 0;

        const { mutateAsync: createPlayers } = useCreateGuildPlayers();

        async function handleImport() {
            const checkedPlayers = importData.filter((player) =>
                checked.includes(player.discord_name)
            );
            const playersWithRank = checkedPlayers.map((player) => {
                const playerRank = getPlayersRank(player);
                const newPlayer = { ...player, guild_rank: playerRank };
                const { roles, ...rest } = newPlayer;
                return rest;
            });
            try {
                const creating = await createPlayers(playersWithRank, {
                    onSuccess: () => handleClose(),
                });
                const promise = new Promise((resolve, reject) => {
                    if (creating.error) {
                        reject(creating.error);
                    } else {
                        resolve(creating.data);
                    }
                });

                toast.promise(promise, {
                    loading: "Creating players...",
                    success: "Players created",
                    error: "Failed to create players",
                });
            } catch (e) {
                console.error(e);
                toast.error("Failed to create players");
            }
        }

        function getPlayersRank(player) {
            if (player.roles.some((role) => assignedRoles.gm.includes(role))) {
                return 0;
            } else if (
                player.roles.some((role) =>
                    assignedRoles.officer.includes(role)
                )
            ) {
                return 5;
            } else if (
                player.roles.some((role) => assignedRoles.member.includes(role))
            ) {
                return 10;
            } else if (
                player.roles.some((role) => assignedRoles.trial.includes(role))
            ) {
                return 15;
            } else {
                console.warn("Player missing rank", player.discord_name);
                return 15;
            }
        }
        return (
            <Box
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: borderRadius / 2,
                    p: 2,
                    pt: 3,
                    mr: "24px",
                    height: "100%",
                    boxShadow: "1px 7px 8px 4px rgb(0 0 0 / 40%)",
                }}
            >
                <Stack
                    spacing={3}
                    sx={{
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={handleImport}
                        disabled={playersMissingRank.length !== 0}
                    >
                        Import Selected
                    </Button>
                    <Divider />
                    <Box
                        sx={{
                            borderRadius: borderRadius / 2,
                            border: `1px solid ${
                                isError
                                    ? theme.palette.error.main
                                    : theme.palette.success.main
                            }`,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography variant="h4" align="center" sx={{ pt: 2 }}>
                            Errors
                        </Typography>
                        <Box>
                            <Typography
                                variant="body1"
                                align="center"
                                sx={{ pb: 1 }}
                            >
                                {isError
                                    ? `Players missing rank: ${playersMissingRank.length}`
                                    : "No errors found"}
                            </Typography>
                            <Box
                                sx={{
                                    height: "400px",
                                    overflow: "hidden",
                                    borderRadius: borderRadius / 2,
                                }}
                            >
                                <PerfectScrollbar component="div">
                                    <StyledList>
                                        {playersMissingRank.map(
                                            (player, index) => (
                                                <StyledListItem
                                                    key={player.discord_name}
                                                    index={index}
                                                >
                                                    {player.discord_name}
                                                </StyledListItem>
                                            )
                                        )}
                                    </StyledList>
                                </PerfectScrollbar>
                            </Box>
                        </Box>
                    </Box>
                </Stack>
            </Box>
        );
    }
);

Controls.displayName = "Controls";

export default Controls;
