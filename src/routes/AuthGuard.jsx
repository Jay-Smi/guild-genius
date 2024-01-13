import { useEffect, useState } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "../services/supabase";
import { set } from "date-fns";
import { useLocation } from "react-router-dom";

const AuthGuard = ({ children }) => {
    const [session, setSession] = useState(supabase.auth.getSession());
    const location = useLocation();
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log(session);
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (!session) {
        // Redirect to login if not logged in

        return (
            <Navigate to="/pages/login" state={{ from: location }} replace />
        );
    }

    return <>{children}</>;
};

export default AuthGuard;
