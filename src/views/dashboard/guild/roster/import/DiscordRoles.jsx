import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { useStore } from "../../../../../store";

function DiscordRoles({ roles }) {
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
                align="center"
                sx={{
                    pb: 2,
                    borderBottom: `1px solid ${theme.palette.background.dark1}`,
                }}
            >
                All Discord Roles
            </Typography>
            <Stack
                direction="row"
                flexWrap="wrap"
                spacing={1}
                useFlexGap
                sx={{ p: 2 }}
            >
                {roles.map((role) => (
                    <Chip key={role} label={role} size="small" />
                ))}
            </Stack>
        </Box>
    );
}

export default DiscordRoles;
