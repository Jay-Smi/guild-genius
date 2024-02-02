// assets
import { IconDashboard } from "@tabler/icons-react";

// constant
const icons = { IconDashboard };

const characters = {
    id: "my-characters-group",
    type: "group",
    children: [
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
            id: "my-availability",
            title: "My Availability",
            type: "item",
            url: "/my-availability",
            icon: icons.IconDashboard,
            breadcrumbs: false,
        },
    ],
};

export default characters;
