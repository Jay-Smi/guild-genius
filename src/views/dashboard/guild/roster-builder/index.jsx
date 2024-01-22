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
import { Box, Paper, useMediaQuery, useTheme } from "@mui/material";
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
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export default function RosterBuilder() {
    const theme = useTheme();
    const [selectedTab, setSelectedTab] = useState(0);
    const [hoveredDay, setHoveredDay] = useState(null);
    const [selectedLockout, setSelectedLockout] = useState(null);
    const [instanceSelectValue, setInstanceSelectValue] = useState("");
    const [chosenLockouts, setChosenLockouts] = useState([{ type: "all" }]);
    const matchUpLg = useMediaQuery(theme.breakpoints.up("lg"));
    const sideBarItems = SidebarItems({
        instanceSelectValue,
        handleInstanceSelectChange,
        hoveredDay,
        setHoveredDay,
        selectedLockout,
        setSelectedLockout,
        chosenLockouts,
        handleAddLockout,
        handleDeleteLockout,
    });

    /* Queries */
    const user = useStore((state) => state.session.user);
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
    const { guildCharacters, isLoadingCharacters, errorCharacters } =
        useAllGuildsCharacters(mainGuildId);
    const { guildPlayers, isLoadingPlayers, errorPlayers } =
        useAllGuildsPlayers(mainGuildId);
    const { guildCharacterTags, isLoadingCharacterTags, errorCharacterTags } =
        useAllGuildCharacterTags(mainGuildId);

    const isLoadingAny =
        isLoadingCharacters || isLoadingPlayers || isLoadingCharacterTags;

    const tagCategories = [];
    const roleCategories = [
        { id: "tanks", name: "Tanks", type: "category", data: [] },
        { id: "healers", name: "Healers", type: "category", data: [] },
        { id: "melee", name: "Melee", type: "category", data: [] },
        { id: "ranged", name: "Ranged", type: "category", data: [] },
    ];

    let categories = [];

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

        // Concatenate the tag and role categories
        categories = [...tagCategories, ...roleCategories];
    }
    console.log(guildPlayers);
    return (
        <>
            <Box sx={{ height: "100%", mr: matchUpLg ? "334px" : "40px" }}>
                <LockoutTabs
                    chosenLockouts={chosenLockouts}
                    selectedTab={selectedTab}
                    handleChangeTab={handleChangeTab}
                />
                {isLoadingAny ? (
                    <Loader />
                ) : (
                    <RosterBuilderActual
                        categories={categories}
                        characters={guildCharacters}
                        guildCharacterTags={guildCharacterTags}
                        // raids={raids}
                        // groups={groups}
                        players={guildPlayers}
                    />
                )}
            </Box>
            <RosterBuilderSidebar listItems={sideBarItems} />
        </>
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

    function handleDeleteLockout(lockout) {
        setChosenLockouts((prev) => {
            return prev.filter((prevLockout) => {
                return !isEqual(
                    parseISO(prevLockout.startDate),
                    parseISO(lockout.startDate)
                );
            });
        });
    }

    function handleAddLockout() {
        if (selectedLockout === null) {
            return;
        }

        const { startDate, endDate } =
            getLockoutStartAndEndDates(selectedLockout);

        const alreadyAdded = chosenLockouts.some((lockout) => {
            return dayjs(lockout.startDate).isSame(dayjs(startDate));
        });
        if (alreadyAdded) {
            return;
        }

        setChosenLockouts((prev) => [
            ...prev,
            {
                startDate,
                endDate,
            },
        ]);
    }

    function handleInstanceSelectChange(event) {
        setInstanceSelectValue(event.target.value);
    }

    function handleChangeTab(event, newValue) {
        setSelectedTab(newValue);
    }
}
