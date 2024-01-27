import { Outlet } from "react-router-dom";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import {
    AppBar,
    Box,
    CssBaseline,
    Toolbar,
    useMediaQuery,
} from "@mui/material";

// project imports
import Breadcrumbs from "../../components/extended/Breadcrumbs";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Customization from "../Customization";
import navigation from "../../menu-items";
import { useStore } from "../../store";
import { drawerWidth } from "../../store/constant";

// assets
import { IconChevronRight } from "@tabler/icons-react";

// styles
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
        ...theme.typography.mainContent,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        transition: theme.transitions.create(
            "margin",
            open
                ? {
                      easing: theme.transitions.easing.easeOut,
                      duration: theme.transitions.duration.enteringScreen,
                  }
                : {
                      easing: theme.transitions.easing.sharp,
                      duration: theme.transitions.duration.leavingScreen,
                  }
        ),
        [theme.breakpoints.up("md")]: {
            marginLeft: open ? 0 : -(drawerWidth - 20),
            width: `calc(100% - ${drawerWidth}px)`,
        },
        [theme.breakpoints.down("md")]: {
            marginLeft: "20px",
            width: `calc(100% - ${drawerWidth}px)`,
            padding: "16px",
        },
        [theme.breakpoints.down("sm")]: {
            marginLeft: "10px",
            width: `calc(100% - ${drawerWidth}px)`,
            padding: "16px",
            marginRight: "10px",
        },
    })
);

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));
    // Handle left drawer
    const leftDrawerOpened = useStore((state) => state.opened);
    const toggleMenu = useStore((state) => state.toggleMenu);
    const handleLeftDrawerToggle = () => {
        toggleMenu();
    };

    return (
        <Box
            sx={{
                display: "flex",
            }}
        >
            <CssBaseline />
            {/* header */}
            <AppBar
                enableColorOnDark
                position="fixed"
                color="inherit"
                elevation={1}
                sx={{
                    bgcolor: theme.palette.background.default,
                    transition: leftDrawerOpened
                        ? theme.transitions.create("width")
                        : "none",
                    boxShadow: "none",
                }}
            >
                <Toolbar>
                    <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
                </Toolbar>
            </AppBar>

            {/* drawer */}
            <Sidebar
                drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened}
                drawerToggle={handleLeftDrawerToggle}
            />

            {/* main content */}
            <Main
                theme={theme}
                open={leftDrawerOpened}
                sx={{
                    backgroundColor:
                        theme.palette.mode === "dark"
                            ? theme.palette.background.dark3
                            : theme.palette.grey[100],
                    boxShadow:
                        theme.palette.mode === "dark"
                            ? "inset 4px 5px 10px 5px rgba(0, 0, 0, 0.555)"
                            : "inset 2px 3px 10px 1px rgba(0, 0, 0, 0.155)",
                }}
            >
                {/* breadcrumb */}
                <Breadcrumbs
                    separator={IconChevronRight}
                    navigation={navigation}
                    icon
                    title
                    rightAlign
                />
                <Box
                    id="main-content-container"
                    sx={{
                        backgroundColor:
                            theme.palette.mode === "dark"
                                ? theme.palette.background.dark3
                                : theme.palette.grey[100],
                    }}
                >
                    <Outlet />
                </Box>
            </Main>
            <Customization />
        </Box>
    );
};

export default MainLayout;
