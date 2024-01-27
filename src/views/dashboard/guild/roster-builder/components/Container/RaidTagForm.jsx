import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    Stack,
    Switch,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { useRef } from "react";

function RaidTagForm({
    container,
    tagDialogOpen,
    handleCloseDialog,
    tagForm,
    handleToggleChecked,
    handleSetValue,
    handleSaveTagForm,
    tagsArray,
}) {
    const inputRefs = useRef([]);
    const theme = useTheme();
    function handleFocus(tag, index) {
        handleToggleChecked(tag);
        setTimeout(() => {
            inputRefs.current[index].focus();
        }, 0);
    }
    return (
        <Dialog open={tagDialogOpen} onClose={handleCloseDialog}>
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "1.5em",
                    color:
                        theme.palette.mode === "dark"
                            ? "text.dark"
                            : "primary.dark",
                }}
            >
                {container.name}
            </DialogTitle>
            <Divider sx={{ mb: 2 }} />
            <DialogContent>
                <DialogContentText>
                    Set the number of tags (0 for exclusive) to control raid
                    composition.
                </DialogContentText>
                <Divider sx={{ mt: 2, mb: 2 }} />
                <Stack spacing={1}>
                    {tagsArray.map((tag, index) => {
                        return (
                            <Grid container key={tag}>
                                <Grid
                                    item
                                    xs={5}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography
                                        color={
                                            theme.palette.mode === "dark"
                                                ? "text.dark"
                                                : "primary.dark"
                                        }
                                    >
                                        {tag}
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={2}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Switch
                                        checked={tagForm[tag].checked}
                                        onChange={() => handleFocus(tag, index)}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={5}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <TextField
                                        type="number"
                                        sx={{
                                            width: "50%",
                                            "& input": {
                                                color:
                                                    theme.palette.mode ===
                                                    "dark"
                                                        ? "text.dark"
                                                        : "primary.dark",
                                            },
                                        }}
                                        inputProps={{
                                            sx: {
                                                textAlign: "center",
                                            },
                                        }}
                                        value={tagForm[tag].amount ?? ""}
                                        onChange={(e) =>
                                            handleSetValue(tag, e.target.value)
                                        }
                                        disabled={!tagForm[tag].checked}
                                        required={true}
                                        inputRef={(ref) =>
                                            (inputRefs.current[index] = ref)
                                        }
                                    />
                                </Grid>
                            </Grid>
                        );
                    })}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleSaveTagForm} variant="contained">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default RaidTagForm;
