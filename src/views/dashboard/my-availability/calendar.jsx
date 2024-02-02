import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useMemo } from "react";
import useCreatePlayerAvailability from "../../../hooks/player/availability/useCreatePlayerAvailability";

export default function Calendar({ availability, playerId, userId, guildId }) {
    const { mutate: createAvailability } = useCreatePlayerAvailability();

    return (
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={availability}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            themeSystem="cyborg"
            initialView="dayGridMonth"
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventAdd={handleEventAdd}
            eventChange={handleEventChange}
            eventRemove={handleEventRemove}
        />
    );

    function handleDateSelect(selectInfo) {
        const calendarApi = selectInfo.view.calendar;
        calendarApi.unselect();

        const newAvailability = {
            start: selectInfo.start.toISOString(),
            end: selectInfo.end.toISOString(),
            is_all_day: selectInfo.allDay,
            player_id: playerId,
            user_id: userId,
            guild_id: guildId,
        };
        createAvailability(newAvailability);
    }

    function handleEventClick(clickInfo) {
        if (
            confirm(
                `Are you sure you want to delete the event '${clickInfo.event.title}'`
            )
        ) {
            // clickInfo.event.remove();
        }
    }

    // function handleDates(rangeInfo) {
    //     prompt("handleDates", rangeInfo);
    // }

    function handleEventAdd(addInfo) {
        prompt("handleEventAdd", addInfo);
    }

    function handleEventChange(changeInfo) {
        prompt("handleEventChange", changeInfo);
    }

    function handleEventRemove(removeInfo) {
        prompt("handleEventRemove", removeInfo);
    }

    function renderEventContent(eventInfo) {
        return (
            <>
                <b>{eventInfo.timeText}</b>
                <i>{eventInfo.event.title}</i>
            </>
        );
    }
}
