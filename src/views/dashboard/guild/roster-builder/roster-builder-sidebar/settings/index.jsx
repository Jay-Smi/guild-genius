import { Box, Button, Grid, Typography, styled, useTheme } from "@mui/material";
import { useContext, useMemo, useState } from "react";
import { RosterContext } from "../../store/RosterContextProvider";
import { useStore } from "zustand";
import { useStore as userStore } from "../../../../../../store";
import useUserInfo from "../../../../../../hooks/useUserInfo";
import useGuild from "../../../../../../hooks/useGuild";
import { format, parse } from "date-fns";
import useCreateGuildInstanceLockouts from "../../../../../../hooks/postLockout/useCreateGuildInstanceLockouts";
import useCreateRaids from "../../../../../../hooks/postLockout/useCreateRaids";
import useCreateGroups from "../../../../../../hooks/postLockout/useCreateGroups";
import useCreateGroupCharacters from "../../../../../../hooks/postLockout/useCreateGroupCharacters";
import useCreateRaidTags from "../../../../../../hooks/postLockout/useCreateRaidTags";
import { queryClient } from "../../../../../../config";
import toast from "react-hot-toast";
import { useAllGuildInstanceLockouts } from "../../../../../../hooks/useGuildInstanceLockout";
import useDeleteGuildInstanceLockouts from "../../../../../../hooks/lockout/useDeleteGuildInstanceLockouts";

const StyledAlphaBox = styled(Box)(({ theme }) => ({
    maxWidth: "300px",
    display: "flex",
    justifyContent: "center",
}));

const StyledCharactersBox = styled(Box)(({ theme }) => ({
    width: "100%",
    display: "flex",
    justifyContent: "center",
}));

const StyledButton = styled(Button)(({ theme }) => ({ width: "100%" }));

