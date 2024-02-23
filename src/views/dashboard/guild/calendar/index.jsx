import { Box, Grid, Paper, useTheme } from "@mui/material";
import Calendar from "./Calendar";
import { useStore } from "../../../../store";

function CalendarIndex() {
    const theme = useTheme();
    const borderRadius = useStore((state) => state.borderRadius);
    return (
        <Grid container sx={{ position: "relative" }}>
            <Grid
                item
                xs={9}
                sx={{ display: "flex", justifyContent: "center" }}
            >
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "1000px",
                    }}
                >
                    <Calendar />
                </Box>
            </Grid>

            <Grid
                item
                xs={3}
                sx={{ display: "flex", justifyContent: "center" }}
            >
                <Box
                    sx={{
                        width: "100%",
                        height: "100%",
                        borderRadius: borderRadius / 2,
                        backgroundColor: theme.palette.background.paper,
                    }}
                ></Box>
            </Grid>
        </Grid>
    );
}

export default CalendarIndex;
