import { lazy } from "react";

// project imports
import Loadable from "../components/Loadable";
import MinimalLayout from "../layouts/MinimalLayout";

// login routing
const AuthLogin = Loadable(
    lazy(() => import("../views/pages/authentication/Login"))
);
const AuthRegister = Loadable(
    lazy(() => import("../views/pages/authentication/Register"))
);

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    path: "/",
    element: <MinimalLayout />,
    children: [
        {
            path: "/pages/login",
            element: <AuthLogin />,
        },
        {
            path: "/pages/register",
            element: <AuthRegister />,
        },
    ],
};

export default AuthenticationRoutes;
