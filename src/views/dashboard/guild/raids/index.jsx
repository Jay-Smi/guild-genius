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
import { useAllGuildsCharacters } from "../../../../hooks/character/useCharacters";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Container,
    Divider,
    Grid,
    Typography,
    useTheme,
} from "@mui/material";

import RaidHeader from "./raid-header";
import Raid from "./raid";

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
    const theme = useTheme();
    const isLoadingAny =
        isLoadingLockouts ||
        isLoadingGroups ||
        isLoadingRaids ||
        isLoadingLockout ||
        isLoadingGuildCharacters ||
        isLoadingGroupCharacters;

    const [value, setValue] = useState(0);

    const userCharacterIds = characters.map((character) => character.id);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    if (isLoadingAny) return <Loader />;
    const selectedLockout = allGuildInstanceLockouts[value];
    return (
        <Grid container>
            <Grid item xs={0} sm={0} md={1} lg={2} xl={3} />
            <Grid
                item
                xs={12}
                sm={12}
                md={10}
                lg={8}
                xl={6}
                sx={{
                    bgcolor: "background.paper",
                    borderRadius: borderRadius,
                    boxShadow:
                        theme.palette.mode === "dark"
                            ? "4px 5px 5px 2px rgba(0, 0, 0, 0.459)"
                            : " 2px 3px 10px 1px rgba(0, 0, 0, 0.155)",
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
            </Grid>
            <Grid item xs={0} sm={0} md={1} lg={2} xl={3} />
            <Grid item xs={0} sm={0} md={1} lg={2} xl={3} />
            <Grid item xs={12} sm={12} md={10} lg={8} xl={6}>
                {raids
                    .filter(
                        (raid) =>
                            raid.guild_instance_lockout_id ===
                            selectedLockout.id
                    )
                    .map((raid) => {
                        const raidsGroups = groups.filter(
                            (group) => group.raid_id === raid.id
                        );

                        return (
                            <Raid
                                key={raid.id}
                                borderRadius={borderRadius}
                                raidsGroups={raidsGroups}
                                raid={raid}
                                guildCharacters={guildCharacters}
                                guildGroupCharacters={guildGroupCharacters}
                                userCharacterIds={userCharacterIds}
                            />
                        );
                    })}
            </Grid>
        </Grid>
    );
}

export default GuildRaids;
