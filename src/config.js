import { QueryClient } from "@tanstack/react-query";

const config = {
    basename: "",
    defaultPath: "/",
    fontFamily: `'Roboto', sans-serif`,
    borderRadius: 12,
};

export default config;

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: Infinity,
        },
    },
});

export const threeDayLockoutRef = new Date("January 17, 2024 10:00:00");
