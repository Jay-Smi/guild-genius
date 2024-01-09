import { Outlet } from "react-router-dom";
import { StyledAppLayout, StyledAppMain } from "./AppLayout.styled";

function AppLayout() {
    return (
        <StyledAppLayout>
            <StyledAppMain>
                <Outlet />
            </StyledAppMain>
        </StyledAppLayout>
    );
}

export default AppLayout;
