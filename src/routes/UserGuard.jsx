import { useStore } from "../store";
import { useInsertProfile } from "../hooks/auth/useProfile";

import { queryClient } from "../config";
import { useEffect, useRef, useState } from "react";

import { useInsertPlayer } from "../hooks/usePlayers";
import useUserInfo from "../hooks/useUserInfo";
import useGuild from "../hooks/useGuild";

import { getLockoutStartAndEndDates } from "../utils/wowHelpers";
import { useGuildInstanceLockout } from "../hooks/useGuildInstanceLockout";

export default function UserGuard({ children }) {
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
    const hasMutatedPlayer = useRef(false);

    if (isLoading) return <div>Loading Profile</div>;
    if (error) console.error(error);
    if (
        profile === undefined ||
        characters === undefined ||
        players === undefined
    )
        return <div>Profile is undefined</div>;

    if (profile?.length === 0)
        return (
            <MakeProfile
                userId={userId}
                displayName={displayName}
                discordName={discordName}
            />
        );
    if (players?.length === 0)
        return (
            <MakePlayer
                displayName={displayName}
                discordName={discordName}
                profileId={profile[0].id}
                hasMutatedPlayer={hasMutatedPlayer}
            />
        );

    return (
        <GatherGuild
            players={players}
            characters={characters}
            profile={profile}
        >
            {children}
        </GatherGuild>
    );
}

function GatherGuild({ children, players, characters, profile }) {
    const somePlayerisInGuild =
        players?.some((player) => player.guild_id !== null) || false;

    const mainCharacterId = players[0].main_character || characters[0]?.id;
    const mainCharacter = characters.find(
        (character) => character.id === mainCharacterId
    );
    const mainGuildId = mainCharacter?.guild_id;
    const { guild, isLoadingGuild, errorGuild } = useGuild(
        mainGuildId,
        somePlayerisInGuild
    );

    if (isLoadingGuild) return <div>Loading Guild</div>;
    if (errorGuild) console.error(errorGuild);

    return (
        <GatherGuildCurrentLockout guildId={mainGuildId}>
            {children}
        </GatherGuildCurrentLockout>
    );
}

function GatherGuildCurrentLockout({ children, guildId }) {
    const today = new Date();
    const { startDate, endDate } = getLockoutStartAndEndDates(today);
    const { lockout, lockoutError, isLoadingLockout } = useGuildInstanceLockout(
        startDate,
        guildId
    );
    if (isLoadingLockout) return <div>Loading Lockout</div>;
    if (lockoutError) console.error(lockoutError);

    return children;
}

function MakeProfile({ userId, displayName, discordName }) {
    const [hasMutated, setHasMutated] = useState(false);
    const profileMutation = useInsertProfile(userId, displayName, discordName);
    useEffect(() => {
        if (!hasMutated) {
            profileMutation.mutate();
            queryClient.invalidateQueries(["profile", userId]);
            setHasMutated(true);
        }
    }, [hasMutated, profileMutation, userId]);

    return <div>New user detected: Creating Profile</div>;
}

function MakePlayer({ displayName, discordName, profileId, hasMutatedPlayer }) {
    const playersMutation = useInsertPlayer(
        displayName,
        discordName,
        profileId
    );
    useEffect(() => {
        if (!hasMutatedPlayer.current) {
            hasMutatedPlayer.current = true;

            playersMutation.mutate();
        }
    }, []);

    return <div>New user detected: Creating Player</div>;
}
