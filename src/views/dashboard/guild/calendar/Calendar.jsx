import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useStore } from "../../../../store";
import useUserInfo from "../../../../hooks/useUserInfo";
import useGuild from "../../../../hooks/useGuild";
import { useAllGuildsRaids } from "../../../../hooks/useRaids";
import { useAllGuildInstanceLockouts } from "../../../../hooks/useGuildInstanceLockout";
import Loader from "../../../../components/Loader";

export default function Calendar() {
    const user = useStore((state) => state.session.user);
    const userId = user.id;
    const discordName = user.user_metadata.name;

    const { profile, characters, players, isLoading, error } = useUserInfo(
        userId,
        discordName
    );
    const mainCharacterId = players[0].main_character || characters[0]?.id;
    const mainCharacter = characters.find(
        (character) => character.id === mainCharacterId
    );
    const mainGuildId = mainCharacter?.guild_id;
    const { guild, isLoadingGuild, errorGuild } = useGuild(mainGuildId);
    const {
        lockouts: allGuildInstanceLockouts,
        lockoutsError,
        isLoadingLockouts,
    } = useAllGuildInstanceLockouts(mainGuildId);
    const { raids, raidsError, isLoadingRaids } =
        useAllGuildsRaids(mainGuildId);

    const anyLoading =
        isLoading ||
        isLoadingGuild ||
        isLoadingRaids ||
        !raids ||
        !allGuildInstanceLockouts ||
        !guild;
    if (anyLoading) return <Loader />;
    const events = raids.map((raid) => {
        const raidLockout = allGuildInstanceLockouts.find(
            (lockout) => lockout.id === raid.guild_instance_lockout_id
        );
        return {
            title: raid.name + " " + raidLockout.instance_name,
            date: raid.date,
        };
    });
    return (
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            initialView="dayGridMonth"
            events={events}
        />
    );
}
