import { Grid } from "@mui/material";
import useGuild from "../../../../hooks/useGuild";
import useUserInfo from "../../../../hooks/useUserInfo";
import { useStore } from "../../../../store";
import { gridSpacing } from "../../../../store/constant";
import GuildCard from "./GuildCard";
import useAllUserGuilds from "../../../../hooks/guild/useAllUserGuilds";

export default function MyGuildsOverview() {
    const user = useStore((state) => state.session.user);
    const userId = user.id;
    const discordName = user.user_metadata.name;
    const { profile, characters, players, isLoading, error } = useUserInfo(
        userId,
        discordName
    );
    const allPlayerGuilds = players?.map((player) => player.guild_id);
    const allCharacterGuilds = characters?.map(
        (character) => character.guild_id
    );
    const allGuilds = [...new Set([...allPlayerGuilds, ...allCharacterGuilds])];
    const { userGuilds, isLoadingUserGuilds, errorUserGuilds } =
        useAllUserGuilds(allGuilds);

    const loadingAny = isLoading || isLoadingUserGuilds;
    return (
        <Grid container spacing={gridSpacing}>
            {userGuilds?.map((guild, i) => (
                <Grid item xs={12} md={6} lg={4} key={i}>
                    <GuildCard guild={guild} isLoading={loadingAny} />
                </Grid>
            ))}
        </Grid>
    );
}
