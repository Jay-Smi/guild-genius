import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Day from "./Day";

function WeekPicker({
    value,
    setValue,
    hoveredDay,
    setHoveredDay,
    chosenLockouts,
}) {
    return (
        <DateCalendar
            value={value}
            onChange={(newValue) => setValue(newValue)}
            showDaysOutsideCurrentMonth
            slots={{ day: Day }}
            slotProps={{
                day: (ownerState) => ({
                    selectedDay: value,
                    hoveredDay,
                    chosenLockouts,
                    onPointerEnter: () => {
                        setHoveredDay(new Date(ownerState.day));
                    },
                    onPointerLeave: () => setHoveredDay(null),
                }),
            }}
        />
    );
}

export default WeekPicker;
