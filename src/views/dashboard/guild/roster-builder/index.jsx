import { useGuildInstanceLockout } from "../../../../hooks/useGuildInstanceLockout";
import { RosterBuilderActual } from "./RosterBuilderActual";
import { styled } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { useState } from "react";
import { getLockoutStartAndEndDates } from "../../../../utils/wowHelpers";
import { isAfter, isBefore, isEqual, parseISO } from "date-fns";

const CustomPickersDay = styled(PickersDay, {
    shouldForwardProp: (prop) => prop !== "isSelected" && prop !== "isHovered",
})(({ theme, isSelected, isHovered, day }) => ({
    borderRadius: 0,
    ...(isSelected && {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        "&:hover, &:focus": {
            backgroundColor: theme.palette.primary.main,
        },
    }),
    ...(isHovered && {
        backgroundColor: theme.palette.primary[theme.palette.mode],
        "&:hover, &:focus": {
            backgroundColor: theme.palette.primary[theme.palette.mode],
        },
    }),

    // ...(day.day() === 0 && {
    //     borderTopLeftRadius: "50%",
    //     borderBottomLeftRadius: "50%",
    // }),
    // ...(day.day() === 6 && {
    //     borderTopRightRadius: "50%",
    //     borderBottomRightRadius: "50%",
    // }),
}));

export default function RosterBuilder() {
    return <WeekPicker />;
    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }
    // return (
    //     <RosterBuilderActual
    //         categories={categories}
    //         characters={characters}
    //         raids={raids}
    //         groups={groups}
    //         players={players}
    //     />
    // );
}

function RosterLoader({ children, guildId, startDate }) {
    const { lockout, lockoutError, isLoadingLockout } =
        useGuildInstanceLockout();
}

function isInSameLockout(day, selectedDay) {
    const parsedDay = parseISO(day);
    const { startDate, endDate } = getLockoutStartAndEndDates(
        parseISO(selectedDay)
    );
    const parsedStart = parseISO(startDate);
    const parsedEnd = parseISO(endDate);
    return (
        (isBefore(parsedDay, parsedEnd) || isEqual(parsedDay, parsedEnd)) &&
        (isAfter(parsedDay, parsedStart) || isEqual(parsedDay, parsedStart))
    );
}

function Day(props) {
    const { day, selectedDay, hoveredDay, ...other } = props;

    return (
        <CustomPickersDay
            {...other}
            day={day}
            sx={{ px: 2.5 }}
            disableMargin
            selected={false}
            isSelected={isInSameLockout(day, selectedDay)}
            isHovered={isInSameLockout(day, hoveredDay)}
        />
    );
}

function WeekPicker() {
    const [hoveredDay, setHoveredDay] = useState(null);
    const [value, setValue] = useState(new Date());

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar
                value={value}
                onChange={(newValue) => setValue(newValue)}
                showDaysOutsideCurrentMonth
                displayWeekNumber
                slots={{ day: Day }}
                slotProps={{
                    day: (ownerState) => ({
                        selectedDay: value,
                        hoveredDay,
                        onPointerEnter: () => setHoveredDay(ownerState.day),
                        onPointerLeave: () => setHoveredDay(null),
                    }),
                }}
            />
        </LocalizationProvider>
    );
}
