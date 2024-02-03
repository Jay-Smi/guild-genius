import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import supabase from "../services/supabase";
import { useLocation } from "react-router-dom";
import { useSession } from "../hooks/auth/useSession";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "../store";

// const sessionQuery = () => ({
//     queryKey: ["session"],
//     queryFn: async () => supabase.auth.getSession(),
// });

// export const authGuardLoader =
//     (queryClient) =>
//     async ({ params }) => {
//         const query = sessionQuery();

//         return (
//             queryClient.getQueryData(query.queryKey) ??
//             (await queryClient.fetchQuery(query))
//         );
//     };

const AuthGuard = ({ children }) => {
    const session = useStore((state) => state.session);
    const setSession = useStore((state) => state.setSession);

    useEffect(() => {
        supabase.auth
            .getSession()
            .then(({ data: { session } }) => {
                setSession(session);
            })
            .catch((error) => {
                console.log(error);
                setSession(null);
            });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, [setSession]);

    if (session === null) return <Navigate to="/pages/login" />;
    if (session === undefined) return <div>Loading...</div>;

    return <>{children}</>;
};

export default AuthGuard;
