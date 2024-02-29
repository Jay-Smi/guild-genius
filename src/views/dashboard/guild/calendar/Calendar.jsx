import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { useStore } from "../../../../store";
import useUserInfo from "../../../../hooks/useUserInfo";
import useGuild from "../../../../hooks/useGuild";
import { useAllGuildsRaids } from "../../../../hooks/useRaids";
import { useAllGuildInstanceLockouts } from "../../../../hooks/useGuildInstanceLockout";
import Loader from "../../../../components/Loader";
import { Typography, Dialog, DialogTitle, Divider, Box } from "@mui/material";
import { useState } from "react";
import { set } from "date-fns";

export default function Calendar({ events }) {
    const [clickedEvent, setClickedEvent] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    return (
        <>
            <FullCalendar
                plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                    listPlugin,
                ]}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                }}
                editable={true}
                selectable={false}
                selectMirror={true}
                dayMaxEvents={true}
                initialView="dayGridMonth"
                events={events}
                eventClick={handleEventClick}
            />
            {dialogOpen && (
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <Box sx={{ padding: "10px" }}>
                        <DialogTitle>{clickedEvent.title}</DialogTitle>
                        <Divider />
                        <Typography sx={{ mt: "10px" }}>
                            {clickedEvent.time
                                ? `${clickedEvent.time}`
                                : clickedEvent.notes}
                        </Typography>
                    </Box>
                </Dialog>
            )}
        </>
    );

    function handleEventClick(info) {
        const clicked = events.find((event) => event.id == info.event.id);
        console.log(clicked);
        setClickedEvent(clicked);
        setDialogOpen(true);
    }
}
