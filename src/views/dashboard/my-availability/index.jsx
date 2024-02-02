import { Box, useTheme } from "@mui/material";
import Calendar from "./calendar";
import Loader from "../../../components/Loader";
import { useStore } from "../../../store";
import useUserInfo from "../../../hooks/useUserInfo";
import useGuild from "../../../hooks/useGuild";
import { useAllGuildInstanceLockouts } from "../../../hooks/useGuildInstanceLockout";
import { useAllGuildsRaids } from "../../../hooks/useRaids";
import usePlayerAvailability from "../../../hooks/player/availability/usePlayerAvailability";
import { useMemo } from "react";

export default function Availability() {
    const theme = useTheme();
    const user = useStore((state) => state.session.user);
    const userId = user.id;
    const discordName = user.user_metadata.name;

    const { players, isLoading, error } = useUserInfo(userId, discordName);
    const playerId = players[0].id;
    const { data: playerAvailability, isLoading: isLoadingPlayerAvailability } =
        usePlayerAvailability(playerId);
    const guildId = players[0].guild_id;
    const anyLoading =
        isLoading ||
        isLoadingPlayerAvailability ||
        !playerAvailability ||
        !players;

    if (anyLoading) return <Loader />;
    const availability = buildEvents(playerAvailability);

    function buildEvents(availability) {
        if (availability) {
            return availability.map((avail) => {
                const start = new Date(avail.start);
                const end = new Date(avail.end);

                return {
                    id: avail.id,
                    title: avail.notes || "Unavailable",
                    allDay: avail.is_all_day,
                    editable: true,
                    color: theme.palette.error.dark,
                    start,
                    end,
                };
            });
        }
        return [];
    }

    return (
        <Box
            sx={{
                height: "calc(100vh - 150px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box sx={{ flexGrow: 1, maxWidth: "950px" }}>
                <Calendar
                    availability={availability}
                    playerId={playerId}
                    userId={userId}
                    guildId={guildId}
                />
            </Box>
        </Box>
    );
}
