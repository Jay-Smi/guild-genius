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
    styled,
    useTheme,
} from "@mui/material";
import { memo, useContext, useMemo, useRef, useState } from "react";
import { RosterContext } from "../../store/RosterContextProvider";
import { useStore } from "zustand";
import dayjs from "dayjs";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { StaticTimePicker } from "@mui/x-date-pickers";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { format, parseISO, set } from "date-fns";

dayjs.extend(customParseFormat);

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    borderRadius: "5px",
}));

const StyledAccessTimeIcon = styled(AccessTimeIcon)(({ theme }) => ({
    width: "20px",
    color:
        theme.palette.mode === "dark"
            ? theme.palette.text.hint
            : theme.palette.grey[500],
}));

const StyledBox = styled(Box)(({ theme }) => ({
    minWidth: 160,
    display: "flex",
    flexDirection: "column",
}));

const ChooseTime = memo(({ id: raidId }) => {
    const theme = useTheme();
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

    const anchorOrigin = useRef({
        vertical: "bottom",
        horizontal: "left",
    });

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
                <StyledIconButton onClick={handleClick} size="small">
                    <StyledAccessTimeIcon />
                </StyledIconButton>
            </Tooltip>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={anchorOrigin.current}
            >
                <StyledBox>
                    <StaticTimePicker onAccept={handleSelectTime} />
                </StyledBox>
            </Popover>
        </>
    );
});
ChooseTime.displayName = "ChooseTime";
export default ChooseTime;
