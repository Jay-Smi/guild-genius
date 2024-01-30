import { lazy } from "react";

// project imports

import Loadable from "../components/Loadable";
import { Navigate } from "react-router-dom";
import MyCharactersCreate from "../views/dashboard/my-characters/MyCharactersCreate";

//main routing
const MainLayout = Loadable(lazy(() => import("../layouts/MainLayout")));
const NavigationScroll = Loadable(
    lazy(() => import("../layouts/NavigationScroll"))
);
const { authGuardLoader } = lazy(() => import("./AuthGuard"));

// dashboard routing
const { queryClient } = lazy(() => import("../config"));
const DashboardDefault = Loadable(
    lazy(() => import("../views/dashboard/default"))
);
const GuildDashboard = Loadable(
    lazy(() => import("../views/dashboard/guild/dashboard"))
);
const DashboardRosterBuilder = Loadable(
    lazy(() => import("../views/dashboard/guild/roster-builder"))
);

const GuildRoster = Loadable(
    lazy(() => import("../views/dashboard/guild/roster"))
);
const MyCharactersOverview = Loadable(
    lazy(() => import("../views/dashboard/my-characters/MyCharactersOverview"))
);
const DashboardRaids = Loadable(
    lazy(() => import("../views/dashboard/guild/raids"))
);

// utilities routing
const UtilsTypography = Loadable(
    lazy(() => import("../views/utilities/Typography"))
);
const UtilsColor = Loadable(lazy(() => import("../views/utilities/Color")));
const UtilsShadow = Loadable(lazy(() => import("../views/utilities/Shadow")));
const UtilsMaterialIcons = Loadable(
    lazy(() => import("../views/utilities/MaterialIcons"))
);
const UtilsTablerIcons = Loadable(
    lazy(() => import("../views/utilities/TablerIcons"))
);

// sample page routing
const SamplePage = Loadable(lazy(() => import("../views/sample-page")));

//Authentication
const AuthGuard = Loadable(lazy(() => import("./AuthGuard")));
const UserGuard = Loadable(lazy(() => import("./UserGuard")));

// ==============================|| MAIN ROUTING ||============================== //

//RoleGuard

const MainRoutes = {
    path: "/",
    element: (
        <AuthGuard>
            <UserGuard>
                <NavigationScroll>
                    <MainLayout />
                </NavigationScroll>
            </UserGuard>
        </AuthGuard>
    ),
    // loader: authGuardLoader(queryClient),
    children: [
        {
            path: "/",
            element: <Navigate to="/my-characters/overview" />,
        },
        {
            path: "guild",
            children: [
                {
                    path: "dashboard",
                    element: <GuildDashboard />,
                },
                {
                    path: "raids",
                    element: <DashboardRaids />,
                },
                {
                    path: "calendar",
                    element: <DashboardDefault />,
                },
                {
                    path: "roster",
                    element: <GuildRoster />,
                },
                {
                    path: "roster-builder",
                    element: <DashboardRosterBuilder />,
                },
                {
                    path: "guild-settings",
                    element: <DashboardDefault />,
                },
            ],
        },
        {
            path: "my-characters",

            children: [
                {
                    path: "overview",
                    element: <MyCharactersOverview />,
                },
                {
                    path: "create",
                    element: <MyCharactersCreate />,
                },
            ],
        },
        {
            path: "utils",
            children: [
                {
                    path: "util-typography",
                    element: <UtilsTypography />,
                },
            ],
        },
        {
            path: "utils",
            children: [
                {
                    path: "util-color",
                    element: <UtilsColor />,
                },
            ],
        },
        {
            path: "utils",
            children: [
                {
                    path: "util-shadow",
                    element: <UtilsShadow />,
                },
            ],
        },
        {
            path: "icons",
            children: [
                {
                    path: "tabler-icons",
                    element: <UtilsTablerIcons />,
                },
            ],
        },
        {
            path: "icons",
            children: [
                {
                    path: "material-icons",
                    element: <UtilsMaterialIcons />,
                },
            ],
        },
        {
            path: "sample-page",
            element: <SamplePage />,
        },

        {
            path: "*",
            element: <SamplePage />,
        },
    ],
};

export default MainRoutes;

// {
//             path: "utils",
//             children: [
//                 {
//                     path: "util-typography",
//                     element: <UtilsTypography />,
//                 },
//             ],
//         },
//         {
//             path: "utils",
//             children: [
//                 {
//                     path: "util-color",
//                     element: <UtilsColor />,
//                 },
//             ],
//         },
//         {
//             path: "utils",
//             children: [
//                 {
//                     path: "util-shadow",
//                     element: <UtilsShadow />,
//                 },
//             ],
//         },
//         {
//             path: "icons",
//             children: [
//                 {
//                     path: "tabler-icons",
//                     element: <UtilsTablerIcons />,
//                 },
//             ],
//         },
//         {
//             path: "icons",
//             children: [
//                 {
//                     path: "material-icons",
//                     element: <UtilsMaterialIcons />,
//                 },
//             ],
//         },
//     {
//     path: "sample-page",
//     element: <SamplePage />,
// },
