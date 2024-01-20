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
    ],
};

export default characters;
