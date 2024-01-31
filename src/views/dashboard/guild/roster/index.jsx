import { useTheme } from "@emotion/react";
import { useStore } from "../../../../store";
import useUserInfo from "../../../../hooks/useUserInfo";
import { useAllGuildsCharacters } from "../../../../hooks/character/useCharacters";
import useAllGuildsPlayers from "../../../../hooks/player/useAllGuildsPlayers";
import useAllGuildCharacterTags from "../../../../hooks/character/useAllGuildCharacterTags";
import Loader from "../../../../components/Loader";
import { useMemo, useState } from "react";
import { set } from "date-fns";
import { allClasses, allClassesArray } from "../../../../utils/wowHelpers";
import useCreateGuildCharacter from "../../../../hooks/character/useCreateGuildCharacter";
import useUpdateGuildCharacter from "../../../../hooks/character/useUpdateGuildCharacter";
import useDeleteGuildCharacter from "../../../../hooks/character/useDeleteGuildCharacter";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from "material-react-table";

function GuildRoster() {
    const theme = useTheme();
    const [disablePadding, setDisablePadding] = useState(false);

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
    const { guildCharacters, isLoadingCharacters } =
        useAllGuildsCharacters(mainGuildId);
    const { guildPlayers, isLoadingPlayers } = useAllGuildsPlayers(mainGuildId);
    const { guildCharacterTags, isLoadingCharacterTags } =
        useAllGuildCharacterTags(mainGuildId);

    const isLoadingAny =
        isLoadingCharacters ||
        isLoadingPlayers ||
        isLoadingCharacterTags ||
        !guildCharacters ||
        !guildPlayers ||
        !guildCharacterTags;
    if (isLoadingAny) return <Loader />;
    const updatedCharacters = guildCharacters?.map((character) => {
        const player = guildPlayers.find(
            (player) => player.id === character.player_id
        );
        const tags = guildCharacterTags
            .filter((tag) => tag.character_id === character.id)
            .map((tag) => tag.tag_name);
        return {
            player_name: player.player_name,
            character_name: character.character_name,
            class: character.class,
            spec: character.spec,
            guild_rank: character.guild_rank,
            discord_name: character.discord_name,
            tags,
            character_id: character.id,
            player_id: player.id,
            guild_id: player.guild_id,
            profile_id: player.profile_id,
        };
    });

    return (
        <CharacterTable
            initialCharacters={updatedCharacters}
            isLoadingAny={isLoadingAny}
            tags={guildCharacterTags}
        />
    );
}

export default GuildRoster;

function CharacterTable({ initialCharacters, isLoadingAny, tags }) {
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
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.characterName,
                    helperText: validationErrors?.characterName,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            characterName: undefined,
                        }),
                },
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
                size: 80,
            },
            {
                accessorKey: "guild_rank",
                header: "Guild Rank",
                enableEditing: true,
                size: 80,
            },
            {
                accessorKey: "discord_name",
                header: "Discord Name",
                enableEditing: true,
                size: 80,
            },
            {
                accessorKey: "tags",
                header: "Tags",
                enableEditing: true,
                size: 80,
            },
            {
                accessorKey: "character_id",
                header: "Character ID",
                enableEditing: false,
                visibleInShowHideMenu: false,
            },
            {
                accessorKey: "player_id",
                header: "Player ID",
                enableEditing: false,
                visibleInShowHideMenu: false,
            },
            {
                accessorKey: "guild_id",
                header: "Guild ID",
                enableEditing: false,
                visibleInShowHideMenu: false,
            },
            {
                accessorKey: "profile_id",
                header: "Profile ID",
                enableEditing: false,
                visibleInShowHideMenu: false,
            },
        ],
        [validationErrors]
    );

    //call CREATE hook
    const { mutateAsync: createCharacter, isPending: isCreatingCharacter } =
        useCreateGuildCharacter();

    //call UPDATE hook
    const { mutateAsync: updateCharacter, isPending: isUpdatingCharacter } =
        useUpdateGuildCharacter();

    //call DELETE hook
    const { mutateAsync: deleteCharacter, isPending: isDeletingCharacter } =
        useDeleteGuildCharacter();

    //CREATE action
    const handleCreateCharacter = async ({ values, table }) => {
        const newValiationErrors = validateCharacter(values);
        if (Object.values(newValiationErrors).some((error) => error)) {
            setValidationErrors(newValiationErrors);
            return;
        }
        setValidationErrors({});
        await createCharacter(values);
        table.setCreatingRow(null);
    };

    //UPDATE action
    const handleSaveCharacter = async ({ values, table }) => {
        const newValiationErrors = validateCharacter(values);
        if (Object.values(newValiationErrors).some((error) => error)) {
            setValidationErrors(newValiationErrors);
            return;
        }
        setValidationErrors({});

        const {
            player_name,
            character_name,
            class: charClass,
            spec,
            guild_rank,
            discord_name,
            tags,
            character_id,
            player_id,
            guild_id,
            profile_id,
        } = values;

        const character = {
            id: character_id,
            character_name,
            discord_name,
            class: charClass,
            spec,
            player_id,
            guild_id,
            guild_rank,
        };

        const player = {
            id: player_id,
            player_name,
            profile_id,
            discord_name,
            guild_id,
        };

        const tagArray = tags?.length
            ? tags.split(",").map((tag) => tag.trim())
            : [];
        const charactersTags = characters.filter(
            (char) => char.id === character_id
        );
        const tagsToDelete = charactersTags
            .filter((tag) => !tagArray.includes(tag.tag_name))
            .map((tag) => tag.id);
        const newTags = tagArray
            ?.filter((tag) => {
                return !charactersTags.some((t) => t.tag_name === tag);
            })
            .map((tag) => ({
                tag_name: tag,
                character_id,
                guild_id,
            }));
        console.log("tagsToDelete", tagsToDelete);
        console.log("newTags", newTags);
        console.log("character", character);
        console.log("player", player);
        // await updateCharacter(character);
        // table.setEditingRow(false);
    };

    //DELETE action
    const handleDeleteCharacter = (row) => {
        if (window.confirm("Are you sure you want to delete this character?")) {
            deleteCharacter(row.original.id);
        }
    };

    const table = useMaterialReactTable({
        columns,
        data: characters,
        createDisplayMode: "row",
        editDisplayMode: "row",
        enableEditing: true,
        getRowId: (row) => row.id,
        muiTableContainerProps: {
            sx: {
                minHeight: "500px",
            },
        },
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
        renderTopToolbarCustomActions: ({ table }) => (
            <Button
                variant="container"
                onClick={() => table.setCreatingRow(true)}
            >
                Create Character
            </Button>
        ),
        state: {
            isLoading: isLoadingAny,
            isSaving:
                isCreatingCharacter ||
                isUpdatingCharacter ||
                isDeletingCharacter,
            showProgressBar: isLoadingAny,
            // columnVisibility: {
            //     character_id: false,
            //     player_id: false,
            //     guild_id: false,
            //     profile_id: false,
            // },
        },
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
