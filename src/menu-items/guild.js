// assets
import { IconDashboard } from "@tabler/icons-react";

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const guild = {
    id: "guild",
    title: "Guild",
    type: "group",
    children: [
        {
            id: "default",
            title: "Dashboard",
            type: "item",
            url: "/guild/dashboard",
            icon: icons.IconDashboard,
            breadcrumbs: false,
        },
        {
            id: "raids",
            title: "Raids",
            type: "item",
            url: "/guild/raids",
            icon: icons.IconDashboard,
            breadcrumbs: false,
        },
        {
            id: "calendar",
            title: "Calendar",
            type: "item",
            url: "/guild/calendar",
            icon: icons.IconDashboard,
            breadcrumbs: false,
        },
        {
            id: "roster",
            title: "Roster",
            type: "item",
            url: "/guild/roster",
            icon: icons.IconDashboard,
            breadcrumbs: false,
        },
        {
            id: "roster-builder",
            title: "Roster Builder",
            type: "item",
            url: "/guild/roster-builder",
            icon: icons.IconDashboard,
            breadcrumbs: false,
        },

        // {
        //     id: "guild-management",
        //     title: "Guild Management",
        //     type: "collapse",
        //     icon: icons.IconDashboard,

        //     children: [
        //         {
        //             id: "guild-roster-management",
        //             title: "Members",
        //             type: "item",
        //             url: "/my-characters/overview",
        //             breadcrumbs: false,
        //         },
        //         {
        //             id: "my-characters-create",
        //             title: "Create",
        //             type: "item",
        //             url: "/my-characters/create",
        //             breadcrumbs: false,
        //         },
        //     ],
        // },
    ],
};

export default guild;
