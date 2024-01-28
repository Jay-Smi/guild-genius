// material-ui
import { useTheme } from "@mui/material/styles";
import {
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    Stack,
    Typography,
    styled,
    useMediaQuery,
} from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useContext, useState } from "react";
import SidebarItems from "./sidebar-items";
import { isEqual, parseISO } from "date-fns";
import { getLockoutStartAndEndDates } from "../../../../../utils/wowHelpers";
import dayjs from "dayjs";
import { useStore } from "zustand";
import { RosterContext } from "../store/RosterContextProvider";

const StyledStack = styled(Stack, {
    shouldForwardProp: (prop) => prop !== "matchUpLg",
})(({ theme, matchUpLg }) => ({
    paddingTop: matchUpLg ? 0 : "30px",
}));

const StyledAlphaBox = styled(Box)(({ theme }) => ({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: theme.palette.grey[500],
}));

const StyledSecondaryBox = styled(Box)(({ theme }) => ({
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    marginBottom: "0.5rem",
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
    fontWeight: "600",
    marginLeft: "1rem",
}));

const StyledList = styled(List)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
    padding: "0.3rem",
    margin: 0,
    marginBottom: "2rem",
    justifyContent: "center",
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
    justifyContent: "center",
}));

const StyledDesktopDrawer = styled(Drawer)(({ theme }) => ({
    "& .MuiDrawer-paper": {
        width: "auto",
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
        borderRight: "none",
        [theme.breakpoints.up("lg")]: {
            top: "88px",
            paddingTop: "24px",
        },
        zIndex: 1,
    },
}));

const StyledMobileDrawer = styled(Drawer)(({ theme }) => ({
    "& .MuiDrawer-paper": {
        width: "auto",
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
        borderRight: "none",
        [theme.breakpoints.down("lg")]: {
            top: "80px",
            paddingTop: "24px",
        },
        zIndex: 1,
    },
}));

const RosterBuilderSidebar = () => {
    const theme = useTheme();
    const matchUpLg = useMediaQuery(theme.breakpoints.up("lg"));
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const rosterStore = useContext(RosterContext);
    const chosenLockouts = useStore(
        rosterStore,
        (state) => state.chosenLockouts
    );
    const setChosenLockouts = useStore(
        rosterStore,
        (state) => state.setChosenLockouts
    );
    const createTabsContainer = useStore(
        rosterStore,
        (state) => state.createTabsContainer
    );
    const selectedInstance = useStore(
        rosterStore,
        (state) => state.selectedInstance
    );
    const setSelectedInstance = useStore(
        rosterStore,
        (state) => state.setSelectedInstance
    );
    const selectedTab = useStore(rosterStore, (state) => state.selectedTab);
    const setSelectedTab = useStore(
        rosterStore,
        (state) => state.setSelectedTab
    );
    const removeTabContainer = useStore(
        rosterStore,
        (state) => state.removeTabContainer
    );
    const [hoveredDay, setHoveredDay] = useState(null);
    const [selectedLockout, setSelectedLockout] = useState(null);

    const sideBarItems = SidebarItems({
        selectedInstance,
        handleInstanceSelectChange,
        hoveredDay,
        setHoveredDay,
        selectedLockout,
        setSelectedLockout,
        chosenLockouts,
        handleAddLockout,
        handleDeleteLockout,
    });

    function handleDeleteLockout(lockout) {
        const newLockouts = chosenLockouts.filter((prevLockout) => {
            return !isEqual(
                parseISO(prevLockout.startDate),
                parseISO(lockout.startDate)
            );
        });
        if (chosenLockouts[selectedTab].id === lockout.id) {
            setSelectedTab(0);
        }
        removeTabContainer(lockout.id);
        setChosenLockouts(newLockouts);
    }

    function handleAddLockout() {
        if (selectedLockout === null) {
            return;
        }

        const { startDate, endDate } =
            getLockoutStartAndEndDates(selectedLockout);

        const alreadyAdded = chosenLockouts.some((lockout) => {
            return dayjs(lockout.startDate).isSame(dayjs(startDate));
        });
        if (alreadyAdded) {
            return;
        }

        const newLockoutId = crypto.randomUUID();
        const newLockouts = [
            ...chosenLockouts,
            {
                id: newLockoutId,
                startDate,
                endDate,
            },
        ];

        createTabsContainer(newLockoutId);
        setChosenLockouts(newLockouts);
    }
    function handleInstanceSelectChange(event) {
        setSelectedInstance(event.target.value);
    }

    function toggleMobileDrawer() {
        setMobileDrawerOpen(!mobileDrawerOpen);
    }

    const desktopDrawer = (
        <PerfectScrollbar
            component="div"
            style={{
                paddingLeft: "16px",
                paddingRight: "16px",
                paddingBottom: "100px",
            }}
        >
            <StyledStack
                spacing={3}
                divider={<Divider />}
                matchUpLg={matchUpLg}
            >
                {sideBarItems.map((item) => (
                    <StyledAlphaBox key={item.id}>
                        <StyledSecondaryBox>
                            {item.icon}
                            <StyledTypography
                                variant="h4"
                                color={
                                    theme.palette.mode === "dark"
                                        ? theme.palette.primary[200]
                                        : theme.palette.secondary.main
                                }
                            >
                                {item.name}
                            </StyledTypography>
                        </StyledSecondaryBox>

                        {item.content}
                    </StyledAlphaBox>
                ))}
            </StyledStack>
        </PerfectScrollbar>
    );

    const mobileDrawer = (
        <>
            <StyledList disablePadding>
                {sideBarItems.map((item) => (
                    <ListItem disablePadding key={item.id}>
                        <StyledListItemButton onClick={toggleMobileDrawer}>
                            <StyledListItemIcon>{item.icon}</StyledListItemIcon>
                        </StyledListItemButton>
                    </ListItem>
                ))}
            </StyledList>
        </>
    );

    return (
        <Box component="nav" aria-label="roster-builder-options">
            {/* DESKTOP VIEW */}
            {matchUpLg && (
                <StyledDesktopDrawer
                    variant="persistent"
                    anchor="right"
                    open
                    color="inherit"
                >
                    {desktopDrawer}
                </StyledDesktopDrawer>
            )}
            {/* MOBILE CLOSED VIEW */}

            {!matchUpLg && mobileDrawerOpen && (
                <StyledDesktopDrawer
                    variant="temporary"
                    anchor="right"
                    open={mobileDrawerOpen}
                    onClose={toggleMobileDrawer}
                    ModalProps={{ keepMounted: true }}
                    color="inherit"
                >
                    {desktopDrawer}
                </StyledDesktopDrawer>
            )}
            {!matchUpLg && !mobileDrawerOpen && (
                <StyledMobileDrawer
                    variant="persistent"
                    open={!mobileDrawerOpen}
                    anchor="right"
                >
                    {mobileDrawer}
                </StyledMobileDrawer>
            )}
        </Box>
    );
};

export default RosterBuilderSidebar;
