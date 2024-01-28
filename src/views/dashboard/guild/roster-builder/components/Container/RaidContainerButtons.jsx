import { Divider, IconButton, Tooltip, styled, useTheme } from "@mui/material";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import EditAttributesIcon from "@mui/icons-material/EditAttributes";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";

import { useContext } from "react";
import { RosterContext } from "../../store/RosterContextProvider";
import { useStore } from "zustand";
import ChooseDate from "./ChooseDate";
import ChooseTime from "./ChooseTime";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    borderRadius: "5px",
}));

const StyledAddToPhotosIcon = styled(AddToPhotosIcon)(({ theme }) => ({
    width: "20px",
    color:
        theme.palette.mode === "dark"
            ? theme.palette.text.hint
            : theme.palette.grey[500],
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
    borderRightWidth: 2,
    borderColor:
        theme.palette.mode === "dark"
            ? theme.palette.text.hint
            : theme.palette.grey[400],
    marginRight: "5px",
    marginLeft: "5px",
}));

const StyledEditAttributesIcon = styled(EditAttributesIcon)(({ theme }) => ({
    width: "20px",
    color:
        theme.palette.mode === "dark"
            ? theme.palette.text.hint
            : theme.palette.grey[500],
}));

function RaidContainerButtons({ handleAddGroup, handleClickOpenDialog, id }) {
    const rosterStore = useContext(RosterContext);
    const selectedTab = useStore(rosterStore, (state) => state.selectedTab);
    return (
        <>
            <Tooltip title="Add Group">
                <StyledIconButton onClick={handleAddGroup} size="small">
                    <StyledAddToPhotosIcon />
                </StyledIconButton>
            </Tooltip>
            <StyledDivider orientation="vertical" flexItem />
            {/*///////////////////////////////////////////////////*/}
            {selectedTab !== 0 && (
                <>
                    <ChooseDate id={id} />

                    <StyledDivider orientation="vertical" flexItem />
                    {/*///////////////////////////////////////////////////*/}
                    <ChooseTime id={id} />
                    <StyledDivider orientation="vertical" flexItem />
                </>
            )}
            {/*///////////////////////////////////////////////////*/}
            <Tooltip title="Edit Tags">
                <StyledIconButton onClick={handleClickOpenDialog} size="small">
                    <StyledEditAttributesIcon />
                </StyledIconButton>
            </Tooltip>
            <StyledDivider orientation="vertical" flexItem />
        </>
    );
}

export default RaidContainerButtons;
