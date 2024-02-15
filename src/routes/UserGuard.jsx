import { useStore } from "../store";
import { useInsertProfile } from "../hooks/auth/useProfile";
import { useEffect, useRef } from "react";
import { useInsertPlayer } from "../hooks/usePlayers";
import useUserInfo from "../hooks/useUserInfo";
import Loader from "../components/Loader";
import useUpdateProfile from "../hooks/profile/useUpdateProfile";
import useUpdateOwnPlayer from "../hooks/player/useUpdateOwnPlayer";

export default function UserGuard({ children }) {
    const user = useStore((state) => state.session.user);

    const displayName =
        user.user_metadata.custom_claims.global_name ||
        user.user_metadata.full_name;
    const userId = user.id;
    const discordName = user.user_metadata.name;

    const { profile, characters, players, isLoading, error } = useUserInfo(
        userId,
        discordName
    );

    if (isLoading || !profile || !characters || !players) return <Loader />;

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
                userId={userId}
                displayName={displayName}
                discordName={discordName}
                oldProfile={profile[0]}
                profileId={profile[0].id}
            />
        );
    if (players[0].profile_id === null) {
        return (
            <UpdateProfileAndPlayer profile={profile[0]} player={players[0]} />
        );
    }

    return children;
    // console.log("players", players);
    // console.log("characters", characters);
    // console.log("profile", profile);

    // console.log("somePlayerisInGuild", somePlayerisInGuild);
    // if (!characters.length) return;
    // return (
    //     <GatherGuild
    //         players={players}
    //         characters={characters}
    //         profile={profile}
    //     >
    //         {children}
    //     </GatherGuild>
    // );
}

// function GatherGuild({ children, players, characters, profile }) {
//     const mainCharacterId = players[0].main_character || characters[0]?.id;
//     const mainCharacter = characters.find(
//         (character) => character.id === mainCharacterId
//     );
//     const mainGuildId = mainCharacter?.guild_id;
//     const { guild, isLoadingGuild, errorGuild } = useGuild(mainGuildId);

//     if (isLoadingGuild) return <div>Loading Guild</div>;
//     if (errorGuild) console.error(errorGuild);

//     return (
//         <GatherGuildCurrentLockout guildId={mainGuildId}>
//             {children}
//         </GatherGuildCurrentLockout>
//     );
// }

// function GatherGuildCurrentLockout({ children, guildId }) {
//     const today = new Date();
//     const { startDate, endDate } = getLockoutStartAndEndDates(today);
//     const { lockout, lockoutError, isLoadingLockout } = useGuildInstanceLockout(
//         startDate,
//         guildId
//     );
//     if (isLoadingLockout) return <div>Loading Lockout</div>;
//     if (lockoutError) console.error(lockoutError);

//     return children;
// }

function UpdateProfileAndPlayer({ profile, player }) {
    //assign profile active_player_id
    //assign player profile_id
    const { mutate: updateProfile } = useUpdateProfile();

    const { mutate: updatePlayer } = useUpdateOwnPlayer();

    const hasMutated = useRef(false);

    console.log("profile", profile);
    console.log("player", player);

    const newProfile = {
        ...profile,
        active_player_id: player.id,
    };

    const newPlayer = {
        ...player,
        profile_id: profile.id,
    };

    useEffect(() => {
        if (!hasMutated.current) {
            hasMutated.current = true;
            updateProfile(newProfile);
            updatePlayer(newPlayer);
        }
    }, []);

    return (
        <>
            <Loader />
            <div>Updating Profile</div>
        </>
    );
}

function MakeProfile({ userId, displayName, discordName }) {
    const hasMutated = useRef(false);

    const newId = crypto.randomUUID();
    const newProfile = {
        id: newId,
        user_id: userId,
        display_name: displayName,
        discord_name: discordName,
    };

    const { mutate: createProfile } = useInsertProfile();
    useEffect(() => {
        if (!hasMutated.current) {
            hasMutated.current = true;
            createProfile(newProfile);
        }
    }, []);

    return (
        <>
            <Loader />
            <div>New user detected: Creating Profile</div>
        </>
    );
}

function MakePlayer({ displayName, discordName, profileId, userId }) {
    const hasMutatedPlayer = useRef(false);
    const { mutate: createPlayer } = useInsertPlayer();
    const { mutate: updateProfile } = useUpdateProfile();

    const { profile } = useUserInfo(userId, discordName);
    const newPlayerId = crypto.randomUUID();
    const player = {
        id: newPlayerId,
        profile_id: profileId,
        discord_name: discordName,
        player_name: displayName,
    };

    useEffect(() => {
        if (!hasMutatedPlayer.current) {
            createPlayer(player);

            hasMutatedPlayer.current = true;
        }
        if (hasMutatedPlayer.current) {
            const updatedProfile = {
                ...profile[0],
                active_player_id: newPlayerId,
            };

            updateProfile(updatedProfile);
        }
    }, []);

    return (
        <>
            <Loader />
            <br />
            <div>New user detected: Creating Player</div>
        </>
    );
}
