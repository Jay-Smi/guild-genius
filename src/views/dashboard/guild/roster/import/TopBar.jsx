import {
    AppBar,
    Box,
    Button,
    IconButton,
    Toolbar,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function TopBar({ handleClose }) {
    return (
        <AppBar position="static">
            <Toolbar sx={{ padding: 1.5 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flex: "1",
                    }}
                >
                    <Box></Box>

                    <Typography variant="h3">Import Roster</Typography>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default TopBar;
