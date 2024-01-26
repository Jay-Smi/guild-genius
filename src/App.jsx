import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";

// routing
import { RouterProvider } from "react-router-dom";
import Routes from "./routes";

// defaultTheme
import themes from "./themes";

// project imports
import { useStore } from "./store";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./config";
import { Toaster } from "react-hot-toast";

const router = Routes();

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
        <StyledEngineProvider injectFirst>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={themes(customization)}>
                    <SnackbarProvider
                        maxSnack={3}
                        autoHideDuration={3000}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                    >
                        <Toaster />
                        <CssBaseline />
                        <RouterProvider router={router} />
                    </SnackbarProvider>
                </ThemeProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </StyledEngineProvider>
    );
};

export default App;
