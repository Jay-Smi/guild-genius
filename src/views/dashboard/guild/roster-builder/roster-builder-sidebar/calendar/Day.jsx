import { isInSameLockout } from "../../../../../../utils/wowHelpers";
import CustomPickersDay from "./CustomPickersDay";

function Day(props) {
    const { day, selectedDay, hoveredDay, chosenLockouts, ...other } = props;
    const isInChosenLockout = chosenLockouts.some((lockout) => {
        if (lockout.type === "all") return;
        const { startDate, endDate } = lockout;
        return isInSameLockout(day, startDate);
    });

    return (
        <CustomPickersDay
            {...other}
            day={day}
            disableMargin
            selected={false}
            isSelected={isInSameLockout(day, selectedDay)}
            isHovered={isInSameLockout(day, hoveredDay)}
            sx={{ fontSize: "1rem" }}
            isInChosenLockout={isInChosenLockout}
        />
    );
}

export default Day;
