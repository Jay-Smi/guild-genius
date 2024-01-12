// assets
import { IconDashboard } from "@tabler/icons-react";

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: "dashboard",
    title: "Dashboard",
    type: "group",
    children: [
        {
            id: "default",
            title: "Dashboard",
            type: "item",
            url: "/dashboard/default",
            icon: icons.IconDashboard,
            breadcrumbs: false,
        },
        {
            id: "raids",
            title: "Raids",
            type: "item",
            url: "/dashboard/raids",
            icon: icons.IconDashboard,
            breadcrumbs: false,
        },
        {
            id: "calendar",
            title: "Calendar",
            type: "item",
            url: "/dashboard/calendar",
            icon: icons.IconDashboard,
            breadcrumbs: false,
        },
        {
            id: "roster-builder",
            title: "Roster Builder",
            type: "item",
            url: "/dashboard/roster-builder",
            icon: icons.IconDashboard,
            breadcrumbs: false,
        },
    ],
};

export default dashboard;
