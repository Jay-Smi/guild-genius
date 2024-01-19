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
            id: "characters",
            title: "Characters",
            type: "item",
            url: "/guild/characters",
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
        {
            id: "guild-settings",
            title: "Guild Settings",
            type: "item",
            url: "/guild/guild-settings",
            icon: icons.IconDashboard,
            breadcrumbs: false,
        },
    ],
};

export default guild;
