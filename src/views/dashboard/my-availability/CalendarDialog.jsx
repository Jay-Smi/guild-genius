import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Switch,
    TextField,
    Typography,
} from "@mui/material";

function CalendarDialog({
    dialogOpen,
    handleClose,
    dialogData,
    setDialogData,
    handleEventAdd,
    handleEventRemove,
    eventToDelete,
    dialogType,
}) {
    return (
        <Dialog open={dialogOpen} onClose={handleClose}>
            <DialogTitle>
                {" "}
                {dialogType === "create"
                    ? "Create Unavailability"
                    : "Delete Unavailability"}
            </DialogTitle>
            <DialogContent>
                {dialogType === "delete" && (
                    <Typography variant="body1">
                        Are you sure you want to delete this unavailability
                        event?
                    </Typography>
                )}
                {dialogType === "create" && (
                    <>
                        <TextField
                            autoFocus
                            id="notes"
                            name="notes"
                            label="Notes"
                            value={dialogData.notes}
                            onChange={(e) =>
                                setDialogData({
                                    ...dialogData,
                                    notes: e.target.value,
                                })
                            }
                            fullWidth
                        />
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Switch
                                checked={dialogData.repeating}
                                onChange={() =>
                                    setDialogData({
                                        ...dialogData,
                                        repeating: !dialogData.repeating,
                                    })
                                }
                            />
                            <Typography>Repeat Weekly</Typography>
                        </Box>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    onClick={
                        dialogType === "create"
                            ? handleEventAdd
                            : handleEventRemove
                    }
                >
                    {dialogType === "create" ? "Submit" : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CalendarDialog;
