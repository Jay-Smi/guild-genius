import { styled } from "@mui/material";
import { PickersDay } from "@mui/x-date-pickers";
import { getLockoutStartAndEndDates } from "../../../../../../utils/wowHelpers";
import dayjs from "dayjs";

const CustomPickersDay = styled(PickersDay, {
    shouldForwardProp: (prop) =>
        prop !== "isSelected" &&
        prop !== "isHovered" &&
        prop !== "isInChosenLockout",
})(({ theme, isSelected, isHovered, day, isInChosenLockout }) => {
    const dayDay = dayjs(day);
    const { startDate, endDate } = getLockoutStartAndEndDates(day);
    const isStartDate = dayDay.isSame(dayjs(startDate), "day");
    const isEndDate = dayDay.isSame(dayjs(endDate), "day");

    return {
        borderRadius: 0,
        fontSize: "1rem",
        ...(isInChosenLockout && {
            backgroundColor: theme.palette.success.main,
            "&:hover, &:focus": {
                backgroundColor: theme.palette.primary.light,
            },
        }),
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

        ...(isStartDate && {
            borderTopLeftRadius: "50%",
            borderBottomLeftRadius: "50%",
        }),
        ...(isEndDate && {
            borderTopRightRadius: "50%",
            borderBottomRightRadius: "50%",
        }),

        ...(isInChosenLockout &&
            isSelected && {
                backgroundColor: theme.palette.error.main,
                color: theme.palette.secondary.contrastText,

                "&:hover, &:focus": {
                    backgroundColor: theme.palette.error.light,
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

export default CustomPickersDay;
