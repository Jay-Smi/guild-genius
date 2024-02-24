import {
    Box,
    Button,
    Grid,
    Paper,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import Calendar from "./Calendar";
import { useStore } from "../../../../store";
import { gridSpacing } from "../../../../store/constant";

function CalendarIndex() {
    const theme = useTheme();
    const borderRadius = useStore((state) => state.borderRadius);
    const matchUpMd = useMediaQuery(theme.breakpoints.up("lg"));

    const CalendarComponent = (
        <Box
            sx={{
                width: "100%",
                maxWidth: "950px",
                backgroundColor: "transparent",
            }}
        >
            <Calendar />
        </Box>
    );

    //guild events / guild availability
    //filters

    const FilterSortComponent = (
        <Box
            sx={{
                width: "100%",
                height: matchUpMd ? "100%" : "50px",
                borderRadius: borderRadius / 2,
                backgroundColor: theme.palette.background.paper,
                padding: "24px",
            }}
        >
            <Button variant="contained" sx={{ width: "100%" }}>
                Swap
            </Button>
            <Button></Button>
        </Box>
    );

    return (
        <Grid container spacing={gridSpacing}>
            <Grid
                item
                xs={12}
                lg={10}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                {matchUpMd ? CalendarComponent : FilterSortComponent}
            </Grid>

            <Grid
                item
                xs={12}
                lg={2}
                sx={{ display: "flex", justifyContent: "center" }}
            >
                {matchUpMd ? FilterSortComponent : CalendarComponent}
            </Grid>
        </Grid>
    );
}

export default CalendarIndex;
