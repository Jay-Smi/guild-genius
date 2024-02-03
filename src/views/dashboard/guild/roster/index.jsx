import { useStore } from "../../../../store";
import useUserInfo from "../../../../hooks/useUserInfo";
import { useAllGuildsCharacters } from "../../../../hooks/character/useCharacters";
import useAllGuildsPlayers from "../../../../hooks/player/useAllGuildsPlayers";
import useAllGuildCharacterTags from "../../../../hooks/character/useAllGuildCharacterTags";
import Loader from "../../../../components/Loader";
import { useMemo, useState } from "react";

import { allClassesArray } from "../../../../utils/wowHelpers";
import useCreateGuildCharacter from "../../../../hooks/character/useCreateGuildCharacter";
import useUpdateGuildCharacter from "../../../../hooks/character/useUpdateGuildCharacter";
import useDeleteGuildCharacter from "../../../../hooks/character/useDeleteGuildCharacter";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from "material-react-table";
import useCreateGuildPlayer from "../../../../hooks/player/useCreateGuildPlayer";
import useCreateGuildCharacterTags from "../../../../hooks/character/useCreateGuildCharacterTags";
import useDeleteGuildPlayer from "../../../../hooks/player/useDeleteGuildPlayer";
import useDeleteGuildCharacterTags from "../../../../hooks/character/useDeleteGuildCharacterTags";
import { mkConfig, generateCsv, download } from "export-to-csv";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
    convertRankToInt,
    convertRankToString,
} from "../../../../utils/helpers";

function GuildRoster() {
    const user = useStore((state) => state.session.user);
    const userId = user.id;
    const discordName = user.user_metadata.name;
    const { characters, players, profile, isLoading } = useUserInfo(
        userId,
        discordName
    );
    const activePlayer = players.find(
        (player) => player.id === profile[0].active_player_id
    );

    const mainGuildId = activePlayer?.guild_id;
    const { guildCharacters, isLoadingCharacters } =
        useAllGuildsCharacters(mainGuildId);
    const { guildPlayers, isLoadingPlayers } = useAllGuildsPlayers(mainGuildId);
    const { guildCharacterTags, isLoadingCharacterTags } =
        useAllGuildCharacterTags(mainGuildId);

    const highestRank = characters.reduce((minCharacter, currentCharacter) => {
        if (
            minCharacter === null ||
            currentCharacter.guild_rank < minCharacter.guild_rank
        ) {
            return currentCharacter;
        } else {
            return minCharacter;
        }
    }, null)?.guild_rank;

    const isLoadingAny =
        isLoadingCharacters ||
        isLoadingPlayers ||
        isLoadingCharacterTags ||
        !guildCharacters ||
        !guildPlayers ||
        !guildCharacterTags;
    if (isLoading) return <Loader />;
    if (!mainGuildId)
        return <Typography>Join a guild to see the roster</Typography>;
    if (isLoadingAny) return <Loader />;

    const updatedCharacters = guildCharacters?.map((character) => {
        const player = guildPlayers.find(
            (player) => player.id === character.player_id
        );
        const tags = guildCharacterTags
            .filter((tag) => tag.character_id === character.id)
            .map((tag) => tag.tag_name);
        const tagString = tags.join(", ");
        const tagObjs = guildCharacterTags.filter(
            (tag) => tag.character_id === character.id
        );
        const rank = convertRankToString(character.guild_rank);
        return {
            player_name: player.player_name,
            character_name: character.character_name,
            class: character.class,
            spec: character.spec,
            guild_rank: rank,
            rank_int: character.guild_rank,
            discord_name: character.discord_name,
            tags: tagString,
            character_id: character.id,
            player_id: player.id,
            guild_id: player.guild_id,
            profile_id: player.profile_id,
            tagObjs,
        };
    });

    return (
        <CharacterTable
            initialCharacters={updatedCharacters}
            isLoadingAny={isLoadingAny}
            userRank={highestRank}
        />
    );
}

export default GuildRoster;

const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
});

