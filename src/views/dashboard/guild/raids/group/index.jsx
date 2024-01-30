import { Box, Container, Stack, Typography, useTheme } from "@mui/material";

function RaidGroup({
    group,
    guildGroupCharacters,
    guildCharacters,
    borderRadius,
    userCharacterIds,
}) {
    const theme = useTheme();
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                m: 2,
                backgroundColor: theme.palette.background.dark1,
                borderRadius: borderRadius / 2,
                boxShadow:
                    theme.palette.mode === "dark"
                        ? "4px 5px 5px 2px rgba(0, 0, 0, 0.459)"
                        : " 2px 3px 10px 1px rgba(0, 0, 0, 0.155)",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    p: 1,
                    borderTopLeftRadius: borderRadius * 2,
                    borderTopRightRadius: borderRadius * 2,
                    backgroundColor:
                        theme.palette.mode === "dark"
                            ? theme.palette.background.paper
                            : theme.palette.grey[500],
                    color:
                        theme.palette.mode === "dark"
                            ? theme.palette.text.dark
                            : theme.palette.grey[500],
                    borderBottom: `1px solid ${theme.palette.grey[500]}`,
                }}
            >
                <Typography variant="h5" color="inherit">
                    {group.name}
                </Typography>
            </Box>
            <Stack
                direction="column"
                alignItems="center"
                spacing={1}
                sx={{ mt: 1, mb: 2, width: "100%" }}
            >
                {guildGroupCharacters
                    .filter(
                        (guildGroupCharacter) =>
                            guildGroupCharacter.group_id === group.id
                    )
                    .map((guildGroupCharacter) => {
                        return guildCharacters
                            ?.filter(
                                (guildCharacter) =>
                                    guildCharacter.id ===
                                    guildGroupCharacter.character_id
                            )
                            .map((guildCharacter) => {
                                const lowerCaseClass =
                                    guildCharacter.class.toLowerCase();
                                const isUserCharacter =
                                    userCharacterIds.includes(
                                        guildCharacter.id
                                    );
                                return (
                                    <Box
                                        key={guildCharacter.id}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "80%",
                                            borderRadius: "5px",
                                            boxShadow:
                                                theme.palette.mode === "dark"
                                                    ? "4px 5px 5px 2px rgba(0, 0, 0, 0.459)"
                                                    : " 2px 3px 10px 1px rgba(0, 0, 0, 0.155)",
                                            backgroundColor: `${
                                                theme.palette.wow[
                                                    lowerCaseClass
                                                ]
                                            }${
                                                theme.palette.mode === "dark"
                                                    ? "B5"
                                                    : "F9"
                                            }`,
                                            borderRight: isUserCharacter
                                                ? `10px solid ${theme.palette.success.main}`
                                                : "10px solid transparent",
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                color:
                                                    theme.palette.mode ===
                                                    "dark"
                                                        ? theme.palette
                                                              .background.dark3
                                                        : theme.palette.text
                                                              .primary,
                                                fontSize: "1rem",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {guildCharacter.character_name}
                                        </Typography>
                                    </Box>
                                );
                            });
                    })}
            </Stack>
        </Box>
    );
}

export default RaidGroup;
