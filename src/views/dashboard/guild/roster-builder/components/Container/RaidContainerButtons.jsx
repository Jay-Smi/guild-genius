import { Divider, IconButton, Tooltip, useTheme } from "@mui/material";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import EditAttributesIcon from "@mui/icons-material/EditAttributes";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useContext } from "react";
import { RosterContext } from "../../store/RosterContextProvider";
import { useStore } from "zustand";

function RaidContainerButtons({ handleAddGroup, handleClickOpenDialog }) {
    const theme = useTheme();
    const rosterStore = useContext(RosterContext);
    const selectedTab = useStore(rosterStore, (state) => state.selectedTab);
    return (
        <>
            <Tooltip title="Add Group">
                <IconButton
                    onClick={handleAddGroup}
                    size="small"
                    sx={{ borderRadius: 1 }}
                >
                    <AddToPhotosIcon sx={{ width: "20px" }} />
                </IconButton>
            </Tooltip>
            <Divider
                orientation="vertical"
                flexItem
                color={theme.palette.primary.main}
                sx={{
                    borderRightWidth: 2,
                    borderColor: theme.palette.grey[400],
                    marginRight: 1,
                    marginLeft: 1,
                }}
            />
            {/*///////////////////////////////////////////////////*/}
            {selectedTab !== 0 && (
                <>
                    <Tooltip title="Choose Date">
                        <IconButton
                            onClick={() => {}}
                            size="small"
                            sx={{ borderRadius: 1 }}
                        >
                            <EventIcon sx={{ width: "20px" }} />
                        </IconButton>
                    </Tooltip>
                    <Divider
                        orientation="vertical"
                        flexItem
                        color={theme.palette.primary.main}
                        sx={{
                            borderRightWidth: 2,
                            borderColor: theme.palette.grey[400],
                            marginRight: 1,
                            marginLeft: 1,
                        }}
                    />
                    {/*///////////////////////////////////////////////////*/}
                    <Tooltip title="Choose Time">
                        <IconButton
                            onClick={() => {}}
                            size="small"
                            sx={{ borderRadius: 1 }}
                        >
                            <AccessTimeIcon sx={{ width: "20px" }} />
                        </IconButton>
                    </Tooltip>
                    <Divider
                        orientation="vertical"
                        flexItem
                        color={theme.palette.primary.main}
                        sx={{
                            borderRightWidth: 2,
                            borderColor: theme.palette.grey[400],
                            marginRight: 1,
                            marginLeft: 1,
                        }}
                    />
                </>
            )}
            {/*///////////////////////////////////////////////////*/}
            <Tooltip title="Edit Tags">
                <IconButton
                    onClick={handleClickOpenDialog}
                    size="small"
                    sx={{ borderRadius: 1 }}
                >
                    <EditAttributesIcon sx={{ width: "20px" }} />
                </IconButton>
            </Tooltip>
            <Divider
                orientation="vertical"
                flexItem
                color={theme.palette.primary.main}
                sx={{
                    borderRightWidth: 2,
                    borderColor: theme.palette.grey[400],
                    marginRight: 1,
                    marginLeft: 1,
                }}
            />
        </>
    );
}

export default RaidContainerButtons;
