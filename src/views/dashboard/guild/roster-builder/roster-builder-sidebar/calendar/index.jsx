import {
    Accordion,
    AccordionSummary,
    Button,
    IconButton,
    Paper,
    Stack,
    Typography,
    styled,
} from "@mui/material";
import WeekPicker from "./WeekPicker";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { format, parseISO } from "date-fns";
import DeleteIcon from "@mui/icons-material/Delete";

const StyledStack = styled(Stack)(({ theme }) => ({
    mt: 2,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
}));

const StyledTypography = styled(Typography)(({ theme }) => ({ ml: 2 }));

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
                Select Lockout
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
                <StyledStack spacing={1}>
                    {chosenLockouts.map((lockout) => {
                        if (lockout.type === "all") return;
                        return (
                            <StyledPaper
                                key={crypto.randomUUID()}
                                elevation={2}
                            >
                                <StyledTypography
                                    variant="h4"
                                    fontSize="16px"
                                    color="inherit"
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
                                </StyledTypography>
                                <IconButton
                                    onClick={() => {
                                        handleDeleteLockout(lockout);
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </StyledPaper>
                        );
                    })}
                </StyledStack>
            </Accordion>
        </>
    );
}
