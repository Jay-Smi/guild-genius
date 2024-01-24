import { Divider, IconButton, Tooltip, useTheme } from "@mui/material";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import EditAttributesIcon from "@mui/icons-material/EditAttributes";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";

import { useContext } from "react";
import { RosterContext } from "../../store/RosterContextProvider";
import { useStore } from "zustand";
import ChooseDate from "./ChooseDate";
import ChooseTime from "./ChooseTime";

function RaidContainerButtons({ handleAddGroup, handleClickOpenDialog, id }) {
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
                    <ChooseDate id={id} />

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
                    <ChooseTime id={id} />
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
