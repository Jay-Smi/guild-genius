import { createBrowserRouter, useRoutes } from "react-router-dom";

// routes
import MainRoutes from "./MainRoutes";
import AuthenticationRoutes from "./AuthenticationRoutes";

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    return createBrowserRouter([MainRoutes, AuthenticationRoutes]);
}
