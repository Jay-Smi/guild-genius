import { useStore } from "../../../../store";
import useUserInfo from "../../../../hooks/useUserInfo";
import { Typography, useMediaQuery, useTheme } from "@mui/material";
import { useAllGuildsCharacters } from "../../../../hooks/character/useCharacters";
import useAllGuildsPlayers from "../../../../hooks/player/useAllGuildsPlayers";
import useAllGuildCharacterTags from "../../../../hooks/character/useAllGuildCharacterTags";

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
        !guildCharacters ||
        !guildCharacterTags ||
        !guildPlayers;

    const tagCategories = [];
    const roleCategories = [
        { id: "tanks", name: "Tanks", type: "category", data: [] },
        { id: "healers", name: "Healers", type: "category", data: [] },
        { id: "melee", name: "Melee", type: "category", data: [] },
        { id: "ranged", name: "Ranged", type: "category", data: [] },
    ];

    const categories = [];
    const modifiedCharacters = null;

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
    }

    return <div>ROSTER BUILDER</div>;
}
