export const test = {
    unrostered: {
        Healers: [
            {
                id: "1",
                spec: "Holy",
                playerName: "Seizure",
                type: "Main",
                class: "Priest",
                rostered: false,
                tags: ["healer", "dispel"],
            },
            {
                id: "2",
                Spec: "Holy",
                playerName: "Epicure",
                Type: "Main",
                Class: "Priest",
                Rostered: false,
                tags: ["healer", "dispel"],
            },
        ],
        Tanks: [
            {
                id: "3",
                playerName: "Zurack",
                spec: "Protection",
                type: "Main",
                class: "Warrior",
                rostered: false,
                tags: ["tank", "kick"],
            },
        ],
        Melee: [
            {
                id: "4",
                playerName: "KD",
                spec: "Feral",
                type: "Main",
                class: "Druid",
                rostered: false,
                tags: ["melee"],
            },
            {
                id: "5",
                playerName: "Blockin",
                spec: "Fury",
                type: "Main",
                class: "Warrior",
                rostered: false,
                tags: ["melee"],
            },
        ],
        Ranged: [
            {
                id: "6",
                playerName: "Hooligon",
                spec: "Affliction",
                type: "Main",
                class: "Warlock",
                rostered: false,
                tags: ["ranged"],
            },
            {
                id: "7",
                playerName: "Bam",
                spec: "Marksman",
                type: "Main",
                class: "Hunter",
                rostered: false,
                tags: ["ranged"],
            },
        ],
        Kicks: [
            {
                id: "8",
                playerName: "Howler",
                spec: "Retribution",
                type: "Main",
                class: "Paladin",
                rostered: false,
                tags: ["melee", "kick"],
            },
        ],
    },
    raids: {
        raid1: {
            r1group1: [],
            r1group2: [],
        },
        raid2: {
            r2group1: [],
            r2group2: [],
            r2group3: [],
            r2group4: [],
        },
        raid3: {
            r3group1: [
                {
                    id: "9",
                    spec: "Holy",
                    playerName: "Seizure",
                    type: "Main",
                    class: "Priest",
                    rostered: false,
                },
                {
                    id: "10",
                    Spec: "Holy",
                    playerName: "Epicure",
                    Type: "Main",
                    Class: "Priest",
                    Rostered: false,
                },
            ],
            r3group2: [
                {
                    id: "11",
                    playerName: "Zurack",
                    spec: "Protection",
                    type: "Main",
                    class: "Warrior",
                    rostered: false,
                },
            ],
            r3group3: [
                {
                    id: "12",
                    playerName: "Howler",
                    spec: "Retribution",
                    type: "Main",
                    class: "Paladin",
                    rostered: false,
                },
                {
                    id: "13",
                    playerName: "KD",
                    spec: "Feral",
                    type: "Main",
                    class: "Druid",
                    rostered: false,
                },
                {
                    id: "14",
                    playerName: "Blockin",
                    spec: "Fury",
                    type: "Main",
                    class: "Warrior",
                    rostered: false,
                },
            ],
            r3group4: [
                {
                    id: "15",
                    playerName: "Hooligon",
                    spec: "Affliction",
                    type: "Main",
                    class: "Warlock",
                    rostered: false,
                },
                {
                    id: "16",
                    playerName: "Bam",
                    spec: "Marksman",
                    type: "Main",
                    class: "Hunter",
                    rostered: false,
                },
            ],
        },
    },
};

const raidGroupContainers = {
    raid1: ["r1group1", "r1group2"],
    raid2: ["r2group1", "r2group2", "r2group3", "r2group4"],
    raid3: ["r3group1", "r3group2", "r3group3", "r3group4"],
};

const containers = [
    {
        id: "1",
        type: "raid",
        subcontainers: ["", "", ""],
        subcontainerType: "group",
    },
    {
        id: "1",
        type: "category",
        subcontainers: [
            {
                lists: [],
                type: "character",
            },
        ],
    },
    {
        id: "1",
        type: "character",
        parent: {
            type: "group",
            id: "1",
        },
    },
    {
        id: "1",
        type: "group",
        subcontainer: [
            {
                lists: ["1"],
                type: "character",
            },
        ],
    },
    {
        id: "1",
        type: "lockout",
        subcontainer: [
            {
                lists: ["1"],
                type: "raid",
            },
            {
                lists: ["1"],
                type: "category",
            },
        ],
        parent: null,
    },
];

//receive list of characters and raids object
//filter characters into unrosteredCategories

const lockouts = [{ id: "1", type: "lockout", subcontainers: ["1", "2"] }];

export const lockout = [
    {
        id: "lockout-1",
        type: "lockout",
        dataType: "category",
        data: ["category-1", "category-2", "category-3", "category-4"],
    },
    {
        id: "lockout-2",
        type: "lockout",
        dataType: "raid",
        data: ["raid-1", "raid-2", "raid-3"],
    },
];

export const raids = [
    {
        id: "raid-1",
        name: "Raid 1",
        type: "raid",
        dataType: "group",
        data: ["group-1", "group-2"],
        parent: "lockout-2",
    },
    {
        id: "raid-2",
        name: "Raid 2",
        type: "raid",
        dataType: "group",
        data: ["group-3", "group-4", "group-5", "group-6"],
        parent: "lockout-2",
    },
    {
        id: "raid-3",
        name: "Raid 3",
        type: "raid",
        dataType: "group",
        data: ["group-7", "group-8", "group-9", "group-10"],
        parent: "lockout-2",
    },
];

