import {
    Box,
    Checkbox,
    Chip,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
    styled,
    useTheme,
} from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useStore } from "../../../../../store";
import { memo } from "react";

const StyledList = styled(List)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    padding: 0,
    paddingBottom: "50px",
}));

const StyledListItem = styled(ListItem, {
    shouldForwardProp: (prop) =>
        prop !== "index" && prop !== "playerMissingRank",
})(({ theme, index, playerMissingRank }) => ({
    backgroundColor:
        index % 2 === 0
            ? theme.palette.background.dark2
            : theme.palette.background.dark1,
    borderRight: playerMissingRank ? "5px solid red" : "5px solid transparent",
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
    "&:hover": {
        backgroundColor: theme.palette.background.paper,
    },
}));

const ImportList = memo(
    ({ importData, checked, handleToggleChecked, validationErrors }) => {
        const { playersMissingRank } = validationErrors;
        const borderRadius = useStore((state) => state.borderRadius);
        const theme = useTheme();

        return (
            <Box
                sx={{
                    height: "calc(100svh - 115px)",
                    overflow: "hidden",
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: borderRadius / 2,
                    boxShadow: "-1px 7px 8px 4px rgb(0 0 0 / 40%)",
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        align="center"
                        sx={{
                            p: 1,
                            borderBottom: `1px solid ${theme.palette.background.dark1}`,
                        }}
                    >
                        New Players
                    </Typography>
                </Box>
                <PerfectScrollbar component="div">
                    <StyledList>
                        {importData.map((obj, index) => {
                            const playerMissingRank = playersMissingRank.some(
                                (player) => {
                                    return (
                                        player.discord_name === obj.discord_name
                                    );
                                }
                            );

                            return (
                                <StyledListItem
                                    key={obj.discord_name}
                                    index={index}
                                    disablePadding
                                    playerMissingRank={playerMissingRank}
                                >
                                    <StyledListItemButton
                                        onClick={() =>
                                            handleToggleChecked(
                                                obj.discord_name
                                            )
                                        }
                                        role={undefined}
                                        dense
                                    >
                                        <ListItemIcon>
                                            <Checkbox
                                                edge="start"
                                                checked={
                                                    checked.indexOf(
                                                        obj.discord_name
                                                    ) !== -1
                                                }
                                                tabIndex={-1}
                                                disableRipple
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={obj.player_name}
                                        />
                                        <Stack
                                            direction="row-reverse"
                                            useFlexGap
                                            spacing={1}
                                            flexWrap="wrap"
                                        >
                                            {obj.roles.map((role) => (
                                                <Chip
                                                    key={role}
                                                    label={role}
                                                    size="small"
                                                />
                                            ))}
                                        </Stack>
                                    </StyledListItemButton>
                                </StyledListItem>
                            );
                        })}
                    </StyledList>
                </PerfectScrollbar>
            </Box>
        );
    }
);

ImportList.displayName = "ImportList";

export default ImportList;
