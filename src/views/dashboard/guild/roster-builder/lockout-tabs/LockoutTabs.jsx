import { Box, Tab, Tabs, tabsClasses } from "@mui/material";
import { useStore } from "../../../../../store";
import { format, parseISO } from "date-fns";
import { useStore as zusUseStore } from "zustand";
import { useContext } from "react";
import { RosterContext } from "../store/RosterContextProvider";

function LockoutTabs({ selectedTab, handleChangeTab }) {
    const borderRadius = useStore((state) => state.borderRadius);
    const rosterStore = useContext(RosterContext);
    const chosenLockouts = zusUseStore(
        rosterStore,
        (state) => state.chosenLockouts
    );

    return (
        <Box
            sx={{
                flexGrow: 1,
                // maxWidth: { xs: 320, sm: 480, md: 600, lg: 800, xl: 1000 },
                width: "100%",
                bgcolor: "background.paper",
                borderRadius: borderRadius,
            }}
        >
            <Tabs
                value={selectedTab}
                onChange={handleChangeTab}
                variant="scrollable"
                scrollButtons
                aria-label="visible arrows tabs example"
                sx={{
                    [`& .${tabsClasses.scrollButtons}`]: {
                        "&.Mui-disabled": { opacity: 0.3 },
                    },
                }}
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
            </Tabs>
        </Box>
    );
}

export default LockoutTabs;
