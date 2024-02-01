import { useState, useRef, useEffect } from "react";

import { useNavigate } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    ClickAwayListener,
    Divider,
    Grid,
    InputAdornment,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    OutlinedInput,
    Paper,
    Popper,
    Stack,
    Switch,
    Typography,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import MainCard from "../../../../components/cards/MainCard";
import Transitions from "../../../../components/extended/Transitions";
import UpgradePlanCard from "./UpgradePlanCard";
import User1 from "../../../../assets/images/users/user-round.svg";
import { useStore } from "../../../../store";

// assets
import {
    IconLogout,
    IconSearch,
    IconSettings,
    IconUser,
} from "@tabler/icons-react";
import { signOut } from "../../../../services/auth/apiDiscord";
import useUserInfo from "../../../../hooks/useUserInfo";
import useGuild from "../../../../hooks/useGuild";
import { convertRankToString } from "../../../../utils/helpers";

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
    const user = useStore((state) => state.session.user);

    const userId = user.id;
    const discordName = user.user_metadata.name;
    const { profile, characters, players } = useUserInfo(userId, discordName);
    const somePlayerisInGuild =
        players?.some((player) => player.guild_id !== null) || false;

    const { guild } = useGuild(players[0].guild_id, somePlayerisInGuild);
    const avatarURL = user.user_metadata.avatar_url;
    const mainPlayer =
        players.find((player) => player.id === profile[0].main_player) ||
        players[0];
    const mainCharacter = characters.find(
        (character) => character.id === mainPlayer.main_character
    );
    const highestRank = characters.reduce((minCharacter, currentCharacter) => {
        if (
            minCharacter === null ||
            currentCharacter.guild_rank < minCharacter.guild_rank
        ) {
            return currentCharacter;
        } else {
            return minCharacter;
        }
    }, null);

    const guildRank = convertRankToString(highestRank.guild_rank);

    const theme = useTheme();
    const borderRadius = useStore((state) => state.borderRadius);
    const setNavType = useStore((state) => state.setNavType);
    const navigate = useNavigate();

    const [sdm, setSdm] = useState(true);
    const [value, setValue] = useState("");
    const [notification, setNotification] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const handleLogout = async () => {
        signOut();
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleListItemClick = (event, index, route = "") => {
        setSelectedIndex(index);
        handleClose(event);

        if (route && route !== "") {
            navigate(route);
        }
    };
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleToggleTheme = () => {
        const newTheme = theme.palette.mode === "dark" ? "light" : "dark";
        setNavType(newTheme);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <>
            <Chip
                sx={{
                    height: "48px",
                    alignItems: "center",
                    borderRadius: "27px",
                    transition: "all .2s ease-in-out",
                    borderColor:
                        theme.palette.mode === "dark"
                            ? theme.palette.background.paper
                            : theme.palette.primary.light,
                    backgroundColor:
                        theme.palette.mode === "dark"
                            ? theme.palette.background.dark3
                            : theme.palette.primary.light,
                    '&[aria-controls="menu-list-grow"], &:hover': {
                        borderColor: theme.palette.primary.main,
                        background: `${theme.palette.primary.main}!important`,
                        color: theme.palette.primary.light,
                        "& svg": {
                            stroke: theme.palette.primary.light,
                        },
                    },
                    "& .MuiChip-label": {
                        lineHeight: 0,
                    },
                }}
                icon={
                    <Avatar
                        src={avatarURL}
                        sx={{
                            ...theme.typography.mediumAvatar,
                            margin: "8px 0 8px 8px !important",
                            cursor: "pointer",
                        }}
                        ref={anchorRef}
                        aria-controls={open ? "menu-list-grow" : undefined}
                        aria-haspopup="true"
                        color="inherit"
                    />
                }
                label={
                    <IconSettings
                        stroke={1.5}
                        size="1.5rem"
                        color={theme.palette.primary.main}
                    />
                }
                variant="outlined"
                ref={anchorRef}
                aria-controls={open ? "menu-list-grow" : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="primary"
            />
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: "offset",
                            options: {
                                offset: [0, 14],
                            },
                        },
                    ],
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper
                            sx={{
                                backgroundColor:
                                    theme.palette.mode === "dark"
                                        ? theme.palette.background.dark3
                                        : theme.palette.primary.light,
                            }}
                        >
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard
                                    border={false}
                                    elevation={16}
                                    content={false}
                                    boxShadow
                                    shadow={theme.shadows[16]}
                                    sx={{
                                        backgroundColor:
                                            theme.palette.mode === "dark"
                                                ? theme.palette.background.dark1
                                                : theme.palette.background
                                                      .paper,
                                    }}
                                >
                                    <Box sx={{ p: 2 }}>
                                        <Stack>
                                            <Stack
                                                direction="row"
                                                spacing={0.5}
                                                alignItems="center"
                                            >
                                                <Typography
                                                    variant="h4"
                                                    sx={{
                                                        color:
                                                            theme.palette
                                                                .mode === "dark"
                                                                ? theme.palette
                                                                      .text.dark
                                                                : theme.palette
                                                                      .background
                                                                      .paper,
                                                    }}
                                                >
                                                    Hello,
                                                </Typography>
                                                <Typography
                                                    component="span"
                                                    variant="h4"
                                                    sx={{
                                                        fontWeight: 400,
                                                        color:
                                                            theme.palette
                                                                .mode === "dark"
                                                                ? theme.palette
                                                                      .text.dark
                                                                : theme.palette
                                                                      .background
                                                                      .paper,
                                                    }}
                                                >
                                                    {profile[0].display_name}
                                                </Typography>
                                            </Stack>
                                            <Typography variant="subtitle2">
                                                {guildRank} of{" "}
                                                {guild[0]?.guild_name}
                                            </Typography>
                                        </Stack>
                                        <OutlinedInput
                                            sx={{
                                                width: "100%",
                                                pr: 1,
                                                pl: 2,
                                                my: 2,
                                                backgroundColor:
                                                    theme.palette.mode ===
                                                    "dark"
                                                        ? theme.palette
                                                              .background.dark3
                                                        : null,
                                                "& input": {
                                                    backgroundColor:
                                                        theme.palette.mode ===
                                                        "dark"
                                                            ? theme.palette
                                                                  .background
                                                                  .dark3
                                                            : null,
                                                    color:
                                                        theme.palette.mode ===
                                                        "dark"
                                                            ? theme.palette
                                                                  .primary[200]
                                                            : null,
                                                },
                                            }}
                                            id="input-search-profile"
                                            value={value}
                                            onChange={(e) =>
                                                setValue(e.target.value)
                                            }
                                            placeholder="Search profile options"
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <IconSearch
                                                        stroke={1.5}
                                                        size="1rem"
                                                        color={
                                                            theme.palette
                                                                .grey[500]
                                                        }
                                                    />
                                                </InputAdornment>
                                            }
                                            aria-describedby="search-helper-text"
                                            inputProps={{
                                                "aria-label": "weight",
                                            }}
                                        />
                                        <Divider />
                                    </Box>
                                    <PerfectScrollbar
                                        style={{
                                            height: "100%",
                                            maxHeight: "calc(100vh - 250px)",
                                            overflowX: "hidden",
                                        }}
                                    >
                                        <Box sx={{ p: 2 }}>
                                            {/* <UpgradePlanCard /> */}
                                            <Divider />
                                            <Card
                                                sx={{
                                                    bgcolor:
                                                        theme.palette.mode ===
                                                        "dark"
                                                            ? theme.palette
                                                                  .background
                                                                  .paper
                                                            : theme.palette
                                                                  .primary
                                                                  .light,
                                                    my: 2,
                                                }}
                                            >
                                                <CardContent>
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                        direction="column"
                                                    >
                                                        <Grid item>
                                                            <Grid
                                                                item
                                                                container
                                                                alignItems="center"
                                                                justifyContent="space-between"
                                                            >
                                                                <Grid item>
                                                                    <Typography
                                                                        variant="subtitle1"
                                                                        sx={{
                                                                            color:
                                                                                theme
                                                                                    .palette
                                                                                    .mode ===
                                                                                "dark"
                                                                                    ? theme
                                                                                          .palette
                                                                                          .text
                                                                                          .dark
                                                                                    : null,
                                                                        }}
                                                                    >
                                                                        Start
                                                                        DND Mode
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item>
                                                                    <Switch
                                                                        color="primary"
                                                                        checked={
                                                                            sdm
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setSdm(
                                                                                e
                                                                                    .target
                                                                                    .checked
                                                                            )
                                                                        }
                                                                        name="sdm"
                                                                        size="small"
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item>
                                                            <Grid
                                                                item
                                                                container
                                                                alignItems="center"
                                                                justifyContent="space-between"
                                                            >
                                                                <Grid item>
                                                                    <Typography
                                                                        variant="subtitle1"
                                                                        sx={{
                                                                            color:
                                                                                theme
                                                                                    .palette
                                                                                    .mode ===
                                                                                "dark"
                                                                                    ? theme
                                                                                          .palette
                                                                                          .text
                                                                                          .dark
                                                                                    : null,
                                                                        }}
                                                                    >
                                                                        Allow
                                                                        Notifications
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item>
                                                                    <Switch
                                                                        checked={
                                                                            notification
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setNotification(
                                                                                e
                                                                                    .target
                                                                                    .checked
                                                                            )
                                                                        }
                                                                        name="sdm"
                                                                        size="small"
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                            <Divider />
                                            <List
                                                component="nav"
                                                sx={{
                                                    width: "100%",
                                                    maxWidth: 350,
                                                    minWidth: 300,
                                                    backgroundColor:
                                                        theme.palette.mode ===
                                                        "dark"
                                                            ? theme.palette
                                                                  .background
                                                                  .dark1
                                                            : theme.palette
                                                                  .background
                                                                  .paper,
                                                    borderRadius: "10px",
                                                    [theme.breakpoints.down(
                                                        "md"
                                                    )]: {
                                                        minWidth: "100%",
                                                    },
                                                    "& .MuiListItemButton-root":
                                                        {
                                                            mt: 0.5,
                                                        },
                                                }}
                                            >
                                                <ListItemButton
                                                    sx={{
                                                        borderRadius: `${borderRadius}px`,
                                                    }}
                                                    selected={
                                                        selectedIndex === 0
                                                    }
                                                    onClick={(event) =>
                                                        handleListItemClick(
                                                            event,
                                                            0,
                                                            "#"
                                                        )
                                                    }
                                                >
                                                    <ListItemIcon>
                                                        <IconSettings
                                                            stroke={1.5}
                                                            size="1.3rem"
                                                            color={
                                                                theme.palette
                                                                    .mode ===
                                                                "dark"
                                                                    ? theme
                                                                          .palette
                                                                          .primary[200]
                                                                    : theme
                                                                          .palette
                                                                          .grey[700]
                                                            }
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color:
                                                                        theme
                                                                            .palette
                                                                            .mode ===
                                                                        "dark"
                                                                            ? theme
                                                                                  .palette
                                                                                  .primary[200]
                                                                            : null,
                                                                }}
                                                            >
                                                                Account Settings
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItemButton>
                                                <ListItemButton
                                                    sx={{
                                                        borderRadius: `${borderRadius}px`,
                                                    }}
                                                    selected={
                                                        selectedIndex === 1
                                                    }
                                                    onClick={(event) =>
                                                        handleListItemClick(
                                                            event,
                                                            1,
                                                            "#"
                                                        )
                                                    }
                                                >
                                                    <ListItemIcon>
                                                        <IconUser
                                                            stroke={1.5}
                                                            size="1.3rem"
                                                            color={
                                                                theme.palette
                                                                    .mode ===
                                                                "dark"
                                                                    ? theme
                                                                          .palette
                                                                          .primary[200]
                                                                    : theme
                                                                          .palette
                                                                          .grey[700]
                                                            }
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={
                                                            <Grid
                                                                container
                                                                spacing={1}
                                                                justifyContent="space-between"
                                                            >
                                                                <Grid item>
                                                                    <Typography
                                                                        variant="body2"
                                                                        sx={{
                                                                            color:
                                                                                theme
                                                                                    .palette
                                                                                    .mode ===
                                                                                "dark"
                                                                                    ? theme
                                                                                          .palette
                                                                                          .primary[200]
                                                                                    : null,
                                                                        }}
                                                                    >
                                                                        Profile
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item>
                                                                    <Chip
                                                                        label="02"
                                                                        size="small"
                                                                        sx={{
                                                                            bgcolor:
                                                                                theme
                                                                                    .palette
                                                                                    .warning
                                                                                    .dark,
                                                                            color: theme
                                                                                .palette
                                                                                .background
                                                                                .default,
                                                                        }}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        }
                                                    />
                                                </ListItemButton>
                                                <ListItemButton
                                                    sx={{
                                                        borderRadius: `${borderRadius}px`,
                                                    }}
                                                    selected={
                                                        selectedIndex === 2
                                                    }
                                                    onClick={handleToggleTheme}
                                                >
                                                    <ListItemIcon
                                                        sx={{
                                                            color:
                                                                theme.palette
                                                                    .mode ===
                                                                "dark"
                                                                    ? theme
                                                                          .palette
                                                                          .primary[200]
                                                                    : theme
                                                                          .palette
                                                                          .grey[700],
                                                        }}
                                                    >
                                                        {theme.palette.mode ===
                                                        "light" ? (
                                                            <DarkModeIcon
                                                                sx={{
                                                                    color:
                                                                        theme
                                                                            .palette
                                                                            .mode ===
                                                                        "dark"
                                                                            ? theme
                                                                                  .palette
                                                                                  .primary[200]
                                                                            : theme
                                                                                  .palette
                                                                                  .grey[700],
                                                                }}
                                                            />
                                                        ) : (
                                                            <LightModeIcon
                                                                color={
                                                                    theme
                                                                        .palette
                                                                        .mode ===
                                                                    "dark"
                                                                        ? theme
                                                                              .palette
                                                                              .primary[200]
                                                                        : theme
                                                                              .palette
                                                                              .grey[700]
                                                                }
                                                            />
                                                        )}
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color:
                                                                        theme
                                                                            .palette
                                                                            .mode ===
                                                                        "dark"
                                                                            ? theme
                                                                                  .palette
                                                                                  .primary[200]
                                                                            : null,
                                                                }}
                                                            >
                                                                Theme
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItemButton>
                                                <ListItemButton
                                                    sx={{
                                                        borderRadius: `${borderRadius}px`,
                                                    }}
                                                    selected={
                                                        selectedIndex === 3
                                                    }
                                                    onClick={handleLogout}
                                                >
                                                    <ListItemIcon>
                                                        <IconLogout
                                                            stroke={1.5}
                                                            size="1.3rem"
                                                            color={
                                                                theme.palette
                                                                    .mode ===
                                                                "dark"
                                                                    ? theme
                                                                          .palette
                                                                          .primary[200]
                                                                    : theme
                                                                          .palette
                                                                          .grey[700]
                                                            }
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color:
                                                                        theme
                                                                            .palette
                                                                            .mode ===
                                                                        "dark"
                                                                            ? theme
                                                                                  .palette
                                                                                  .primary[200]
                                                                            : null,
                                                                }}
                                                            >
                                                                Logout
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItemButton>
                                            </List>
                                        </Box>
                                    </PerfectScrollbar>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};

export default ProfileSection;
