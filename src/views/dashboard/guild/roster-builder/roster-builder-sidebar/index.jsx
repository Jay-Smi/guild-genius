// material-ui
import { useTheme } from "@mui/material/styles";
import {
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    Stack,
    Typography,
    styled,
    useMediaQuery,
} from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useContext, useState } from "react";
import SidebarItems from "./sidebar-items";
import { format, isEqual, parse, parseISO } from "date-fns";
import { getLockoutStartAndEndDates } from "../../../../../utils/wowHelpers";
import dayjs from "dayjs";
import { useStore } from "zustand";
import { RosterContext } from "../store/RosterContextProvider";
import toast from "react-hot-toast";
import { useAllGuildInstanceLockouts } from "../../../../../hooks/useGuildInstanceLockout";
import { useAllGuildsRaids } from "../../../../../hooks/useRaids";
import {
    useAllGuildsGroupCharacters,
    useAllGuildsGroups,
} from "../../../../../hooks/useGroups";
import { useAllGuildsRaidsTags } from "../../../../../hooks/useGuildsRaidsTags";
import Loader from "../../../../../components/Loader";

const StyledStack = styled(Stack, {
    shouldForwardProp: (prop) => prop !== "matchUpLg",
})(({ theme, matchUpLg }) => ({
    paddingTop: matchUpLg ? 0 : "30px",
}));

const StyledAlphaBox = styled(Box)(({ theme }) => ({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: theme.palette.grey[500],
}));

const StyledSecondaryBox = styled(Box)(({ theme }) => ({
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    marginBottom: "0.5rem",
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
    fontWeight: "600",
    marginLeft: "1rem",
}));

const StyledList = styled(List)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
    padding: "0.3rem",
    margin: 0,
    marginBottom: "2rem",
    justifyContent: "center",
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
    justifyContent: "center",
}));

const StyledDesktopDrawer = styled(Drawer)(({ theme }) => ({
    "& .MuiDrawer-paper": {
        width: "auto",
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
        borderRight: "none",
        [theme.breakpoints.up("lg")]: {
            top: "88px",
            paddingTop: "24px",
        },
        zIndex: 1,
    },
}));

const StyledMobileDrawer = styled(Drawer)(({ theme }) => ({
    "& .MuiDrawer-paper": {
        width: "auto",
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
        borderRight: "none",
        [theme.breakpoints.down("lg")]: {
            top: "80px",
            paddingTop: "24px",
        },
        zIndex: 1,
    },
}));

