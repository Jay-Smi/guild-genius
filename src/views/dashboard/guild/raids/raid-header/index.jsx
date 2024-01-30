import { Box, Grid, Typography, useTheme } from "@mui/material";
import { format, parseISO, startOfDay } from "date-fns";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import dayjs from "dayjs";
import { useAutoAnimate } from "@formkit/auto-animate/react";

function RaidHeader({ raid, raidOpen, borderRadius }) {
    const theme = useTheme();
    const time = raid.time.split(":");
    const raidTime = dayjs().hour(time[0]).minute(time[1]).second(0);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                backgroundColor:
                    theme.palette.mode === "dark"
                        ? theme.palette.background.paper
                        : theme.palette.grey[500],
                color:
                    theme.palette.mode === "dark"
                        ? theme.palette.text.dark
                        : theme.palette.grey[500],
                p: 2,
                pl: 3,
                pr: 3,
                borderTopLeftRadius: borderRadius * 2,
                borderTopRightRadius: borderRadius * 2,
                borderBottomLeftRadius: raidOpen ? 0 : borderRadius * 2,
                borderBottomRightRadius: raidOpen ? 0 : borderRadius * 2,
                borderBottom: raidOpen
                    ? `1px solid ${theme.palette.grey[500]}`
                    : "none",
            }}
        >
            <Typography variant="h4" color="inherit">
                {raid.name}
            </Typography>
            <Typography variant="h4" color="inherit">
                {dayjs(raid.date).format("ddd MMM DD")}
            </Typography>
            <Typography variant="h4" color="inherit">
                {raidTime.format("h:mm A")}
            </Typography>

            {raidOpen ? (
                <KeyboardDoubleArrowUpIcon />
            ) : (
                <KeyboardDoubleArrowDownIcon />
            )}
        </Box>
    );
}

export default RaidHeader;
