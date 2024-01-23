import { Box, Button, Grid, Typography } from "@mui/material";
import { useContext } from "react";
import { RosterContext } from "../../store/RosterContextProvider";
import { useStore } from "zustand";

export default function RosterSettings() {
    const rosterStore = useContext(RosterContext);
    const charactersLength = useStore(
        rosterStore,
        (state) => state.characters.length
    );
    const selectedLockoutsLength = useStore(
        rosterStore,
        (state) => state.chosenLockouts.length
    );
    const raids = useStore(rosterStore, (state) =>
        state.containers.filter((container) => container.type === "raid")
    );
    const containers = useStore(rosterStore, (state) => state.containers);
    const setContainers = useStore(rosterStore, (state) => state.setContainers);

    function handleAddRaid() {
        const newRaidId = crypto.randomUUID();
        const newGroup1Id = crypto.randomUUID();
        const newGroup2Id = crypto.randomUUID();
        const newContainers = [
            ...containers,
            {
                id: newRaidId,
                type: "raid",
                data: [newGroup1Id, newGroup2Id],
                name: "New Raid",
            },
            {
                id: newGroup1Id,
                type: "group",
                data: [],
                name: "Group 1",
            },
            {
                id: newGroup2Id,
                type: "group",
                data: [],
                name: "Group 2",
            },
        ];
        newContainers
            .find((container) => container.id === "raidsContainer")
            .data.push(newRaidId);
        setContainers(newContainers);
    }
    return (
        <Box
            sx={{
                maxWidth: "300px",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Typography variant="subtitle1">
                            Characters: {charactersLength}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Typography variant="subtitle1">
                            Raids: {raids.length}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddRaid}
                        sx={{ width: "100%" }}
                    >
                        Add Raid
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row-reverse",
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => console.log("clicked")}
                            sx={{ width: "100%" }}
                        >
                            Import Lockout
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => console.log("clicked")}
                        sx={{ width: "100%" }}
                    >
                        Auto Fill
                    </Button>
                </Grid>
                {/* <Grid item xs={6}></Grid> */}
                <Grid item xs={12}>
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row-reverse",
                        }}
                    >
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => console.log("clicked")}
                            sx={{ width: "100%" }}
                        >
                            {selectedLockoutsLength > 2
                                ? "Save Lockouts"
                                : "Save Lockout"}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