function CharacterTable({ initialCharacters, isLoadingAny, userRank }) {
    const [validationErrors, setValidationErrors] = useState({});
    const characters = useMemo(
        () => initialCharacters || [],
        [initialCharacters]
    );

    const columns = useMemo(
        () => [
            {
                accessorKey: "player_name",
                header: "Player Name",
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.playerName,
                    helperText: validationErrors?.playerName,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            playerName: undefined,
                        }),
                },
            },
            {
                accessorKey: "character_name",
                header: "Character Name",
                muiEditTextFieldProps: ({ table, row }) => ({
                    required: true,
                    error: !!validationErrors?.characterName,
                    helperText: validationErrors?.characterName,
                    onFocus: () => {
                        const playerName = row.getValue("player_name");
                        const discordName = row.getValue("discord_name");
                        if (!discordName && playerName) {
                            const matchingPlayer = characters.find(
                                (char) => char.player_name === playerName
                            );
                            if (matchingPlayer) {
                                // const tableState = table.getState();
                                console.log(table.getState());
                                // table.setState((oldState) => {
                                //     console.log(oldState);
                                //     return {
                                //         ...oldState,
                                //         creatingRow: {
                                //             ...oldState.creatingRow,
                                //             _valuesCache: {
                                //                 ...oldState.creatingRow
                                //                     ._valuesCache,
                                //                 discord_name:
                                //                     matchingPlayer.discord_name,
                                //             },
                                //         },
                                //     };
                                // });
                            }
                        }
                        setValidationErrors({
                            ...validationErrors,
                            characterName: undefined,
                        });
                    },
                }),
            },
            {
                accessorKey: "class",
                header: "Class",
                editVariant: "select",
                editSelectOptions: allClassesArray,
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.class,
                    helperText: validationErrors?.class,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            class: undefined,
                        }),
                },
                size: 80,
            },
            {
                accessorKey: "spec",
                header: "Spec",
                enableEditing: true,
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.spec,
                    helperText: validationErrors?.spec,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            spec: undefined,
                        }),
                },
                size: 80,
            },
            {
                accessorKey: "guild_rank",
                header: "Guild Rank",
                editVariant: "select",

                editSelectOptions: () => {
                    const possibleRanks = [
                        { string: "Trial", int: 15 },
                        { string: "Member", int: 10 },
                        { string: "Officer", int: 5 },
                        { string: "Guild Master", int: 0 },
                        { string: "Admin", int: -1 },
                    ];
                    const rankArray = [];

                    if (userRank === -1) {
                        for (let i = 0; i < possibleRanks.length; i++) {
                            rankArray.push(possibleRanks[i].string);
                        }
                    } else if (userRank === 0) {
                        for (let i = 0; i < possibleRanks.length; i++) {
                            if (
                                possibleRanks[i].int === 0 ||
                                possibleRanks[i].int === 5 ||
                                possibleRanks[i].int === 10 ||
                                possibleRanks[i].int === 15
                            ) {
                                rankArray.push(possibleRanks[i].string);
                            }
                        }
                    } else if (userRank === 5) {
                        for (let i = 0; i < possibleRanks.length; i++) {
                            if (
                                possibleRanks[i].int === 10 ||
                                possibleRanks[i].int === 15
                            ) {
                                rankArray.push(possibleRanks[i].string);
                            }
                        }
                    }

                    return rankArray;
                },
                enableEditing: true,
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.guild_rank,
                    helperText: validationErrors?.guild_rank,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            guild_rank: undefined,
                        }),
                },
                size: 80,
            },
            {
                accessorKey: "discord_name",
                header: "Discord Name",
                enableEditing: true,
                muiEditTextFieldProps: {
                    error: !!validationErrors?.discord_name,
                    helperText: validationErrors?.discord_name,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            discord_name: undefined,
                        }),
                },
                size: 80,
            },
            {
                accessorKey: "tags",
                header: "Tags",
                enableEditing: true,
                muiEditTextFieldProps: {
                    required: false,
                    error: !!validationErrors?.discord_name,
                    helperText: validationErrors?.discord_name,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            discord_name: undefined,
                        }),
                },
                size: 80,
            },
        ],
        [validationErrors, characters, userRank]
    );

    //call CREATE hook
    const { mutateAsync: createCharacter, isPending: isCreatingCharacter } =
        useCreateGuildCharacter();
    const { mutateAsync: createPlayer, isPending: isCreatingPlayer } =
        useCreateGuildPlayer();
    const { mutateAsync: createTags, isPending: isCreatingTags } =
        useCreateGuildCharacterTags();

    //call UPDATE hook
    const { mutateAsync: updateCharacter, isPending: isUpdatingCharacter } =
        useUpdateGuildCharacter();

    //call DELETE hook
    const { mutateAsync: deleteCharacter, isPending: isDeletingCharacter } =
        useDeleteGuildCharacter();
    const { mutateAsync: deletePlayer, isPending: isDeletingPlayer } =
        useDeleteGuildPlayer();
    const { mutateAsync: deleteTags, isPending: isDeletingTags } =
        useDeleteGuildCharacterTags();

    //CREATE action
    const handleCreateCharacter = async ({ values, table }) => {
        const newValiationErrors = validateCharacter(values);
        if (Object.values(newValiationErrors).some((error) => error)) {
            setValidationErrors(newValiationErrors);
            return;
        }

        const {
            player_name,
            character_name,
            class: charClass,
            spec,
            guild_rank,
            discord_name,
            tags,
        } = values;

        function getMatchingPlayer(player_name) {
            return (
                characters.find((char) => char.player_name === player_name) ||
                null
            );
        }

        const characterId = crypto.randomUUID();

        const existingPlayer = getMatchingPlayer(player_name);

        const playerId = existingPlayer
            ? existingPlayer.player_id
            : crypto.randomUUID();

        const guildId = characters[0].guild_id;

        const profileId = existingPlayer
            ? existingPlayer.profile_id
                ? existingPlayer.profile_id
                : null
            : null;
        const rank = convertRankToInt(guild_rank);
        const character = {
            id: characterId,
            character_name,
            discord_name,
            class: charClass,
            spec,
            player_id: playerId,
            guild_id: guildId,
            guild_rank: rank,
        };

        const player = {
            id: playerId,
            player_name,
            profile_id: profileId,
            discord_name,
            guild_id: guildId,
        };

        const tagArray = tags?.length
            ? tags.split(",").map((tag) => tag.trim())
            : [];

        const newTags = tagArray?.map((tag) => ({
            tag_name: tag,
            character_id: characterId,
            guild_id: guildId,
        }));

        setValidationErrors({});
        existingPlayer
            ? await createCharacter(character, {
                  onSuccess: async () =>
                      tagArray.length ? await createTags(newTags) : null,
              })
            : await createPlayer(player, {
                  onSuccess: async () =>
                      await createCharacter(character, {
                          onSuccess: async () =>
                              tagArray.length
                                  ? await createTags(newTags)
                                  : null,
                      }),
              });

        table.setCreatingRow(null);
    };

    //UPDATE action
    const handleSaveCharacter = async ({ values, table, row }) => {
        const newValiationErrors = validateCharacter(values);
        if (Object.values(newValiationErrors).some((error) => error)) {
            setValidationErrors(newValiationErrors);
            return;
        }
        setValidationErrors({});

        const matchingCharacter = characters.find(
            (char) =>
                char.player_name === row.original.player_name &&
                char.character_name === row.original.character_name
        );

        const { character_id, player_id, guild_id, profile_id } =
            matchingCharacter;

        const {
            player_name,
            character_name,
            class: charClass,
            spec,
            guild_rank,
            discord_name,
            tags,
        } = values;

        const newPlayerId = player_id || crypto.randomUUID();
        const rank = convertRankToInt(guild_rank);

        const character = {
            id: character_id,
            character_name,
            discord_name,
            class: charClass,
            spec,
            player_id: player_id || newPlayerId,
            guild_id,
            guild_rank: rank,
        };

        const player = {
            id: player_id || newPlayerId,
            player_name,
            profile_id,
            discord_name,
            guild_id,
        };

        const tagArray =
            tags === "" ? [] : tags.split(",").map((tag) => tag.trim());
        const charactersTags = characters
            .filter((char) => char.character_id === character_id)[0]
            .tags?.split(",")
            .map((tag) => tag.trim());
        const charactersTagObjs = characters.filter(
            (char) => char.character_id === character_id
        )[0].tagObjs;

        const tagsToDelete = charactersTagObjs
            ?.filter((tag) => !tagArray.includes(tag.tag_name))
            .map((tag) => tag.id);

        const newTags = tagArray
            ?.filter((tag) => {
                return !charactersTags?.some((t) => t === tag);
            })
            .map((tag) => ({
                tag_name: tag,
                character_id,
                guild_id,
            }));

        // console.log("tagArray", tagArray);
        // console.log("charactersTags", charactersTags);
        // console.log("newTags", newTags);

        // console.log("charactersTags", charactersTags);
        // console.log("charactersTagObjs", charactersTagObjs);
        await updateCharacter(character, {
            onSuccess: async () => {
                if (tagsToDelete.length) {
                    console.log("tagsToDelete", tagsToDelete);
                    await deleteTags(tagsToDelete);
                }
                if (newTags.length) {
                    console.log("newTags", newTags);
                    await createTags(newTags);
                }
            },
        });
        table.setEditingRow(false);
    };

    //DELETE action
    const handleDeleteCharacter = (row) => {
        const character = characters.find(
            (char) =>
                char.player_name === row.original.player_name &&
                char.character_name === row.original.character_name
        );
        const player = characters.find(
            (char) => char.player_name === row.original.player_name
        );
        const allPlayerCharacters = characters.filter(
            (char) => char.player_id === player.player_id
        );

        if (window.confirm("Are you sure you want to delete this character?")) {
            if (allPlayerCharacters.length === 1) {
                deletePlayer(player.player_id);
            } else {
                deleteCharacter(character.character_id);
            }
        }
    };

    //EXPORT action
    const handleExportData = () => {
        const strippedCharacters = characters.map((char) => {
            const {
                character_id,
                player_id,
                guild_id,
                profile_id,
                tagObjs,
                ...strippedChar
            } = char;
            return strippedChar;
        });

        const csv = generateCsv(csvConfig)(strippedCharacters);
        download(csvConfig)(csv);
    };
    // enableEditing: userRank < 6 ? true : false,
    const table = useMaterialReactTable({
        columns,
        data: characters,
        createDisplayMode: "row",
        editDisplayMode: "row",
        enableEditing:
            userRank <= 5
                ? (row) => {
                      const allCells = row.getAllCells();
                      const rankCell = allCells
                          .find((cell) => cell.column.id === "guild_rank")
                          .getValue();
                      const rankInt = convertRankToInt(rankCell);
                      switch (userRank) {
                          case -1:
                              return true;
                          case 0:
                              return rankInt >= 0;
                          case 5:
                              return rankInt > 5;
                          case 10:
                              return false;
                          case 15:
                              return false;
                          default:
                              return false;
                      }
                  }
                : false,
        enableStickyHeader: true,
        getRowId: (row) => row.id,
        muiTableContainerProps: {
            sx: {
                height: "calc(100vh - 260px)",
            },
        },
        muiTablePaperProps: ({ table }) => ({
            sx: {
                "& ::-webkit-scrollbar-track": {
                    backgroundColor: "transparent",
                },
                "& ::-webkit-scrollbar": {
                    right: 0,
                    width: "12px",
                    height: "12px",
                },
                "& ::-webkit-scrollbar-thumb": {
                    backgroundColor: "#999",
                    borderRadius: "8px",
                    width: "12px",
                    height: "12px",
                },
            },
            style: {
                zIndex: table.getState().isFullScreen ? 100000 : undefined,
            },
        }),
        onCreatingRowCancel: () => setValidationErrors({}),
        onCreatingRowSave: handleCreateCharacter,
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: handleSaveCharacter,
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: "flex", gap: "1rem" }}>
                <Tooltip title="Edit">
                    <IconButton
                        aria-label="edit"
                        onClick={() => table.setEditingRow(row)}
                    >
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteCharacter(row)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        ),
        renderTopToolbarCustomActions: ({ table }) =>
            userRank < 6 ? (
                <Box
                    sx={{
                        display: "flex",
                        gap: "16px",
                        padding: "8px",
                        flexWrap: "wrap",
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={() => table.setCreatingRow(true)}
                    >
                        Create Character
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleExportData}
                        startIcon={<FileDownloadIcon />}
                    >
                        Export to CSV
                    </Button>
                </Box>
            ) : null,
        state: {
            isLoading: isLoadingAny,
            isSaving:
                isCreatingCharacter ||
                isUpdatingCharacter ||
                isDeletingCharacter ||
                isCreatingPlayer ||
                isDeletingPlayer ||
                isCreatingTags ||
                isDeletingTags,
            showProgressBar: isLoadingAny,
        },
        // initialState: {
        //     columnVisibility: {
        //         character_id: false,
        //         player_id: false,
        //         guild_id: false,
        //         profile_id: false,
        //     },
        // },
    });

    return <MaterialReactTable table={table} />;
}

const validateRequired = (value) => !!value?.length;

function validateCharacter(character) {
    return {
        characterName: !validateRequired(character.character_name)
            ? "Character Name is required"
            : "",
        playerName: !validateRequired(character.player_name)
            ? "Player Name is required"
            : "",
        characterClass: !validateRequired(character.class)
            ? "Class is required"
            : "",
        spec: !validateRequired(character.spec) ? "Spec is required" : "",
        guildRank: !validateRequired(character.guild_rank)
            ? "Guild Rank is required"
            : "",
        discordName: !validateRequired(character.discord_name)
            ? "Discord Name is required"
            : "",
    };
}
