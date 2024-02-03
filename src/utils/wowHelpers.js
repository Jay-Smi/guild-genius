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

export const allSODRealms = [
    { name: "Crusader Strike", id: "crusader-strike" },
    { name: "Chaos Bolt", id: "chaos-bolt" },
    { name: "Lava Lash", id: "lava-lash" },
    { name: "Living Flame", id: "living-flame" },
    { name: "Lone Wolf", id: "lone-wolf" },
    { name: "Penance", id: "penance" },
    { name: "Shadowstrike", id: "shadowstrike" },
    { name: "Wild Growth", id: "wild-growth" },
];

export const allClassesArray = [
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

export const allSpecsArray = [
    "Balance",
    "Feral",
    "Guardian",
    "Restoration",
    "Beastmaster",
    "Marksman",
    "Survival",
    "Arcane",
    "Fire",
    "Frost",
    "Holy",
    "Protection",
    "Retribution",
    "Discipline",
    "Holy",
    "Shadow",
    "Assassination",
    "Combat",
    "Sublety",
    "Elemental",
    "Enhancement",
    "Restoration",
    "Affliction",
    "Demonology",
    "Destruction",
    "Arms",
    "Fury",
    "Protection",
];

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
    if (character.spec === "Protection" || character.spec === "Guardian") {
        return true;
    } else {
        return false;
    }
}

export function isHealer(character) {
    if (
        character.spec === "Holy" ||
        character.spec === "Discipline" ||
        character.spec === "Restoration"
    ) {
        return true;
    } else {
        return false;
    }
}

export function isMelee(character) {
    if (
        character.spec === "Fury" ||
        character.spec === "Arms" ||
        character.spec === "Combat" ||
        character.spec === "Assassination" ||
        character.spec === "Sublety" ||
        character.spec === "Feral" ||
        character.spec === "Cat" ||
        character.spec === "Retribution" ||
        character.spec === "Enhancement"
    ) {
        return true;
    } else {
        return false;
    }
}

export function isRanged(character) {
    if (
        character.spec === "Affliction" ||
        character.spec === "Destruction" ||
        character.spec === "Demonology" ||
        character.spec === "Frost" ||
        character.spec === "Fire" ||
        character.spec === "Arcane" ||
        character.spec === "Boomkin" ||
        character.spec === "Balance" ||
        character.spec === "Marksman" ||
        character.spec === "Beastmaster" ||
        character.spec === "Survival"
    ) {
        return true;
    } else {
        return false;
    }
}
