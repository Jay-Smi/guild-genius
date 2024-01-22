import { mdiAxeBattle } from "@mdi/js";
import Icon from "@mdi/react";
import { MenuItem, Select, useMediaQuery, useTheme } from "@mui/material";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";

import SettingsIcon from "@mui/icons-material/Settings";
import SidebarCalendar from "./calendar";

export default function SidebarItems({
    instanceSelectValue,
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
            id: 1,
            name: "Instance",
            icon: (
                <Icon
                    path={mdiAxeBattle}
                    size={mdiIconSize}
                    color={theme.palette.secondary.main}
                />
            ),
            content: (
                <Select
                    labelId="instance-select-label"
                    id="instance-select"
                    value={instanceSelectValue}
                    label="Instance"
                    onChange={handleInstanceSelectChange}
                >
                    <MenuItem value="Blackfathom_Deeps">
                        Blackfathom Deeps
                    </MenuItem>
                    <MenuItem value="Gnomeregan">Gnomeregan</MenuItem>
                </Select>
            ),
        },
        {
            id: 2,
            name: "Lockout",
            icon: (
                <EditCalendarIcon
                    sx={{
                        fontSize: materialIconSize,
                        color: theme.palette.secondary.main,
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
        {
            id: 3,
            name: "Settings",
            icon: (
                <SettingsIcon
                    sx={{
                        fontSize: materialIconSize,
                        color: theme.palette.secondary.main,
                    }}
                />
            ),
            content: null,
        },
    ];
}
