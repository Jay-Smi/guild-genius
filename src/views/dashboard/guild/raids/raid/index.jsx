import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    ButtonBase,
    Container,
    Divider,
    Grid,
    Typography,
    useTheme,
} from "@mui/material";
import RaidHeader from "../raid-header";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState } from "react";
import RaidGroup from "../group";

function Raid({
    raid,
    guildGroupCharacters,
    guildCharacters,
    raidsGroups,
    borderRadius,
    userCharacterIds,
}) {
    const theme = useTheme();
    const raidsCharacters = guildGroupCharacters.filter((groupCharacter) => {
        return raidsGroups.some(
            (group) => group.id === groupCharacter.group_id
        );
    });
    const raidContainsUser = raidsCharacters.some((character) =>
        userCharacterIds.includes(character.character_id)
    );
    const [raidOpen, setRaidOpen] = useState(raidContainsUser);
    const isDark = theme.palette.mode === "dark";
    const [parent, enableAnimations] = useAutoAnimate();
    const [headerParent, enableHeaderAnimations] = useAutoAnimate();
    return (
        <>
            <Divider
                sx={{
                    mt: 2,
                    mb: 2,
                    borderBottomWidth: "2px",
                    borderColor:
                        theme.palette.mode === "dark"
                            ? theme.palette.grey[600]
                            : theme.palette.grey[400],
                    boxShadow:
                        theme.palette.mode === "dark"
                            ? "4px 5px 5px 2px rgba(0, 0, 0, 0.459)"
                            : " 2px 3px 10px 1px rgba(0, 0, 0, 0.155)",
                }}
            />
            <Grid
                container
                sx={{
                    backgroundColor: theme.palette.background.dark2,
                    borderRadius: borderRadius / 2,
                    boxShadow:
                        theme.palette.mode === "dark"
                            ? "4px 5px 5px 2px rgba(0, 0, 0, 0.459)"
                            : " 2px 3px 10px 1px rgba(0, 0, 0, 0.155)",
                }}
            >
                <Grid item xs={12}>
                    <ButtonBase
                        onClick={() => setRaidOpen(!raidOpen)}
                        sx={{
                            width: "100%",
                            borderRadius: borderRadius / 2,
                            borderBottomLeftRadius: raidOpen
                                ? 0
                                : borderRadius / 2,
                            borderBottomRightRadius: raidOpen
                                ? 0
                                : borderRadius / 2,
                        }}
                        ref={headerParent}
                    >
                        <RaidHeader
                            raid={raid}
                            raidOpen={raidOpen}
                            borderRadius={borderRadius}
                        />
                    </ButtonBase>
                </Grid>
                <Grid item xs={12} ref={parent}>
                    {raidOpen && (
                        <Grid container>
                            {raidsGroups.map((group) => {
                                return (
                                    <Grid
                                        item
                                        key={group.id}
                                        lg={6}
                                        md={6}
                                        sm={6}
                                        xs={12}
                                    >
                                        <RaidGroup
                                            group={group}
                                            guildGroupCharacters={
                                                guildGroupCharacters
                                            }
                                            guildCharacters={guildCharacters}
                                            borderRadius={borderRadius}
                                            userCharacterIds={userCharacterIds}
                                        />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </>
    );
}

export default Raid;
