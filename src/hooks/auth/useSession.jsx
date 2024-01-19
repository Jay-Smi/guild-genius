import { useQuery } from "@tanstack/react-query";

import supabase from "../../services/supabase";

async function getSession() {
    const {
        data: { session },
        error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
}

export function useSession() {
    const {
        data: session,
        isLoading: isLoadingSession,
        error: errorSession,
    } = useQuery({
        queryKey: ["session"],
        queryFn: getSession,
    });
    return { session, isLoadingSession, errorSession };
}
