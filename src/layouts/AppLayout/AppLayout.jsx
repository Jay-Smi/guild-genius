import { Outlet } from "@tanstack/react-router";
import { StyledAppLayout, StyledAppMain } from "./AppLayout.styled";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

function AppLayout() {
    return (
        <StyledAppLayout>
            <StyledAppMain>
                <Outlet />
            </StyledAppMain>
            <ReactQueryDevtools
                initialIsOpen={false}
                buttonPosition="top-right"
            />
            <TanStackRouterDevtools position="bottom-right" />
        </StyledAppLayout>
    );
}

export default AppLayout;
