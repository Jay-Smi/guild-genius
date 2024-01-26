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
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { StaticTimePicker } from "@mui/x-date-pickers";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { format, parseISO, set } from "date-fns";

dayjs.extend(customParseFormat);

function ChooseTime({ id: raidId }) {
    const defaultTime = new Date();
    defaultTime.setHours(20);
    defaultTime.setMinutes(0);
    defaultTime.setSeconds(0);

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedTime, setSelectedTime] = useState(defaultTime);
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
    const id = open ? "choose-time-popover" : undefined;

    const handleSelectTime = (time) => {
        const newContainers = containers.map((container) =>
            container.id === raidId
                ? {
                      ...container,
                      data: [...container.data],
                      time: format(time, "h:mm a"),
                  }
                : { ...container, data: container.data && [...container.data] }
        );
        setContainers(newContainers);

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
            <Tooltip title="Choose Time">
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ borderRadius: 1 }}
                >
                    <AccessTimeIcon sx={{ width: "20px" }} />
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
                    <StaticTimePicker onAccept={handleSelectTime} />
                </Box>
            </Popover>
        </>
    );
}

export default ChooseTime;
