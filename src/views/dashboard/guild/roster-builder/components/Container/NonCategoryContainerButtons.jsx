import {
    Button,
    Divider,
    IconButton,
    Popover,
    Tooltip,
    styled,
    useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMemo, useRef } from "react";

const StyledDivider = styled(Divider)(({ theme }) => ({
    borderRightWidth: 2,
    borderColor:
        theme.palette.mode === "dark"
            ? theme.palette.text.hint
            : theme.palette.grey[400],
    marginRight: "5px",
    marginLeft: "5px",
}));
const StyledIconButton = styled(IconButton)(({ theme }) => ({
    borderRadius: "5px",
}));

const StyledDeleteIcon = styled(DeleteIcon)(({ theme }) => ({
    width: "20px",
    color:
        theme.palette.mode === "dark"
            ? theme.palette.text.hint
            : theme.palette.grey[500],
}));

function NonCategoryContainerButtons({
    type,
    handleClickPopper,
    handleClosePopper,
    popperId,
    anchorOpen,
    popperAnchor,
    onRemove,
}) {
    const anchorOrigin = useRef({
        vertical: "bottom",
        horizontal: "left",
    });
    return (
        <>
            <Tooltip title={type === "raid" ? "Delete Raid" : "Delete Group"}>
                <StyledIconButton onClick={handleClickPopper} size="small">
                    <StyledDeleteIcon />
                </StyledIconButton>
            </Tooltip>
            <StyledDivider orientation="vertical" flexItem />
            <Popover
                id={popperId}
                open={anchorOpen}
                anchorEl={popperAnchor}
                onClose={handleClosePopper}
                anchorOrigin={anchorOrigin.current}
            >
                <Button variant="contained" onClick={onRemove}>
                    Delete
                </Button>
            </Popover>
        </>
    );
}

export default NonCategoryContainerButtons;
