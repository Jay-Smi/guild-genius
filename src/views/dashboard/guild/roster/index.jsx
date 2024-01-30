import { useTheme } from "@emotion/react";
import { useStore } from "../../../../store";
import useUserInfo from "../../../../hooks/useUserInfo";
import { useAllGuildsCharacters } from "../../../../hooks/character/useCharacters";
import useAllGuildsPlayers from "../../../../hooks/player/useAllGuildsPlayers";
import useAllGuildCharacterTags from "../../../../hooks/character/useAllGuildCharacterTags";
import Loader from "../../../../components/Loader";
import { useMemo, useState } from "react";
import {
    Box,
    Checkbox,
    FormControlLabel,
    IconButton,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Toolbar,
    Tooltip,
    Typography,
    alpha,
    useThemeProps,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";

const headCells = [
    {
        id: "playername",
        numeric: false,
        disablePadding: false,
        label: "Player Name",
    },
    {
        id: "character-name",
        numeric: false,
        disablePadding: false,
        label: "Character Name",
    },
    {
        id: "class",
        numeric: false,
        disablePadding: true,
        label: "Class",
    },
    {
        id: "spec",
        numeric: false,
        disablePadding: true,
        label: "Spec",
    },
    {
        id: "guild-rank",
        numeric: false,
        disablePadding: true,
        label: "Guild Rank",
    },

    {
        id: "discord-name",
        numeric: false,
        disablePadding: true,
        label: "Discord Name",
    },
    {
        id: "tags",
        numeric: false,
        disablePadding: true,
        label: "Tags",
    },
];

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
        !guildPlayers ||
        !guildCharacterTags;

    if (isLoadingAny) return <Loader />;

    const updatedCharacters = guildCharacters.map((character) => {
        const player = guildPlayers.find(
            (player) => player.id === character.player_id
        );
        const tags = guildCharacterTags
            .filter((tag) => tag.character_id === character.id)
            .map((tag) => tag.tag_name);
        return {
            ...character,
            playerName: player.player_name,
            tags,
        };
    });

    return <CharacterTable characters={updatedCharacters} />;
}

export default GuildRoster;

function DataTableHead(props) {
    const {
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
    } = props;

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={
                            numSelected > 0 && numSelected < rowCount
                        }
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            "aria-label": "select all characters",
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "normal"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === "desc"
                                        ? "sorted descending"
                                        : "sorted ascending"}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function TableToolbar(props) {
    const theme = useTheme();
    const { numSelected } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(
                            theme.palette.primary.main,
                            theme.palette.action.activatedOpacity
                        ),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{
                        flex: "1 1 100%",
                        color: theme.palette.text.title,
                        fontSize: "1.25rem",
                    }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Characters
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}

function CharacterTable({ characters }) {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("character-name");
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = characters.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0
            ? Math.max(0, (1 + page) * rowsPerPage - characters.length)
            : 0;

    const visibleRows = useMemo(
        () =>
            stableSort(characters, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
            ),
        [order, orderBy, page, rowsPerPage, characters]
    );

    return (
        <Box sx={{ width: "100%" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
                <TableToolbar numSelected={selected.length} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? "small" : "medium"}
                    >
                        <DataTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={characters.length}
                        />
                        <TableBody>
                            {visibleRows.map((character, index) => {
                                const isItemSelected = isSelected(character.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) =>
                                            handleClick(event, character.id)
                                        }
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={character.id}
                                        selected={isItemSelected}
                                        sx={{ cursor: "pointer" }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    "aria-labelledby": labelId,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            align="left"
                                            scope="row"
                                            padding="none"
                                            sx={{ pl: 2 }}
                                        >
                                            {character.playerName}
                                        </TableCell>
                                        <TableCell align="left">
                                            {character.character_name}
                                        </TableCell>
                                        <TableCell align="left">
                                            {character.class}
                                        </TableCell>
                                        <TableCell align="right">
                                            {character.spec}
                                        </TableCell>
                                        <TableCell align="right">
                                            {character.guild_rank}
                                        </TableCell>
                                        <TableCell align="right">
                                            {character.discord_name}
                                        </TableCell>
                                        <TableCell align="right">
                                            {character.tags.join(", ")}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[25, 50, 100]}
                    component="div"
                    count={characters.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={
                    <Switch checked={dense} onChange={handleChangeDense} />
                }
                label="Dense padding"
            />
        </Box>
    );
}
