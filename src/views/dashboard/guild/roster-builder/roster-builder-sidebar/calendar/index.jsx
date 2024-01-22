import {
    Accordion,
    AccordionSummary,
    Button,
    IconButton,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import WeekPicker from "./WeekPicker";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { format, parseISO } from "date-fns";
import DeleteIcon from "@mui/icons-material/Delete";

export default function SidebarCalendar({
    hoveredDay,
    setHoveredDay,
    selectedLockout,
    setSelectedLockout,
    chosenLockouts,
    handleAddLockout,
    handleDeleteLockout,
}) {
    return (
        <>
            <WeekPicker
                hoveredDay={hoveredDay}
                setHoveredDay={setHoveredDay}
                value={selectedLockout}
                setValue={setSelectedLockout}
                chosenLockouts={chosenLockouts}
            />
            <Button variant="contained" onClick={handleAddLockout}>
                Add Lockout
            </Button>
            <Accordion>
                <AccordionSummary
                    aria-controls="selected-lockouts-manage"
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography variant="h4" fontSize="16px" color="inherit">
                        Selected Lockouts
                    </Typography>
                </AccordionSummary>
                <Stack spacing={1} sx={{ mt: 2 }}>
                    {chosenLockouts.map((lockout) => {
                        if (lockout.type === "all") return;
                        return (
                            <Paper
                                key={crypto.randomUUID()}
                                elevation={2}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    fontSize="16px"
                                    color="inherit"
                                    sx={{ ml: 2 }}
                                >
                                    {format(
                                        parseISO(lockout.startDate),
                                        "MMM dd"
                                    )}
                                    {" - "}
                                    {format(
                                        parseISO(lockout.endDate),
                                        "MMM dd"
                                    )}
                                </Typography>
                                <IconButton
                                    onClick={() => handleDeleteLockout(lockout)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Paper>
                        );
                    })}
                </Stack>
            </Accordion>
        </>
    );
}
