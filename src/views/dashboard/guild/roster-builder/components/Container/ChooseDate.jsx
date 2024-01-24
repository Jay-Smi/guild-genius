import EventIcon from "@mui/icons-material/Event";
import {
    Box,
    Button,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Popover,
    Select,
    Tooltip,
} from "@mui/material";
import { useContext, useMemo, useState } from "react";
import { RosterContext } from "../../store/RosterContextProvider";
import { useStore } from "zustand";
import dayjs from "dayjs";

function ChooseDate({ id: raidId }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const rosterStore = useContext(RosterContext);
    const selectedTab = useStore(rosterStore, (state) => state.selectedTab);
    const chosenLockouts = useStore(
        rosterStore,
        (state) => state.chosenLockouts
    );
    const currentLockout = chosenLockouts[selectedTab];
    const storeContainers = useStore(rosterStore, (state) => state.containers);
    const setStoreContainers = useStore(
        rosterStore,
        (state) => state.setContainers
    );

    const tabsContainers = useStore(
        rosterStore,
        (state) => state.tabsContainers
    );
    const setTabContainer = useStore(
        rosterStore,
        (state) => state.setTabContainer
    );
    const lockoutsIndex = chosenLockouts[selectedTab].id;
    const containers =
        selectedTab === 0 ? storeContainers : tabsContainers[lockoutsIndex];

    const setContainers = useMemo(
        () =>
            selectedTab === 0
                ? setStoreContainers
                : (container) => setTabContainer(lockoutsIndex, container),
        [selectedTab, setStoreContainers, setTabContainer, lockoutsIndex]
    );

    const open = Boolean(anchorEl);
    const id = open ? "choose-date-popover" : undefined;

    const dayStart = dayjs(currentLockout.startDate);
    const dayMid = dayjs(currentLockout.startDate).add(1, "day");
    const dayEnd = dayjs(currentLockout.endDate);
    const days = [dayStart, dayMid, dayEnd];

    const handleSelectDate = (date) => {
        const newContainers = containers.map((container) =>
            container.id === raidId
                ? {
                      ...container,
                      data: [...container.data],
                      date: date,
                  }
                : { ...container, data: container.data && [...container.data] }
        );
        setContainers(newContainers);
        setSelectedDate(event.target.value);
        handleClose();
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Tooltip title="Choose Date">
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ borderRadius: 1 }}
                >
                    <EventIcon sx={{ width: "20px" }} />
                </IconButton>
            </Tooltip>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <Box
                    sx={{
                        minWidth: 160,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {days.map((day, index) => (
                        <Button
                            key={index}
                            onClick={() =>
                                handleSelectDate(day.format("YYYY-MM-DD"))
                            }
                        >
                            {day.format("ddd MMM D")}
                        </Button>
                    ))}
                </Box>
            </Popover>
        </>
    );
}

export default ChooseDate;
