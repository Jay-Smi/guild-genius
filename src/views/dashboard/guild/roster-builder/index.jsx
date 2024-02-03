import { useGuildInstanceLockout } from "../../../../hooks/useGuildInstanceLockout";
import { useState } from "react";
import {
    getLockoutStartAndEndDates,
    isHealer,
    isMelee,
    isRanged,
    isTank,
} from "../../../../utils/wowHelpers";
import { isEqual, parseISO } from "date-fns";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import {
    Box,
    Divider,
    Paper,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import RosterBuilderSidebar from "./roster-builder-sidebar";
import LockoutTabs from "./lockout-tabs/LockoutTabs";
import SidebarItems from "./roster-builder-sidebar/sidebar-items";
import RosterBuilderActual from "./dnd/RosterBuilderActual";
import { useAllGuildsCharacters } from "../../../../hooks/character/useCharacters";
import { useStore } from "../../../../store";
import useAllGuildsPlayers from "../../../../hooks/player/useAllGuildsPlayers";
import useUserInfo from "../../../../hooks/useUserInfo";
import useAllGuildCharacterTags from "../../../../hooks/character/useAllGuildCharacterTags";
import Loader from "../../../../components/Loader";
import { IconFileFilled } from "@tabler/icons-react";
import RosterContextProvider from "./store/RosterContextProvider";
import AlteredTabAlert from "./components/AlteredTabAlert";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DndContext } from "@dnd-kit/core";
import DndProvider from "./dnd/DndProvider";
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export default function RosterBuilder() {
    const theme = useTheme();
    const matchUpLg = useMediaQuery(theme.breakpoints.up("lg"));
    const user = useStore((state) => state.session.user);
    const userId = user.id;
    const discordName = user.user_metadata.name;
    const { profile, characters, players, isLoading, error } = useUserInfo(
        userId,
        discordName
    );
    const activePlayer = players.find(
        (player) => player.id === profile[0].active_player_id
    );

    const mainGuildId = activePlayer?.guild_id;
    const { guildCharacters, isLoadingCharacters, errorCharacters } =
        useAllGuildsCharacters(mainGuildId);
    const { guildPlayers, isLoadingPlayers, errorPlayers } =
        useAllGuildsPlayers(mainGuildId);
    const { guildCharacterTags, isLoadingCharacterTags, errorCharacterTags } =
        useAllGuildCharacterTags(mainGuildId);

    const isLoadingAny =
        isLoadingCharacters ||
        isLoadingPlayers ||
        isLoadingCharacterTags ||
        guildCharacters === undefined ||
        guildCharacterTags === undefined ||
        guildPlayers === undefined;

    const tagCategories = [];
    const roleCategories = [
        { id: "tanks", name: "Tanks", type: "category", data: [] },
        { id: "healers", name: "Healers", type: "category", data: [] },
        { id: "melee", name: "Melee", type: "category", data: [] },
        { id: "ranged", name: "Ranged", type: "category", data: [] },
    ];

    let categories = [];
    let modifiedCharacters = null;
    if (!mainGuildId)
        return <Typography>Join a guild to use the roster builder</Typography>;
    if (!isLoadingAny) {
        const extractedCharacterTags = guildCharacterTags.map((tag) => {
            return tag.tag_name;
        });

        const uniqueCharacterTags = [...new Set(extractedCharacterTags)];
        const tagMap = {};

        uniqueCharacterTags?.forEach((tagName) => {
            tagCategories.push({
                id: tagName,
                name: tagName,
                type: "category",
                data: [],
            });

            const characterIds = guildCharacterTags
                .filter((tagObj) => tagObj.tag_name === tagName)
                .map((tagObj) => tagObj.character_id);

            if (!tagMap[tagName]) {
                tagMap[tagName] = [];
            }

            tagMap[tagName].push(...characterIds);
        });

        guildCharacters?.forEach((character) => {
            const {
                id,
                character_name: name,
                class: characterClass,
            } = character;

            // Check if the character has a tag
            const tagMatch = guildCharacterTags.find(
                (tagObj) => tagObj.character_id === id
            );

            if (tagMatch) {
                const tags = guildCharacterTags
                    .filter((tag) => tag.character_id === id)
                    .map((tag) => tag.tag_name);
                character.tags = tags;
                const tagCategory = tagCategories.find(
                    (category) => category.name === tagMatch.tag_name
                );

                if (tagCategory) {
                    tagCategory.data.push(id);
                }
            } else {
                // Character doesn't have a tag, place them in a category based on role
                let role = "";
                if (isTank(character)) role = "Tanks";
                else if (isHealer(character)) role = "Healers";
                else if (isMelee(character)) role = "Melee";
                else if (isRanged(character)) role = "Ranged";
                else console.warn("Character has no role: ", character);

                const category = roleCategories.find(
                    (category) => category.name === role
                );

                if (category) {
                    category.data.push(id);
                }
            }
        });

        categories = [...tagCategories, ...roleCategories];

        modifiedCharacters = guildCharacters?.map((character) => {
            const charPlayer = guildPlayers.find((player) => {
                return character.player_name === player.name;
            });
            return {
                ...character,
                player: charPlayer,
            };
        });
    }

    return isLoadingAny ||
        categories.length === 0 ||
        modifiedCharacters === null ? (
        <Loader />
    ) : (
        <RosterContextProvider
            categories={categories}
            characters={modifiedCharacters}
            players={guildPlayers}
            characterTags={guildCharacterTags}
        >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box
                    sx={{
                        mr: matchUpLg ? "334px" : "40px",
                        backgroundColor:
                            theme.palette.mode === "dark"
                                ? theme.palette.background.dark3
                                : theme.palette.grey[100],
                    }}
                >
                    <LockoutTabs />
                    <Divider
                        sx={{
                            mt: 1,
                            mb: 1,
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
                    <DndProvider />
                </Box>

                <RosterBuilderSidebar />
                <AlteredTabAlert />
            </LocalizationProvider>
        </RosterContextProvider>
    );

    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }
    // return (
    //     <RosterBuilderActual
    //         categories={categories}
    //         characters={characters}
    //         raids={raids}
    //         groups={groups}
    //         players={players}
    //     />
    // );
}