export default function RosterSettings() {
    const theme = useTheme();

    const [submitting, setSubmitting] = useState(false);
    const rosterStore = useContext(RosterContext);
    const charactersLength = useStore(
        rosterStore,
        (state) => state.characters.length
    );
    const selectedLockoutsLength = useStore(
        rosterStore,
        (state) => state.chosenLockouts.length
    );
    const raids = useStore(rosterStore, (state) =>
        Object.values(state.containers).filter(
            (container) => container.type === "raid"
        )
    );
    const storeContainers = useStore(rosterStore, (state) => state.containers);
    const setStoreContainers = useStore(
        rosterStore,
        (state) => state.setContainers
    );
    const selectedTab = useStore(rosterStore, (state) => state.selectedTab);
    const chosenLockouts = useStore(
        rosterStore,
        (state) => state.chosenLockouts
    );

    const tabsContainers = useStore(
        rosterStore,
        (state) => state.tabsContainers
    );
    const setTabContainer = useStore(
        rosterStore,
        (state) => state.setTabContainer
    );
    const lockoutsIndex = chosenLockouts[selectedTab].id;
    const containers =
        selectedTab === 0 ? storeContainers : tabsContainers[lockoutsIndex];

    const setContainers = useMemo(
        () =>
            selectedTab === 0
                ? setStoreContainers
                : (container) => setTabContainer(lockoutsIndex, container),
        [selectedTab, setStoreContainers, setTabContainer, lockoutsIndex]
    );

    const selectedInstance = useStore(
        rosterStore,
        (state) => state.selectedInstance
    );

    const user = userStore((state) => state.session.user);

    const userId = user.id;

    const discordName = user.user_metadata.name;
    const { profile, characters, players } = useUserInfo(userId, discordName);
    const somePlayerisInGuild =
        players?.some((player) => player.guild_id !== null) || false;

    const activePlayer = players.find(
        (player) => player.id === profile[0].active_player_id
    );

    const guildId = activePlayer?.guild_id;
    const { lockouts, lockoutsError, isLoadingLockouts } =
        useAllGuildInstanceLockouts(guildId);

    const { mutate: deleteLockout } = useDeleteGuildInstanceLockouts();

    const userRank = activePlayer?.guild_rank;
    const mutateGuildInstanceLockouts = useCreateGuildInstanceLockouts();
    const mutateRaids = useCreateRaids();
    const mutateGroups = useCreateGroups();
    const mutateGroupCharacters = useCreateGroupCharacters();
    const mutateRaidsTags = useCreateRaidTags();

    function handleSaveLockouts() {
        if (selectedLockoutsLength < 2) {
            window.alert("Please select a lockout in order to save.");
            return;
        }
        if (!selectedInstance) {
            window.alert("Please select an instance in order to save.");
            return;
        }
        const missingDates = AnyRaidHasNoDate();
        if (missingDates) {
            window.alert("At least 1 raid is missing a date.");
            return;
        }
        const missingTimes = AnyRaidHasNoTime();
        if (missingTimes) {
            window.alert("At least 1 raid is missing a time.");
            return;
        }

        const readyToMutate = buildLockouts();
        const inOrder = [
            "guild_instance_lockout",
            "raids",
            "groups",
            "group_characters",
            "raid_tags",
        ];
        setSubmitting(true);
        let promises = [
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 1000);
            }),
        ];
        let guildInstanceLockoutPromise = null;
        let raidsPromise = null;
        let groupsPromise = null;
        let groupCharactersPromise = null;
        let raidTagsPromise = null;
        console.log(readyToMutate.guild_instance_lockout);

        const lockoutAlreadyExists = readyToMutate.guild_instance_lockout.some(
            (lockout) =>
                lockouts.some(
                    (existingLockout) =>
                        existingLockout.start_date === lockout.start_date
                )
        );

        if (lockoutAlreadyExists) {
            const newLockoutStartDates =
                readyToMutate.guild_instance_lockout.map(
                    (lockout) => lockout.start_date
                );
            const existingLockoutId = lockouts.find((existingLockout) =>
                newLockoutStartDates.includes(existingLockout.start_date)
            ).id;

            deleteLockout(existingLockoutId);
        }

        guildInstanceLockoutPromise = mutateGuildInstanceLockouts.mutate(
            readyToMutate.guild_instance_lockout,
            {
                onSuccess: () => {
                    queryClient.invalidateQueries([
                        "guild-instance-lockouts",
                        guildId,
                    ]);
                    raidsPromise = mutateRaids.mutate(readyToMutate.raids, {
                        onSuccess: () => {
                            queryClient.invalidateQueries([
                                "guild-raids",
                                guildId,
                            ]);
                            raidTagsPromise = mutateRaidsTags.mutate(
                                readyToMutate.raid_tags,
                                {
                                    onSuccess: () => {
                                        queryClient.invalidateQueries([
                                            "raid-tags",
                                            guildId,
                                        ]);
                                    },
                                }
                            );
                            groupsPromise = mutateGroups.mutate(
                                readyToMutate.groups,
                                {
                                    onSuccess: () => {
                                        queryClient.invalidateQueries([
                                            "guilds-groups",
                                            guildId,
                                        ]);
                                        groupCharactersPromise =
                                            mutateGroupCharacters.mutate(
                                                readyToMutate.group_characters,
                                                {
                                                    onSuccess: () => {
                                                        queryClient.invalidateQueries(
                                                            [
                                                                "guilds-groups-characters",
                                                                guildId,
                                                            ]
                                                        );
                                                        setSubmitting(false);
                                                    },
                                                }
                                            );
                                    },
                                }
                            );
                        },
                    });
                },
            }
        );
        if (guildInstanceLockoutPromise)
            promises.push(guildInstanceLockoutPromise);
        if (raidsPromise) promises.push(raidsPromise);
        if (groupsPromise) promises.push(groupsPromise);
        if (groupCharactersPromise) promises.push(groupCharactersPromise);
        if (raidTagsPromise) promises.push(raidTagsPromise);

        const combinedPromise = Promise.all(promises);
        toast.promise(combinedPromise, {
            loading: "Saving...",
            success: "Saved!",
            error: "Error saving.",
        });
    }

    function buildLockouts() {
        const lockouts = Object.keys(tabsContainers).map((tabKey) => {
            return BuildLockoutData(tabKey);
        });
        const lockoutsCombined = lockouts.reduce((acc, curr) => {
            for (const key in curr) {
                if (Object.hasOwnProperty.call(curr, key)) {
                    if (key in acc) {
                        acc[key] = acc[key].concat(curr[key]);
                    } else {
                        acc[key] = curr[key];
                    }
                }
            }
            return acc;
        }, {});
        Object.keys(lockoutsCombined).forEach((key) => {
            if (key !== "group_characters" && key !== "raid_tags") return;
            lockoutsCombined[key] = lockoutsCombined[key].flat();
        });
        return lockoutsCombined;
    }

    function remapRaidAndGroupIds(tabKey) {
        const newGroups = [];
        const newRaids = Object.values(tabsContainers[tabKey])
            .filter((container) => container.type === "raid")
            .map((raid) => {
                const newRaidId = crypto.randomUUID();
                Object.values(tabsContainers[tabKey])
                    .filter(
                        (container) =>
                            container.type === "group" &&
                            raid.data.includes(container.id)
                    )
                    .forEach((group) => {
                        const newGroupId = crypto.randomUUID();

                        newGroups.push({
                            ...group,
                            id: newGroupId,
                        });
                    });
                return {
                    ...raid,
                    id: newRaidId,
                    data: newGroups.map((group) => group.id),
                };
            });

        return { newRaids, newGroups };
    }

    function BuildLockoutData(tabKey) {
        const guild_instance_lockout_id = crypto.randomUUID();
        const { newRaids, newGroups } = remapRaidAndGroupIds(tabKey);

        const guild_instance_lockout = [
            chosenLockouts.find((lockout) => lockout.id === tabKey),
        ].map((lockout) => {
            return {
                id: guild_instance_lockout_id,
                end_date: lockout.endDate,
                start_date: lockout.startDate,
                instance_name: selectedInstance,
                guild_id: guildId,
            };
        });

        const raids = newRaids.map((raid) => {
            const { date, time, id, name } = raid;

            return {
                id: id,
                name,
                date,
                time: format(parse(time, "h:mm a", new Date()), "HH:mm:ss"),
                guild_id: guildId,
                guild_instance_lockout_id,
            };
        });

        const groups = newGroups.map((group) => {
            const raid = newRaids.find((container) =>
                container.data?.includes(group.id)
            );

            const newGroup = {
                id: group.id,
                name: group.name,
                guild_id: guildId,
                guild_instance_lockout_id,
                raid_id: raid.id,
            };

            return newGroup;
        });

        const group_characters = newGroups.map((group) => {
            return group.data.map((characterId) => {
                return {
                    id: crypto.randomUUID(),
                    group_id: group.id,
                    character_id: characterId,
                    guild_id: guildId,
                    guild_instance_lockout_id,
                };
            });
        });
        const raid_tags = newRaids
            .map((raid) => {
                return raid.tags?.map((tag) => {
                    return {
                        id: crypto.randomUUID(),
                        raid_id: raid.id,
                        tag_name: tag.tag,
                        amount: tag.amount || 0,
                        guild_id: guildId,
                        guild_instance_lockout_id,
                    };
                });
            })
            .filter(Boolean);
        return {
            guild_instance_lockout,
            raids,
            groups,
            group_characters,
            raid_tags,
        };
    }

    function findParent(id) {
        return containers?.find((container) => container.data?.includes(id));
    }

    function AnyRaidHasNoTime() {
        const tabRaidsWithNoTime = {};
        Object.keys(tabsContainers).forEach((lockoutId) => {
            const raidContainers = Object.values(
                tabsContainers[lockoutId]
            ).filter((container) => container.type === "raid");
            const raidsWithNoTime = raidContainers.filter((raid) => !raid.time);

            if (raidsWithNoTime.length !== 0) {
                tabRaidsWithNoTime[lockoutId] = raidsWithNoTime;
            }
        });
        const missingLength = Object.keys(tabRaidsWithNoTime);
        if (missingLength.length === 0) {
            return false;
        }
        return tabRaidsWithNoTime;
    }

    function AnyRaidHasNoDate() {
        const tabRaidsWithNoDate = {};
        Object.keys(tabsContainers).forEach((lockoutId) => {
            const raidContainers = Object.values(
                tabsContainers[lockoutId]
            ).filter((container) => container.type === "raid");
            const raidsWithNoDate = raidContainers.filter((raid) => !raid.date);

            if (raidsWithNoDate.length !== 0) {
                tabRaidsWithNoDate[lockoutId] = raidsWithNoDate;
            }
        });
        const missingLength = Object.keys(tabRaidsWithNoDate);
        if (missingLength.length === 0) {
            return false;
        }
        return tabRaidsWithNoDate;
    }

    function handleAddRaid() {
        const newRaidId = crypto.randomUUID();
        const newGroup1Id = crypto.randomUUID();
        const newGroup2Id = crypto.randomUUID();
        const raidsLength = Object.values(containers).filter(
            (container) => container.type === "raid"
        ).length;

        const newContainers = { ...containers };

        newContainers[newRaidId] = {
            id: newRaidId,
            type: "raid",
            data: [newGroup1Id, newGroup2Id],
            name: `Raid ${raidsLength + 1}`,
        };

        newContainers[newGroup1Id] = {
            id: newGroup1Id,
            type: "group",
            data: [],
            name: "Group 1",
        };

        newContainers[newGroup2Id] = {
            id: newGroup2Id,
            type: "group",
            data: [],
            name: "Group 2",
        };

        const updatedRaidsContainer = {
            ...newContainers.raidsContainer,
            data: [...newContainers.raidsContainer.data, newRaidId],
        };

        newContainers.raidsContainer = updatedRaidsContainer;

        setContainers(newContainers);
    }

    return (
        <StyledAlphaBox>
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <StyledCharactersBox>
                        <Typography
                            variant="subtitle1"
                            color={
                                theme.palette.mode === "dark"
                                    ? theme.palette.primary[200]
                                    : theme.palette.secondary.main
                            }
                        >
                            Characters: {charactersLength}
                        </Typography>
                    </StyledCharactersBox>
                </Grid>
                <Grid item xs={6}>
                    <StyledCharactersBox>
                        <Typography
                            variant="subtitle1"
                            color={
                                theme.palette.mode === "dark"
                                    ? theme.palette.primary[200]
                                    : theme.palette.secondary.main
                            }
                        >
                            Raids: {raids.length}
                        </Typography>
                    </StyledCharactersBox>
                </Grid>
                <Grid item xs={6}>
                    <StyledButton
                        variant="contained"
                        color="primary"
                        onClick={handleAddRaid}
                    >
                        Add Raid
                    </StyledButton>
                </Grid>
                <Grid item xs={6}>
                    <StyledCharactersBox>
                        <StyledButton
                            variant="contained"
                            color="primary"
                            onClick={() => console.log("Sorry not ready yet")}
                        >
                            Import Lockout
                        </StyledButton>
                    </StyledCharactersBox>
                </Grid>
                <Grid item xs={12}>
                    <StyledButton
                        variant="contained"
                        color="primary"
                        onClick={() => console.log("Sorry not ready yet")}
                    >
                        Auto Fill
                    </StyledButton>
                </Grid>
                {/* <Grid item xs={6}></Grid> */}
                <Grid item xs={12}>
                    <StyledCharactersBox>
                        <StyledButton
                            variant="contained"
                            color="secondary"
                            onClick={handleSaveLockouts}
                            disabled={submitting || userRank > 5}
                        >
                            {selectedLockoutsLength > 2
                                ? "Save Lockouts"
                                : "Save Lockout"}
                        </StyledButton>
                    </StyledCharactersBox>
                </Grid>
            </Grid>
        </StyledAlphaBox>
    );
}
