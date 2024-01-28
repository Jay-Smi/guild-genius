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

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    borderRadius: "5px",
}));

const StyledEventIcon = styled(EventIcon)(({ theme }) => ({
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

const ChooseDate = memo(({ id: raidId }) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
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

    const achorOrigin = useRef({
        vertical: "bottom",
        horizontal: "left",
    });

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
                <StyledIconButton onClick={handleClick} size="small">
                    <StyledEventIcon />
                </StyledIconButton>
            </Tooltip>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={achorOrigin.current}
            >
                <StyledBox>
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
                </StyledBox>
            </Popover>
        </>
    );
});
ChooseDate.displayName = "ChooseDate";
export default ChooseDate;
