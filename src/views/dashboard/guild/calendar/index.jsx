import {
    Box,
    Button,
    Grid,
    Paper,
    useMediaQuery,
    useTheme,
    Typography,
} from "@mui/material";
import Calendar from "./Calendar";
import { useStore } from "../../../../store";
import { gridSpacing } from "../../../../store/constant";
import useUserInfo from "../../../../hooks/useUserInfo";
import useGuild from "../../../../hooks/useGuild";
import { useAllGuildInstanceLockouts } from "../../../../hooks/useGuildInstanceLockout";
import { useAllGuildsRaids } from "../../../../hooks/useRaids";

import Loader from "../../../../components/Loader";
import { useState } from "react";
import usePlayerAvailability from "../../../../hooks/player/availability/usePlayerAvailability";
import useGuildAvailability from "../../../../hooks/player/availability/useGuildAvailability";
import useAllGuildsPlayers from "../../../../hooks/player/useAllGuildsPlayers";

function CalendarIndex() {
    const theme = useTheme();
    const borderRadius = useStore((state) => state.borderRadius);
    const matchUpMd = useMediaQuery(theme.breakpoints.up("lg"));
    const [isGuildEvents, setIsGuildEvents] = useState(true);
    const user = useStore((state) => state.session.user);
    const userId = user.id;
    const discordName = user.user_metadata.name;
    const { characters, players, profile, isLoading } = useUserInfo(
        userId,
        discordName
    );
    const activePlayer = players?.find(
        (player) => player.id === profile[0].active_player_id
    );
    const userRank = activePlayer?.guild_rank;

    const mainGuildId = activePlayer?.guild_id;
    const { guild, isLoadingGuild, errorGuild } = useGuild(mainGuildId);
    const {
        lockouts: allGuildInstanceLockouts,
        lockoutsError,
        isLoadingLockouts,
    } = useAllGuildInstanceLockouts(mainGuildId);
    const { raids, raidsError, isLoadingRaids } =
        useAllGuildsRaids(mainGuildId);
    const {
        data: playerUnavailability,
        isLoading: isLoadingPlayerUnavailability,
    } = useGuildAvailability(mainGuildId);
    const { guildPlayers, isLoadingPlayers, errorPlayers } =
        useAllGuildsPlayers(mainGuildId);

    const anyLoading =
        isLoading ||
        isLoadingGuild ||
        isLoadingRaids ||
        isLoadingPlayerUnavailability ||
        isLoadingPlayers ||
        !guildPlayers ||
        !playerUnavailability ||
        !raids ||
        !allGuildInstanceLockouts ||
        !guild;
    if (!isLoading && !mainGuildId)
        return <Typography>Join a guild to see the calendar</Typography>;
    if (anyLoading) return <Loader />;
    const guildEvents = raids.map((raid) => {
        const raidLockout = allGuildInstanceLockouts.find(
            (lockout) => lockout.id === raid.guild_instance_lockout_id
        );
        return {
            id: raid.id,
            title: raid.name + " " + raidLockout.instance_name,
            date: raid.date,
            time: raid.time,
        };
    });

    const unavailEvents = playerUnavailability.map((unavail) => {
        const player = guildPlayers.find(
            (player) => player.id === unavail.player_id
        );
        return {
            id: unavail.id,
            title: player.player_name,
            start: unavail.start,
            end: unavail.end,
            allDay: unavail.is_all_day,
            daysOfWeek: unavail.days_of_week,
            notes: unavail.notes || "Unavailable",
        };
    });

    const CalendarComponent = (
        <Box
            sx={{
                width: "100%",
                maxWidth: "950px",
                backgroundColor: "transparent",
            }}
        >
            <Calendar events={isGuildEvents ? guildEvents : unavailEvents} />
        </Box>
    );

    //guild events / guild availability
    //filters

    const FilterSortComponent =
        userRank <= 5 ? (
            <Box
                sx={{
                    width: "100%",
                    height: matchUpMd ? "100%" : "50px",
                    borderRadius: borderRadius / 2,
                    backgroundColor: theme.palette.background.paper,
                    padding: "24px",
                }}
            >
                <Typography variant="h6" align="center" gutterBottom>
                    {isGuildEvents ? "Guild Events" : "Guild Unavailability"}
                </Typography>
                <Button
                    variant="contained"
                    sx={{ width: "100%" }}
                    onClick={toggleEvents}
                >
                    Swap
                </Button>
            </Box>
        ) : null;

    function toggleEvents() {
        setIsGuildEvents(!isGuildEvents);
    }

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
