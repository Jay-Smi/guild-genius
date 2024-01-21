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
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const CustomPickersDay = styled(PickersDay, {
    shouldForwardProp: (prop) => prop !== "isSelected" && prop !== "isHovered",
})(({ theme, isSelected, isHovered, day }) => {
    return {
        borderRadius: 0,
        ...(isSelected && {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            "&:hover, &:focus": {
                backgroundColor: theme.palette.primary.main,
            },
        }),
        ...(isHovered && {
            backgroundColor: theme.palette.secondary.main,
            "&:hover, &:focus": {
                backgroundColor: theme.palette.secondary.main,
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
    };
});

function isInSameLockout(day, selectedDay) {
    if (selectedDay === null) {
        return false;
    }
    const dayDay = dayjs(day);
    const daySelectedDay = dayjs(selectedDay);

    const { startDate, endDate } = getLockoutStartAndEndDates(selectedDay);

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    return (
        dayDay.isSameOrBefore(end, "day") && dayDay.isSameOrAfter(start, "day")
    );
}

export default function RosterBuilder() {
    const test = dayjs();
    console.log(test);
    // console.log(
    //     isInSameLockout(new Date("2024-01-19"), new Date("2024-01-16"))
    // );
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
    const [value, setValue] = useState(null);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar
                value={value}
                onChange={(newValue) => setValue(newValue)}
                showDaysOutsideCurrentMonth
                slots={{ day: Day }}
                slotProps={{
                    day: (ownerState) => ({
                        selectedDay: value,
                        hoveredDay,
                        onPointerEnter: () => {
                            setHoveredDay(new Date(ownerState.day));
                        },
                        onPointerLeave: () => setHoveredDay(null),
                    }),
                }}
            />
        </LocalizationProvider>
    );
}
