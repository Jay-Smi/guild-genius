import {
    Autocomplete,
    Box,
    Stack,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { useStore } from "../../../../../store";

function TagMatch({ roles }) {
    const theme = useTheme();
    const borderRadius = useStore((state) => state.borderRadius);
    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: borderRadius / 2,
                p: 2,
                boxShadow: "0 7px 8px 4px rgb(0 0 0 / 40%)",
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    pb: 2,
                    mb: 2,
                    borderBottom: `1px solid ${theme.palette.background.dark1}`,
                }}
                align="center"
            >
                Apply roles as tags
            </Typography>
            <Stack
                spacing={3}
                sx={{
                    width: "100%",
                }}
            >
                <Autocomplete
                    multiple
                    disabled
                    id="tag-match"
                    options={roles}
                    getOptionLabel={(option) => option}
                    defaultValue={[]}
                    filterSelectedOptions
                    renderInput={(params) => (
                        <TextField {...params} label="Tags" />
                    )}
                    sx={{ "& :hover": { cursor: "pointer" } }}
                />
            </Stack>
        </Box>
    );
}

export default TagMatch;
