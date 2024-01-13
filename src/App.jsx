import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";

// routing
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes";

// defaultTheme
import themes from "./themes";

// project imports
import NavigationScroll from "./layouts/NavigationScroll";
import { useStore } from "./store";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: Infinity,
        },
    },
});

// ==============================|| APP ||============================== //

const App = () => {
    const { isOpen, defaultId, fontFamily, borderRadius, opened } = useStore(
        (state) => ({
            isOpen: state.isOpen,
            defaultId: state.defaultId,
            fontFamily: state.fontFamily,
            borderRadius: state.borderRadius,
            opened: state.opened,
        })
    );
    const customization = {
        isOpen,
        defaultId,
        fontFamily,
        borderRadius,
        opened,
    };

    return (
        <BrowserRouter>
            <StyledEngineProvider injectFirst>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider theme={themes(customization)}>
                        <CssBaseline />
                        <NavigationScroll>
                            <Routes />
                        </NavigationScroll>
                    </ThemeProvider>
                </QueryClientProvider>
            </StyledEngineProvider>
        </BrowserRouter>
    );
};

export default App;