const RosterBuilderSidebar = ({ guildId }) => {
    const theme = useTheme();
    const matchUpLg = useMediaQuery(theme.breakpoints.up("lg"));
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const rosterStore = useContext(RosterContext);
    const categories = useStore(rosterStore, (state) => state.categories);
    const characters = useStore(rosterStore, (state) => state.characters);

    const { lockouts, lockoutsError, isLoadingLockouts } =
        useAllGuildInstanceLockouts(guildId);
    const { raids, raidsError, isLoadingRaids } = useAllGuildsRaids(guildId);
    const { groups, groupsError, isLoadingGroups } =
        useAllGuildsGroups(guildId);
    const {
        guildGroupCharacters,
        groupCharactersError,
        isLoadingGroupCharacters,
    } = useAllGuildsGroupCharacters(guildId);
    const { raidsTags, raidsTagsError, isLoadingRaidsTags } =
        useAllGuildsRaidsTags(guildId);

    const isLoadingAny =
        isLoadingLockouts ||
        isLoadingRaids ||
        isLoadingGroups ||
        isLoadingGroupCharacters ||
        isLoadingRaidsTags ||
        raids === undefined ||
        groups === undefined ||
        guildGroupCharacters === undefined ||
        raidsTags === undefined;

    const createExistingTabsContainer = useStore(
        rosterStore,
        (state) => state.createExistingTabsContainer
    );
    const chosenLockouts = useStore(
        rosterStore,
        (state) => state.chosenLockouts
    );
    const setChosenLockouts = useStore(
        rosterStore,
        (state) => state.setChosenLockouts
    );
    const createTabsContainer = useStore(
        rosterStore,
        (state) => state.createTabsContainer
    );
    const selectedInstance = useStore(
        rosterStore,
        (state) => state.selectedInstance
    );
    const setSelectedInstance = useStore(
        rosterStore,
        (state) => state.setSelectedInstance
    );
    const selectedTab = useStore(rosterStore, (state) => state.selectedTab);
    const setSelectedTab = useStore(
        rosterStore,
        (state) => state.setSelectedTab
    );
    const removeTabContainer = useStore(
        rosterStore,
        (state) => state.removeTabContainer
    );
    const [hoveredDay, setHoveredDay] = useState(null);
    const [selectedLockout, setSelectedLockout] = useState(null);

    const sideBarItems = SidebarItems({
        selectedInstance,
        handleInstanceSelectChange,
        hoveredDay,
        setHoveredDay,
        selectedLockout,
        setSelectedLockout,
        chosenLockouts,
        handleAddLockout,
        handleDeleteLockout,
    });

    function handleDeleteLockout(lockout) {
        const newLockouts = chosenLockouts.filter((prevLockout) => {
            return prevLockout.id !== lockout.id;
            // return !isEqual(
            //     parseISO(prevLockout.startDate),
            //     parseISO(lockout.startDate)
            // );
        });

        setSelectedTab(0);

        removeTabContainer(lockout.id);
        setChosenLockouts(newLockouts);
    }

    function selectedLockoutAlreadySaved(startDate) {
        return lockouts.some((lockout) => {
            return lockout.start_date === startDate;
        });
    }

    function handleAddLockout() {
        if (selectedLockout === null) {
            return;
        }

        const { startDate, endDate } =
            getLockoutStartAndEndDates(selectedLockout);

        const alreadyAdded = chosenLockouts.some((lockout) => {
            return dayjs(lockout.startDate).isSame(dayjs(startDate));
        });
        if (alreadyAdded) {
            toast.error("Lockout already added");
            return;
        }

        const newLockoutId = crypto.randomUUID();
        const newLockouts = [
            ...chosenLockouts,
            {
                id: newLockoutId,
                startDate,
                endDate,
            },
        ];

        if (selectedLockoutAlreadySaved(startDate)) {
            const selectedGuildInstanceLockout = lockouts.find(
                (lockout) => lockout.start_date === startDate
            );

            const containers = buildExistingLockoutContainers(
                selectedGuildInstanceLockout
            );
            console.log("containers", containers);

            createExistingTabsContainer(newLockoutId, containers);
        } else {
            createTabsContainer(newLockoutId);
        }

        setChosenLockouts(newLockouts);
    }
    //lockouts
    //raids
    //groups
    //guildGroupCharacters
    //raidsTags

    function buildExistingLockoutContainers(selectedGuildInstanceLockout) {
        const newRaids = raids.filter(
            (raid) =>
                raid.guild_instance_lockout_id ===
                selectedGuildInstanceLockout.id
        );
        const newGroups = groups.filter(
            (group) =>
                group.guild_instance_lockout_id ===
                selectedGuildInstanceLockout.id
        );
        const newGuildGroupCharacters = guildGroupCharacters.filter(
            (guildGroupCharacter) =>
                guildGroupCharacter.guild_instance_lockout_id ===
                selectedGuildInstanceLockout.id
        );
        const newRaidsTags = raidsTags.filter(
            (raidTag) =>
                raidTag.guild_instance_lockout_id ===
                selectedGuildInstanceLockout.id
        );

        const newCategories = Object.values(categories).map((category) => {
            //remove any rostered characters from category
            const newCategoryData = category.data.filter((characterId) => {
                return !newGuildGroupCharacters.some(
                    (guildGroupCharacter) =>
                        guildGroupCharacter.character_id === characterId
                );
            });
            return {
                ...category,
                data: newCategoryData,
            };
        });

        const updatedRaids = newRaids.map((raid) => {
            const raidTags = newRaidsTags
                .filter((raidTag) => raidTag.raid_id === raid.id)
                .map((raidTag) => {
                    return {
                        ...raidTag,
                        tag: raidTag.tag_name,
                    };
                });
            const raidsGroups = newGroups
                .filter((group) => group.raid_id === raid.id)
                .map((group) => group.id);
            const formattedTime = parse(raid.time, "HH:mm:ss", new Date());
            return {
                ...raid,
                time: format(formattedTime, "h:mm a"),
                tags: raidTags,
                data: raidsGroups,
            };
        });
        const updatedGroups = newGroups.map((group) => {
            const groupCharacters = newGuildGroupCharacters
                .filter(
                    (guildGroupCharacter) =>
                        guildGroupCharacter.group_id === group.id
                )
                .map((guildGroupCharacter) => guildGroupCharacter.character_id);
            return {
                ...group,
                data: groupCharacters,
            };
        });

        const containersObject = [
            ...newCategories,
            ...updatedRaids,
            ...updatedGroups,
            ...Object.values(characters),
            {
                id: "categoriesContainer",
                type: "container",
                data: newCategories.map((category) => category.id),
            },
            {
                id: "raidsContainer",
                type: "container",
                data: updatedRaids.map((raid) => raid.id),
            },
        ].reduce((acc, container) => {
            acc[container.id] = container;
            return acc;
        }, {});

        return containersObject;
    }

    function handleInstanceSelectChange(event) {
        setSelectedInstance(event.target.value);
    }

    function toggleMobileDrawer() {
        setMobileDrawerOpen(!mobileDrawerOpen);
    }

    const desktopDrawer = (
        <PerfectScrollbar
            component="div"
            style={{
                paddingLeft: "16px",
                paddingRight: "16px",
                paddingBottom: "100px",
            }}
        >
            <StyledStack
                spacing={3}
                divider={<Divider />}
                matchUpLg={matchUpLg}
            >
                {sideBarItems.map((item) => (
                    <StyledAlphaBox key={item.id}>
                        <StyledSecondaryBox>
                            {item.icon}
                            <StyledTypography
                                variant="h4"
                                color={
                                    theme.palette.mode === "dark"
                                        ? theme.palette.primary[200]
                                        : theme.palette.secondary.main
                                }
                            >
                                {item.name}
                            </StyledTypography>
                        </StyledSecondaryBox>

                        {item.content}
                    </StyledAlphaBox>
                ))}
            </StyledStack>
        </PerfectScrollbar>
    );

    const mobileDrawer = (
        <>
            <StyledList disablePadding>
                {sideBarItems.map((item) => (
                    <ListItem disablePadding key={item.id}>
                        <StyledListItemButton onClick={toggleMobileDrawer}>
                            <StyledListItemIcon>{item.icon}</StyledListItemIcon>
                        </StyledListItemButton>
                    </ListItem>
                ))}
            </StyledList>
        </>
    );

    return (
        <Box component="nav" aria-label="roster-builder-options">
            {isLoadingAny && <Loader />}
            {/* DESKTOP VIEW */}
            {matchUpLg && (
                <StyledDesktopDrawer
                    variant="persistent"
                    anchor="right"
                    open
                    color="inherit"
                >
                    {desktopDrawer}
                </StyledDesktopDrawer>
            )}
            {/* MOBILE CLOSED VIEW */}

            {!matchUpLg && mobileDrawerOpen && (
                <StyledDesktopDrawer
                    variant="temporary"
                    anchor="right"
                    open={mobileDrawerOpen}
                    onClose={toggleMobileDrawer}
                    ModalProps={{ keepMounted: true }}
                    color="inherit"
                >
                    {desktopDrawer}
                </StyledDesktopDrawer>
            )}
            {!matchUpLg && !mobileDrawerOpen && (
                <StyledMobileDrawer
                    variant="persistent"
                    open={!mobileDrawerOpen}
                    anchor="right"
                >
                    {mobileDrawer}
                </StyledMobileDrawer>
            )}
        </Box>
    );
};

export default RosterBuilderSidebar;