export const groups = [
    {
        id: "group-1",
        name: "Group 1",
        type: "group",
        dataType: "character",
        data: ["character-1"],
        parent: "raid-1",
    },
    {
        id: "group-2",
        name: "Group 2",
        type: "group",
        dataType: "character",
        data: ["character-2"],
        parent: "raid-1",
    },
    {
        id: "group-3",
        name: "Group 1",
        type: "group",
        dataType: "character",
        data: ["character-3"],
        parent: "raid-2",
    },
    {
        id: "group-4",
        name: "Group 2",
        type: "group",
        dataType: "character",
        data: ["character-4"],
        parent: "raid-2",
    },
    {
        id: "group-5",
        name: "Group 3",
        type: "group",
        dataType: "character",
        data: ["character-5"],
        parent: "raid-2",
    },
    {
        id: "group-6",
        name: "Group 4",
        type: "group",
        dataType: "character",
        data: [],
        parent: "raid-2",
    },
    {
        id: "group-7",
        name: "Group 1",
        type: "group",
        dataType: "character",
        data: ["character-6"],
        parent: "raid-3",
    },
    {
        id: "group-8",
        name: "Group 2",
        type: "group",
        dataType: "character",
        data: ["character-7"],
        parent: "raid-3",
    },
    {
        id: "group-9",
        name: "Group 3",
        type: "group",
        dataType: "character",
        data: ["character-8"],
        parent: "raid-3",
    },
    {
        id: "group-10",
        name: "Group 4",
        type: "group",
        dataType: "character",
        data: ["character-9"],
        parent: "raid-3",
    },
];

export const categories = [
    {
        id: "category-1",
        name: "Healers",
        type: "category",
        dataType: "character",
        data: ["character-10", "character-11"],
        parent: "lockout-1",
    },
    {
        id: "category-2",
        name: "Tanks",
        type: "category",
        dataType: "character",
        data: ["character-12"],
        parent: "lockout-1",
    },
    {
        id: "category-3",
        name: "Melee",
        type: "category",
        dataType: "character",
        data: ["character-13", "character-14"],
        parent: "lockout-1",
    },
    {
        id: "category-4",
        name: "Ranged",
        type: "category",
        dataType: "character",
        data: ["character-15", "character-16"],
        parent: "lockout-1",
    },
];

export const characters = [
    {
        id: "character-1",
        spec: "Holy",
        playerName: "Petad",
        type: "character",
        class: "Priest",
        rostered: true,
        tags: ["healer", "dispel"],
        parent: "group-1",
    },
    {
        id: "character-2",
        spec: "Holy",
        playerName: "Mitch",
        type: "character",
        class: "Priest",
        rostered: true,
        tags: ["healer", "dispel"],
        parent: "group-2",
    },

    {
        id: "character-3",
        playerName: "Fashion",
        spec: "Protection",
        type: "character",
        class: "Warrior",
        rostered: true,
        tags: ["tank", "kick"],
        parent: "group-3",
    },

    {
        id: "character-4",
        playerName: "KD",
        spec: "Feral",
        type: "character",
        class: "Druid",
        rostered: true,
        tags: ["melee"],
        parent: "group-4",
    },
    {
        id: "character-5",
        playerName: "Blockin",
        spec: "Fury",
        type: "character",
        class: "Warrior",
        rostered: true,
        tags: ["melee"],
        parent: "group-5",
    },

    {
        id: "character-6",
        playerName: "Hooligon",
        spec: "Affliction",
        type: "character",
        class: "Warlock",
        rostered: false,
        tags: ["ranged"],
        parent: "group-7",
    },
    {
        id: "character-7",
        playerName: "Bam",
        spec: "Marksman",
        type: "character",
        class: "Hunter",
        rostered: false,
        tags: ["ranged"],
        parent: "group-8",
    },

    {
        id: "character-8",
        playerName: "Howler",
        spec: "Retribution",
        type: "character",
        class: "Paladin",
        rostered: false,
        tags: ["melee", "kick"],
        parent: "group-9",
    },

    {
        id: "character-9",
        spec: "Holy",
        playerName: "Seizure",
        type: "character",
        class: "Priest",
        rostered: false,
        parent: "group-10",
    },
    {
        id: "character-10",
        spec: "Holy",
        playerName: "Epicure",
        type: "character",
        class: "Priest",
        rostered: false,
        parent: "category-1",
    },

    {
        id: "character-11",
        playerName: "Zurack",
        spec: "Protection",
        type: "character",
        class: "Warrior",
        rostered: false,
        parent: "category-1",
    },

    {
        id: "character-12",
        playerName: "Howler",
        spec: "Retribution",
        type: "character",
        class: "Paladin",
        rostered: false,
        parent: "category-2",
    },
    {
        id: "character-13",
        playerName: "KD",
        spec: "Feral",
        type: "character",
        class: "Druid",
        rostered: false,
        parent: "category-3",
    },
    {
        id: "character-14",
        playerName: "Desemate",
        spec: "Fury",
        type: "character",
        class: "Warrior",
        rostered: false,
        parent: "category-3",
    },

    {
        id: "character-15",
        playerName: "Hooligon",
        spec: "Affliction",
        type: "character",
        class: "Warlock",
        rostered: false,
        parent: "category-4",
    },
    {
        id: "character-16",
        playerName: "Bam",
        spec: "Marksman",
        type: "character",
        class: "Hunter",
        rostered: false,
        parent: "category-4",
    },
];
