import {
    Button,
    Divider,
    IconButton,
    Popover,
    Tooltip,
    useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function NonCategoryContainerButtons({
    type,
    handleClickPopper,
    handleClosePopper,
    popperId,
    anchorOpen,
    popperAnchor,
    onRemove,
}) {
    const theme = useTheme();
    return (
        <>
            <Tooltip title={type === "raid" ? "Delete Raid" : "Delete Group"}>
                <IconButton
                    onClick={handleClickPopper}
                    size="small"
                    sx={{ borderRadius: 1 }}
                >
                    <DeleteIcon sx={{ width: "20px" }} />
                </IconButton>
            </Tooltip>
            <Divider
                orientation="vertical"
                flexItem
                sx={{
                    borderRightWidth: 2,
                    borderColor: theme.palette.grey[400],
                    marginRight: 1,
                    marginLeft: 1,
                }}
            />
            <Popover
                id={popperId}
                open={anchorOpen}
                anchorEl={popperAnchor}
                onClose={handleClosePopper}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <Button variant="contained" onClick={onRemove}>
                    Delete
                </Button>
            </Popover>
        </>
    );
}

export default NonCategoryContainerButtons;
