import { useEffect } from "react";
import useProfile from "../../../hooks/auth/useProfile";
import { useSession } from "../../../hooks/auth/useSession";
import { useSnackbar } from "notistack";
import { Navigate } from "react-router-dom";
import { useStore } from "zustand";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@emotion/react";

function Overview() {
    // const { session, isLoadingSession, errorSession } = useSession();
    // if (isLoadingSession) return <div>Loading Session...</div>;
    // return <Window userId={session?.user?.id} />;
}

export default Overview;

function Window({ userId }) {
    const theme = useTheme();
    const { profile, isLoading, error } = useProfile(userId);
    const { enqueueSnackbar } = useSnackbar();
    const menuOpen = useStore((state) => state.menuOpen);
    const matchesSM = useMediaQuery(theme.breakpoints.down("lg"));
    useEffect(() => {
        if (profile?.length === 0) {
            enqueueSnackbar("No Profile detected");
        }
    }, [profile, enqueueSnackbar]);
    if (isLoading) return <div>Loading Profile...</div>;

    return (
        <>
            {profile?.length === 0 && (
                <Navigate to="/dashboard/players/create" />
            )}
            <div>Active Profile</div>
        </>
    );
}
