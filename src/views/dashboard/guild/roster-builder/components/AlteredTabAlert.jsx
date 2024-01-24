import { useStore } from "zustand";
import { RosterContext } from "../store/RosterContextProvider";
import { useContext } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useTheme,
} from "@mui/material";

function AlteredTabAlert() {
    const theme = useTheme();
    const rosterStore = useContext(RosterContext);
    const hasAlteredTabContainer = useStore(
        rosterStore,
        (state) => state.hasAlteredTabContainer
    );

    const hasAcknowledgedTabContainer = useStore(
        rosterStore,
        (state) => state.hasAcknowledgedAlteredTabContainer
    );

    const setHasAcknowledgedAlteredTabContainer = useStore(
        rosterStore,
        (state) => state.setHasAcknowledgedAlteredTabContainer
    );

    const selectedTab = useStore(rosterStore, (state) => state.selectedTab);

    const shouldDisplayAlert =
        hasAlteredTabContainer &&
        !hasAcknowledgedTabContainer &&
        selectedTab === 0;

    function handleCloseAlert() {
        setHasAcknowledgedAlteredTabContainer(true);
    }

    return (
        shouldDisplayAlert && (
            <Dialog
                open
                onClose={handleCloseAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="xs"
            >
                <DialogTitle
                    id="alert-dialog-title"
                    sx={{
                        m: 0,
                        p: 2,
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: theme.palette.error.dark,
                        textAlign: "center",
                    }}
                >
                    Warning!
                </DialogTitle>
                <DialogContent dividers>
                    <DialogContentText
                        id="alert-dialog-description"
                        sx={{ padding: "0 2rem", fontSize: "1rem" }}
                    >
                        {` Altering anything in the "All" tab will overwrite any
                        changes made in the other lockouts' tabs you've
                        selected.`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleCloseAlert}
                        autoFocus
                        sx={{
                            fontSize: "1rem",
                            fontWeight: "bold",
                            color: theme.palette.grey[50],
                        }}
                    >
                        I understand
                    </Button>
                </DialogActions>
            </Dialog>
        )
    );
}

export default AlteredTabAlert;
