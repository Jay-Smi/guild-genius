import {
    Autocomplete,
    Box,
    Divider,
    Grid,
    Stack,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { gridSpacing } from "../../../../../store/constant";
import { useStore } from "../../../../../store";

function RoleMatch({
    roles,
    assignedRoles,
    handleRoleChange,
    validationErrors,
    setValidationErrors,
}) {
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
                Match roles to guild ranks
            </Typography>
            <Stack
                spacing={3}
                sx={{
                    width: "100%",
                }}
            >
                <Autocomplete
                    multiple
                    id="gm-match"
                    options={roles}
                    getOptionLabel={(option) => option}
                    value={assignedRoles.gm}
                    filterSelectedOptions
                    renderInput={(params) => (
                        <TextField {...params} label="Guild Master" />
                    )}
                    sx={{ "& :hover": { cursor: "pointer" } }}
                    onChange={(e, value) => handleRoleChange("gm", value)}
                />

                <Autocomplete
                    multiple
                    id="officer-match"
                    options={roles}
                    getOptionLabel={(option) => option}
                    value={assignedRoles.officer}
                    filterSelectedOptions
                    renderInput={(params) => (
                        <TextField {...params} label="Officer" />
                    )}
                    sx={{ "& :hover": { cursor: "pointer" } }}
                    onChange={(e, value) => handleRoleChange("officer", value)}
                />

                <Autocomplete
                    multiple
                    id="member-match"
                    options={roles}
                    getOptionLabel={(option) => option}
                    value={assignedRoles.member}
                    filterSelectedOptions
                    renderInput={(params) => (
                        <TextField {...params} label="Member" />
                    )}
                    sx={{ "& :hover": { cursor: "pointer" } }}
                    onChange={(e, value) => handleRoleChange("member", value)}
                />

                <Autocomplete
                    multiple
                    id="trial-match"
                    options={roles}
                    getOptionLabel={(option) => option}
                    value={assignedRoles.trial}
                    filterSelectedOptions
                    renderInput={(params) => (
                        <TextField {...params} label="Trial" />
                    )}
                    sx={{ "& :hover": { cursor: "pointer" } }}
                    onChange={(e, value) => handleRoleChange("trial", value)}
                />
            </Stack>
        </Box>
    );
}

export default RoleMatch;
