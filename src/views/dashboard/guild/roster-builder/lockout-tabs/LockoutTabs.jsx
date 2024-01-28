import { Box, Tab, Tabs, styled, tabsClasses, useTheme } from "@mui/material";
import { useStore } from "../../../../../store";
import { format, parseISO } from "date-fns";
import { useStore as zusUseStore } from "zustand";
import { useContext } from "react";
import { RosterContext } from "../store/RosterContextProvider";

const StyledBox = styled(Box)(({ theme }) => {
    return {
        flexGrow: 1,
        // maxWidth: { xs: 320, sm: 480, md: 600, lg: 800, xl: 1000 },
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        borderRadius: 25,
        boxShadow:
            theme.palette.mode === "dark"
                ? "4px 5px 5px 2px rgba(0, 0, 0, 0.459)"
                : " 2px 3px 10px 1px rgba(0, 0, 0, 0.155)",
    };
});

const StyledTabs = styled(Tabs)(({ theme }) => {
    return {
        [`& .${tabsClasses.scrollButtons}`]: {
            "&.Mui-disabled": { opacity: 0.3 },
        },
    };
});

function LockoutTabs() {
    const rosterStore = useContext(RosterContext);
    const setSelectedTab = zusUseStore(
        rosterStore,
        (state) => state.setSelectedTab
    );
    const chosenLockouts = zusUseStore(
        rosterStore,
        (state) => state.chosenLockouts
    );
    const selectedTab = zusUseStore(rosterStore, (state) => state.selectedTab);

    function handleChangeTab(event, newValue) {
        setSelectedTab(newValue);
    }
    return (
        <StyledBox>
            <StyledTabs
                value={selectedTab}
                onChange={handleChangeTab}
                variant="scrollable"
                scrollButtons
                aria-label="visible arrows tabs example"
            >
                {chosenLockouts.map((lockout) => {
                    if (lockout.type === "all") {
                        return <Tab label="All" key="all-lockouts" />;
                    }
                    const startDate = format(
                        parseISO(lockout.startDate),
                        "MMM dd"
                    );
                    const endDate = format(parseISO(lockout.endDate), "MMM dd");
                    return (
                        <Tab
                            label={`${startDate} - ${endDate}`}
                            key={lockout.startDate}
                        />
                    );
                })}
            </StyledTabs>
        </StyledBox>
    );
}

export default LockoutTabs;
