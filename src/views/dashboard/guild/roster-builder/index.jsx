import { useGuildInstanceLockout } from "../../../../hooks/useGuildInstanceLockout";
import { useState } from "react";
import { getLockoutStartAndEndDates } from "../../../../utils/wowHelpers";
import { isEqual, parseISO } from "date-fns";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { Box, Paper, useMediaQuery, useTheme } from "@mui/material";
import RosterBuilderSidebar from "./roster-builder-sidebar";
import LockoutTabs from "./lockout-tabs/LockoutTabs";
import SidebarItems from "./roster-builder-sidebar/sidebar-items";
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export default function RosterBuilder() {
    const theme = useTheme();
    const [selectedTab, setSelectedTab] = useState(0);
    const [hoveredDay, setHoveredDay] = useState(null);
    const [selectedLockout, setSelectedLockout] = useState(null);
    const [instanceSelectValue, setInstanceSelectValue] = useState("");
    const [chosenLockouts, setChosenLockouts] = useState([{ type: "all" }]);
    const matchUpLg = useMediaQuery(theme.breakpoints.up("lg"));

    const sideBarItems = SidebarItems({
        instanceSelectValue,
        handleInstanceSelectChange,
        hoveredDay,
        setHoveredDay,
        selectedLockout,
        setSelectedLockout,
        chosenLockouts,
        handleAddLockout,
        handleDeleteLockout,
    });

    return (
        <Box sx={{ height: "100%" }}>
            <Paper
                elevation={1}
                sx={{ height: "100%", mr: matchUpLg ? "334px" : "40px" }}
            >
                <LockoutTabs
                    chosenLockouts={chosenLockouts}
                    selectedTab={selectedTab}
                    handleChangeTab={handleChangeTab}
                />
            </Paper>
            <RosterBuilderSidebar listItems={sideBarItems} />
        </Box>
    );
    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }
    // return (
    //     <RosterBuilderActual
    //         categories={categories}
    //         characters={characters}
    //         raids={raids}
    //         groups={groups}
    //         players={players}
    //     />
    // );

    function handleDeleteLockout(lockout) {
        setChosenLockouts((prev) => {
            return prev.filter((prevLockout) => {
                return !isEqual(
                    parseISO(prevLockout.startDate),
                    parseISO(lockout.startDate)
                );
            });
        });
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

        setChosenLockouts((prev) => [
            ...prev,
            {
                startDate,
                endDate,
            },
        ]);
    }

    function handleInstanceSelectChange(event) {
        setInstanceSelectValue(event.target.value);
    }

    function handleChangeTab(event, newValue) {
        setSelectedTab(newValue);
    }
}
