import { mdiAxeBattle } from "@mdi/js";
import Icon from "@mdi/react";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    styled,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";

import SettingsIcon from "@mui/icons-material/Settings";
import SidebarCalendar from "./calendar";
import RosterSettings from "./settings";

const StyledSettingsIcon = styled(SettingsIcon, {
    shouldForwardProp: (prop) => prop !== "materialIconSize",
})(({ theme, materialIconSize }) => ({
    fontSize: materialIconSize,
    color:
        theme.palette.mode === "dark"
            ? theme.palette.primary[200]
            : theme.palette.secondary.main,
}));

const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
    color:
        theme.palette.mode === "dark"
            ? theme.palette.primary[200]
            : theme.palette.secondary.main,
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    width: "80%",

    color:
        theme.palette.mode === "dark"
            ? theme.palette.primary[200]
            : theme.palette.secondary.main,
    ".MuiOutlinedInput-input": {
        color:
            theme.palette.mode === "dark"
                ? theme.palette.primary[200]
                : theme.palette.secondary.main,
    },
}));

const StyledEditCalendarIcon = styled(EditCalendarIcon, {
    shouldForwardProp: (prop) => prop !== "materialIconSize",
})(({ theme, materialIconSize }) => ({
    fontSize: materialIconSize,
    color:
        theme.palette.mode === "dark"
            ? theme.palette.primary[200]
            : theme.palette.secondary.main,
}));

export default function SidebarItems({
    selectedInstance,
    handleInstanceSelectChange,
    hoveredDay,
    setHoveredDay,
    selectedLockout,
    setSelectedLockout,
    chosenLockouts,
    handleAddLockout,
    handleDeleteLockout,
}) {
    const theme = useTheme();
    const matchDownSm = useMediaQuery(theme.breakpoints.down("sm"));
    const materialIconSize = matchDownSm ? "30px" : "40px";
    const mdiIconSize = matchDownSm ? 1.15 : 1.6;
    return [
        {
            id: 3,
            name: "Controls",
            icon: <StyledSettingsIcon materialIconSize={materialIconSize} />,
            content: <RosterSettings />,
        },
        {
            id: 1,
            name: "Instance",
            icon: (
                <Icon
                    path={mdiAxeBattle}
                    size={mdiIconSize}
                    color={
                        theme.palette.mode === "dark"
                            ? theme.palette.primary[200]
                            : theme.palette.secondary.main
                    }
                />
            ),
            content: (
                <FormControl fullWidth>
                    <StyledInputLabel
                        id="instance-select-label"
                        htmlFor="instance-select"
                    >
                        Instance
                    </StyledInputLabel>
                    <StyledSelect
                        labelId="instance-select-label"
                        id="instance-select"
                        value={selectedInstance}
                        label="Instance"
                        onChange={handleInstanceSelectChange}
                        inputProps={{
                            name: "instance",
                            id: "instance-select",
                            color:
                                theme.palette.mode === "dark"
                                    ? theme.palette.primary[200]
                                    : theme.palette.secondary.main,
                        }}
                    >
                        <MenuItem value="Blackfathom_Deeps">
                            Blackfathom Deeps
                        </MenuItem>
                        <MenuItem value="Gnomeregan">Gnomeregan</MenuItem>
                    </StyledSelect>
                </FormControl>
            ),
        },
        {
            id: 2,
            name: "Lockout",
            icon: (
                <StyledEditCalendarIcon materialIconSize={materialIconSize} />
            ),
            content: (
                <SidebarCalendar
                    hoveredDay={hoveredDay}
                    setHoveredDay={setHoveredDay}
                    selectedLockout={selectedLockout}
                    setSelectedLockout={setSelectedLockout}
                    chosenLockouts={chosenLockouts}
                    handleAddLockout={handleAddLockout}
                    handleDeleteLockout={handleDeleteLockout}
                />
            ),
        },
    ];
}
