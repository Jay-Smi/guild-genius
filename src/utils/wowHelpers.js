import { add, format, isBefore } from "date-fns";
import { threeDayLockoutRef } from "../config";
import dayjs from "dayjs";

export function isInSameLockout(day, selectedDay) {
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

export function getLockoutStartAndEndDates(date) {
    let dateObj = date;
    if (typeof date === "string") {
        dateObj = new Date(date);
    }
    const lockoutWindowStartReference = threeDayLockoutRef;

    let currentLockoutStartDate = lockoutWindowStartReference;

    while (isBefore(add(currentLockoutStartDate, { days: 2 }), dateObj)) {
        currentLockoutStartDate = add(currentLockoutStartDate, { days: 3 });
    }

    const currentLockoutEndDate = add(currentLockoutStartDate, { days: 2 });

    return {
        startDate: format(currentLockoutStartDate, "yyyy-MM-dd"),
        endDate: format(currentLockoutEndDate, "yyyy-MM-dd"),
    };
}

export function allClasses() {
    return [
        "Druid",
        "Hunter",
        "Mage",
        "Paladin",
        "Priest",
        "Rogue",
        "Shaman",
        "Warlock",
        "Warrior",
    ];
}

export function allSpecs() {
    return {
        Druid: ["Balance", "Feral", "Guardian", "Restoration"],
        Hunter: ["Beastmaster", "Marksman", "Survival"],
        Mage: ["Arcane", "Fire", "Frost"],
        Paladin: ["Holy", "Protection", "Retribution"],
        Priest: ["Discipline", "Holy", "Shadow"],
        Rogue: ["Assassination", "Combat", "Sublety"],
        Shaman: ["Elemental", "Enhancement", "Restoration"],
        Warlock: ["Affliction", "Demonology", "Destruction"],
        Warrior: ["Arms", "Fury", "Protection"],
    };
}

export function isTank(character) {
    if (character.Spec === "Protection" || character.Spec === "Guardian") {
        return true;
    } else {
        return false;
    }
}

export function isHealer(character) {
    if (
        character.Spec === "Holy" ||
        character.Spec === "Discipline" ||
        character.Spec === "Restoration"
    ) {
        return true;
    } else {
        return false;
    }
}

export function isMelee(character) {
    if (
        character.Spec === "Fury" ||
        character.Spec === "Arms" ||
        character.Spec === "Combat" ||
        character.Spec === "Assassination" ||
        character.Spec === "Sublety" ||
        character.Spec === "Feral" ||
        character.Spec === "Cat" ||
        character.Spec === "Retribution" ||
        character.Spec === "Enhancement"
    ) {
        return true;
    } else {
        return false;
    }
}

export function isRanged(character) {
    if (
        character.Spec === "Affliction" ||
        character.Spec === "Destruction" ||
        character.Spec === "Demonology" ||
        character.Spec === "Frost" ||
        character.Spec === "Fire" ||
        character.Spec === "Arcane" ||
        character.Spec === "Boomkin" ||
        character.Spec === "Balance" ||
        character.Spec === "Marksman" ||
        character.Spec === "Beastmaster" ||
        character.Spec === "Survival"
    ) {
        return true;
    } else {
        return false;
    }
}
