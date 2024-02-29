import { getDay, isSameDay, parse, parseISO } from "date-fns";

export default function isUnavailable(character, raid) {
    if (!character.availability.length) {
        return false;
    }
    if (!raid.time && !raid.date) {
        return false;
    }
    const date = parse(raid.date, "yyyy-MM-dd", new Date());
    const time = parse(raid.time, "h:mm a", new Date());
    const raidTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes(),
        time.getSeconds()
    );

    const activeIsUnavailable = character.availability.some((availability) => {
        const start = parseISO(availability.start);
        // const end = parseISO(availability.end);
        const daysOfWeek = availability.days_of_week;
        if (availability.is_all_day && !daysOfWeek) {
            return isSameDay(start, raidTime);
        }

        if (availability.is_all_day && daysOfWeek?.length) {
            const raidDay = getDay(raidTime);
            return daysOfWeek.includes(raidDay);
        }
    });
    return activeIsUnavailable;
}
