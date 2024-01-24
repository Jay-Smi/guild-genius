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
} from "@mui/material";

function AlteredTabAlert() {
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
            <Dialog open onClose={handleCloseAlert}>
                <DialogTitle>Warning!</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {` Altering anything in the "All" tab will overwrite any
                        changes made in the other lockouts' tabs you've
                        selected.`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAlert}>I understand</Button>
                </DialogActions>
            </Dialog>
        )
    );
}

export default AlteredTabAlert;
