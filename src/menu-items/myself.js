// assets
import { IconDashboard } from "@tabler/icons-react";

// constant
const icons = { IconDashboard };

const characters = {
    id: "myself",
    type: "group",
    children: [
        {
            id: "my-availability",
            title: "My Availability",
            type: "item",
            url: "/my-availability",
            icon: icons.IconDashboard,
            breadcrumbs: false,
        },
        {
            id: "my-characters",
            title: "My Characters",
            type: "collapse",
            icon: icons.IconDashboard,

            children: [
                {
                    id: "my-characters-overview",
                    title: "Overview",
                    type: "item",
                    url: "/my-characters/overview",
                    breadcrumbs: false,
                },
                {
                    id: "my-characters-create",
                    title: "Create",
                    type: "item",
                    url: "/my-characters/create",
                    breadcrumbs: false,
                },
            ],
        },
        {
            id: "my-guilds",
            title: "My Guilds",
            type: "collapse",
            icon: icons.IconDashboard,

            children: [
                {
                    id: "my-guilds-overview",
                    title: "Overview",
                    type: "item",
                    url: "/my-guilds/overview",
                    breadcrumbs: false,
                },
                {
                    id: "my-guilds-create",
                    title: "Create",
                    type: "item",
                    url: "/my-guilds/create",
                    breadcrumbs: false,
                },
            ],
        },
    ],
};

export default characters;
