import Box from "@mui/material/Box";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import { useStore } from "../../../../store";
import useUserInfo from "../../../../hooks/useUserInfo";
import useGuild from "../../../../hooks/useGuild";
import { getLockoutStartAndEndDates } from "../../../../utils/wowHelpers";
import {
    useAllGuildInstanceLockouts,
    useGuildInstanceLockout,
} from "../../../../hooks/useGuildInstanceLockout";
import Loader from "../../../../components/Loader";
import { format, formatISO, parseISO } from "date-fns";
import { useAllGuildsRaids } from "../../../../hooks/useRaids";
import {
    useAllGuildsGroupCharacters,
    useAllGuildsGroups,
} from "../../../../hooks/useGroups";
import { useAllGuildsCharacters } from "../../../../hooks/useCharacters";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Container,
    Grid,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function GuildRaids() {
    //user, profile, characters, players, guild, currentGuildInstanceLockout
    const borderRadius = useStore((state) => state.borderRadius);
    const user = useStore((state) => state.session.user);
    const setUserHasGuild = useStore((state) => state.setUserHasGuild);
    const displayName =
        user.user_metadata.custom_claims.global_name ||
        user.user_metadata.full_name;
    const userId = user.id;
    const discordName = user.user_metadata.name;

    const { profile, characters, players, isLoading, error } = useUserInfo(
        userId,
        discordName
    );

    const mainCharacterId = players[0].main_character || characters[0]?.id;
    const mainCharacter = characters.find(
        (character) => character.id === mainCharacterId
    );
    const mainGuildId = mainCharacter?.guild_id;
    const { guild, isLoadingGuild, errorGuild } = useGuild(mainGuildId);
    const today = new Date();
    const { startDate, endDate } = getLockoutStartAndEndDates(today);
    const {
        lockout: currentLockout,
        lockoutError,
        isLoadingLockout,
    } = useGuildInstanceLockout(startDate, mainGuildId);
    const {
        lockouts: allGuildInstanceLockouts,
        lockoutsError,
        isLoadingLockouts,
    } = useAllGuildInstanceLockouts(mainGuildId);
    const { groups, groupsError, isLoadingGroups } =
        useAllGuildsGroups(mainGuildId);
    const { guildCharacters, guildCharactersError, isLoadingGuildCharacters } =
        useAllGuildsCharacters(mainGuildId);
    const {
        guildGroupCharacters,
        groupCharactersError,
        isLoadingGroupCharacters,
    } = useAllGuildsGroupCharacters(mainGuildId);
    const { raids, raidsError, isLoadingRaids } =
        useAllGuildsRaids(mainGuildId);

    const isLoadingAny =
        isLoadingLockouts ||
        isLoadingGroups ||
        isLoadingRaids ||
        isLoadingLockout ||
        isLoadingGuildCharacters ||
        isLoadingGroupCharacters;

    const [value, setValue] = useState(0);

    if (isLoadingAny) return <Loader />;
    console.log(guildCharacters);
    const selectedLockout = allGuildInstanceLockouts[value];
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Container>
            <Box
                sx={{
                    flexGrow: 1,
                    // maxWidth: { xs: 320, sm: 480, md: 600, lg: 800, xl: 1000 },
                    width: "100%",
                    bgcolor: "background.paper",
                    borderRadius: borderRadius,
                }}
            >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons
                    aria-label="visible arrows tabs example"
                    sx={{
                        [`& .${tabsClasses.scrollButtons}`]: {
                            "&.Mui-disabled": { opacity: 0.3 },
                        },
                    }}
                >
                    {allGuildInstanceLockouts.map((lockout) => {
                        const startDate = format(
                            parseISO(lockout.start_date),
                            "MMM dd"
                        );
                        const endDate = format(
                            parseISO(lockout.end_date),
                            "MMM dd"
                        );
                        return (
                            <Tab
                                label={`${startDate} - ${endDate}`}
                                key={lockout.id}
                            />
                        );
                    })}
                </Tabs>
            </Box>
            {raids
                .filter(
                    (raid) =>
                        raid.guild_instance_lockout_id === selectedLockout.id
                )
                .map((raid) => {
                    return (
                        <Accordion
                            key={raid.id}
                            defaultExpanded
                            sx={{ borderRadius: borderRadius / 2, p: 1 }}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h4">
                                    {format(parseISO(raid.date), "MMM dd")}
                                </Typography>
                                <Typography variant="h4">
                                    {raid.name}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container>
                                    {groups
                                        .filter(
                                            (group) => group.raid_id === raid.id
                                        )
                                        .map((group) => {
                                            return (
                                                <Grid
                                                    item
                                                    key={group.id}
                                                    lg={6}
                                                    md={6}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <Container
                                                        sx={{
                                                            display: "flex",
                                                            flexDirection:
                                                                "column",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        <Typography variant="h5">
                                                            {group.name}
                                                        </Typography>
                                                        {guildGroupCharacters
                                                            .filter(
                                                                (
                                                                    guildGroupCharacter
                                                                ) =>
                                                                    guildGroupCharacter.group_id ===
                                                                    group.id
                                                            )
                                                            .map(
                                                                (
                                                                    guildGroupCharacter
                                                                ) => {
                                                                    return (
                                                                        <div
                                                                            key={
                                                                                guildGroupCharacter.id
                                                                            }
                                                                        >
                                                                            {guildCharacters
                                                                                ?.filter(
                                                                                    (
                                                                                        guildCharacter
                                                                                    ) =>
                                                                                        guildCharacter.id ===
                                                                                        guildGroupCharacter.character_id
                                                                                )
                                                                                .map(
                                                                                    (
                                                                                        guildCharacter
                                                                                    ) => {
                                                                                        return (
                                                                                            <div
                                                                                                key={
                                                                                                    guildCharacter.id
                                                                                                }
                                                                                            >
                                                                                                <Typography variant="h6">
                                                                                                    {
                                                                                                        guildCharacter.character_name
                                                                                                    }
                                                                                                </Typography>
                                                                                            </div>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                    </Container>
                                                </Grid>
                                            );
                                        })}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
        </Container>
    );
}

export default GuildRaids;
