import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useMemo, useState } from "react";
import useCreatePlayerAvailability from "../../../hooks/player/availability/useCreatePlayerAvailability";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import { eachDayOfInterval } from "date-fns";
import CalendarDialog from "./CalendarDialog";
import useDeletePlayerAvailability from "../../../hooks/player/availability/useDeletePlayerAvailability";

export default function Calendar({ availability, playerId, userId, guildId }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState({
        notes: "",
        repeating: false,
    });
    const [dialogType, setDialogType] = useState("create");
    const [eventToDelete, setEventToDelete] = useState({});

    const [newAvailability, setNewAvailability] = useState({});

    const { mutate: createAvailability } = useCreatePlayerAvailability();
    const { mutate: deleteAvailability } = useDeletePlayerAvailability();

    function handleClose() {
        setDialogOpen(false);
        setNewAvailability({});
        setDialogData({ notes: "", repeating: false });
        setDialogType("create");
        setEventToDelete({});
    }

    return (
        <>
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
                eventChange={handleEventChange}
                eventRemove={handleEventRemove}
            />
            {dialogOpen && (
                <CalendarDialog
                    dialogOpen={dialogOpen}
                    handleClose={handleClose}
                    dialogData={dialogData}
                    setDialogData={setDialogData}
                    handleEventAdd={handleEventAdd}
                    handleEventRemove={handleEventRemove}
                    eventToDelete={eventToDelete}
                    dialogType={dialogType}
                />
            )}
        </>
    );

    function handleDateSelect(selectInfo) {
        const calendarApi = selectInfo.view.calendar;
        calendarApi.unselect();
        setNewAvailability({
            start: selectInfo.start,
            end: selectInfo.end,
            is_all_day: selectInfo.allDay,
        });
        setDialogOpen(true);
    }

    function handleEventAdd() {
        const allSelectedDays = eachDayOfInterval({
            start: newAvailability.start,
            end: newAvailability.end,
        });
        const selectedInts = allSelectedDays.map((day) => day.getDay());
        if (selectedInts.length !== 1) selectedInts.pop();
        const repeatingDays = dialogData.repeating ? selectedInts : null;

        const event = {
            start: newAvailability.start.toISOString(),
            end: newAvailability.end.toISOString(),
            is_all_day: newAvailability.is_all_day,
            notes: dialogData.notes,
            days_of_week: repeatingDays,
            player_id: playerId,
            user_id: userId,
            guild_id: guildId,
        };
        console.log("event", event);
        createAvailability(event);
        setNewAvailability({});
        setDialogOpen(false);
    }

    function handleEventClick(clickInfo) {
        setEventToDelete(clickInfo);
        setDialogType("delete");
        setDialogOpen(true);
    }

    // function handleDates(rangeInfo) {
    //     prompt("handleDates", rangeInfo);
    // }

    function handleEventChange(changeInfo) {
        prompt("handleEventChange", changeInfo);
    }

    function handleEventRemove() {
        const removeId = eventToDelete.event.id;
        deleteAvailability(removeId);
        handleClose();
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
