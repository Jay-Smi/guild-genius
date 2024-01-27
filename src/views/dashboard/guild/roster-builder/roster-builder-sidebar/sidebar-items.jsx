import { mdiAxeBattle } from "@mdi/js";
import Icon from "@mdi/react";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";

import SettingsIcon from "@mui/icons-material/Settings";
import SidebarCalendar from "./calendar";
import RosterSettings from "./settings";

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
            icon: (
                <SettingsIcon
                    sx={{
                        fontSize: materialIconSize,
                        color:
                            theme.palette.mode === "dark"
                                ? theme.palette.primary[200]
                                : theme.palette.secondary.main,
                    }}
                />
            ),
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
                    <InputLabel
                        id="instance-select-label"
                        htmlFor="instance-select"
                        sx={{
                            color:
                                theme.palette.mode === "dark"
                                    ? theme.palette.primary[200]
                                    : theme.palette.secondary.main,
                        }}
                    >
                        Instance
                    </InputLabel>
                    <Select
                        labelId="instance-select-label"
                        id="instance-select"
                        value={selectedInstance}
                        label="Instance"
                        onChange={handleInstanceSelectChange}
                        sx={{
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
                        }}
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
                    </Select>
                </FormControl>
            ),
        },
        {
            id: 2,
            name: "Lockout",
            icon: (
                <EditCalendarIcon
                    sx={{
                        fontSize: materialIconSize,
                        color:
                            theme.palette.mode === "dark"
                                ? theme.palette.primary[200]
                                : theme.palette.secondary.main,
                    }}
                />
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
