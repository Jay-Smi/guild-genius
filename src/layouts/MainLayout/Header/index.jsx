import PropTypes from "prop-types";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Avatar, Box, ButtonBase, Typography } from "@mui/material";

// project imports
import LogoSection from "../LogoSection";
import SearchSection from "./SearchSection";
import ProfileSection from "./ProfileSection";
import NotificationSection from "./NotificationSection";

// assets
import { IconMenu2 } from "@tabler/icons-react";
import { useGuildInstanceLockout } from "../../../hooks/useGuildInstanceLockout";
import { getLockoutStartAndEndDates } from "../../../utils/wowHelpers";
import useUserInfo from "../../../hooks/useUserInfo";
import useGuild from "../../../hooks/useGuild";
import { useStore } from "../../../store";
import { format, parseISO } from "date-fns";

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
    const theme = useTheme();
    // const user = useStore((state) => state.session.user);
    // const discordName = user.user_metadata.name;
    // const userId = user.id;
    // const { profile, characters, players } = useUserInfo(userId, discordName);
    // const somePlayerisInGuild =
    //     players?.some((player) => player.guild_id !== null) || false;

    // const { guild } = useGuild(players[0].guild_id, somePlayerisInGuild);
    // const guildId = guild[0].id;
    const today = new Date();
    const { startDate, endDate } = getLockoutStartAndEndDates(today);
    // const { lockout, lockoutError, isLoadingLockout } = useGuildInstanceLockout(
    //     startDate,
    //     guildId
    // );
    const start = format(parseISO(startDate), "MMMM dd");
    const end = format(parseISO(endDate), "MMMM dd");
    return (
        <>
            {/* logo & toggler button */}
            <Box
                sx={{
                    width: 228,
                    display: "flex",
                    [theme.breakpoints.down("md")]: {
                        width: "auto",
                    },
                }}
            >
                <Box
                    component="span"
                    sx={{ display: { xs: "none", md: "block" }, flexGrow: 1 }}
                >
                    <LogoSection />
                </Box>
                <ButtonBase sx={{ borderRadius: "12px", overflow: "hidden" }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: "all .2s ease-in-out",
                            background: theme.palette.secondary.light,
                            color: theme.palette.secondary.dark,
                            "&:hover": {
                                background: theme.palette.secondary.dark,
                                color: theme.palette.secondary.light,
                            },
                        }}
                        onClick={handleLeftDrawerToggle}
                        color="inherit"
                    >
                        <IconMenu2 stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
            </Box>

            {/* header search */}
            <SearchSection />
            <Typography
                variant="h4"
                sx={{ ml: 3, color: theme.palette.secondary.dark }}
            >
                {`Current Lockout: ${start} - ${end}`}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ flexGrow: 1 }} />

            {/* notification & profile */}
            <NotificationSection />
            <ProfileSection />
        </>
    );
};

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func,
};

export default Header;
