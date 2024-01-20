import PropTypes from "prop-types";
import { useState } from "react";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import {
    Avatar,
    Box,
    Button,
    ButtonBase,
    Container,
    Drawer,
    Grid,
    Link,
    Menu,
    MenuItem,
    Modal,
    Tooltip,
    Typography,
} from "@mui/material";

// project imports
import MainCard from "../../../components/cards/MainCard";
import SkeletonEarningCard from "../../../components/cards/Skeleton/EarningCard";

// assets
import EarningIcon from "../../../assets/images/icons/earning.svg";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import GetAppTwoToneIcon from "@mui/icons-material/GetAppOutlined";
import FileCopyTwoToneIcon from "@mui/icons-material/FileCopyOutlined";
import PictureAsPdfTwoToneIcon from "@mui/icons-material/PictureAsPdfOutlined";
import ArchiveTwoToneIcon from "@mui/icons-material/ArchiveOutlined";
import AnimateButton from "../../../components/extended/AnimateButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useStore } from "../../../store";
import useDeleteCharacter from "../../../hooks/useDeleteCharacter";
import { queryClient } from "../../../config";

const IFrameWrapper = styled("iframe")(({ theme }) => ({
    height: "calc(100vh - 210px)",
    border: "1px solid",
    borderColor: theme.palette.primary.light,
}));

const CardWrapper = styled(MainCard, {
    shouldForwardProp: (prop) => prop !== "characterColor",
})(({ theme, characterColor }) => {
    // console.log(characterColor);
    return {
        backgroundColor: theme.palette.grey100,
        color: "#fff",
        overflow: "hidden",
        position: "relative",
        "&:after": {
            content: '""',
            position: "absolute",
            width: 210,
            height: 210,
            background: characterColor,
            borderRadius: "50%",
            top: -85,
            right: -95,
            [theme.breakpoints.down("sm")]: {
                top: -105,
                right: -140,
            },
        },
        "&:before": {
            content: '""',
            position: "absolute",
            width: 210,
            height: 210,
            background: characterColor,
            borderRadius: "50%",
            top: -125,
            right: -15,
            opacity: 0.5,
            [theme.breakpoints.down("sm")]: {
                top: -155,
                right: -70,
            },
        },
    };
});

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

export default function CharacterCard({ isLoading, character }) {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const borderRadius = useStore((state) => state.borderRadius);
    const deleteMutation = useDeleteCharacter(character.discord_name);
    const [modalOpen, setModalOpen] = useState(false);

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };
    const handleDialogClose = () => {
        setDialogOpen(false);
    };
    const colorKey =
        character.class.charAt(0).toLowerCase() + character.class.slice(1);
    let characterColor = theme.palette.wow[colorKey];
    if (characterColor === "#ffffff") characterColor = theme.palette.grey[400];

    function handleClickDeleteCharacter() {
        handleCloseMenu();
        handleDialogOpen();
    }

    function deleteCharacter() {
        deleteMutation.mutate(character.id);
        handleDialogClose();
    }

    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <>
                    <CardWrapper
                        border={false}
                        content={false}
                        characterColor={characterColor}
                    >
                        <Box sx={{ p: 2.25 }}>
                            <Grid container direction="column">
                                <Grid item>
                                    <Grid
                                        container
                                        justifyContent="space-between"
                                    >
                                        <Grid item>
                                            <AnimateButton>
                                                <Tooltip title="Character Armory">
                                                    <ButtonBase
                                                        onClick={
                                                            handleModalOpen
                                                        }
                                                    >
                                                        <Avatar
                                                            variant="rounded"
                                                            sx={{
                                                                ...theme
                                                                    .typography
                                                                    .commonAvatar,
                                                                ...theme
                                                                    .typography
                                                                    .largeAvatar,
                                                                backgroundColor:
                                                                    theme
                                                                        .palette
                                                                        .primary[800],
                                                                mt: 1,
                                                                "&:hover": {
                                                                    backgroundColor:
                                                                        theme
                                                                            .palette
                                                                            .primary
                                                                            .main,
                                                                    color: theme
                                                                        .palette
                                                                        .primary[100],
                                                                },
                                                            }}
                                                        >
                                                            <img
                                                                src={
                                                                    EarningIcon
                                                                }
                                                                alt="Notification"
                                                            />
                                                        </Avatar>
                                                    </ButtonBase>
                                                </Tooltip>
                                            </AnimateButton>
                                        </Grid>
                                        <Grid item>
                                            <ButtonBase>
                                                <Avatar
                                                    variant="rounded"
                                                    sx={{
                                                        ...theme.typography
                                                            .commonAvatar,
                                                        ...theme.typography
                                                            .mediumAvatar,
                                                        backgroundColor:
                                                            theme.palette
                                                                .secondary[800],
                                                        color: theme.palette
                                                            .secondary[200],
                                                        zIndex: 1,
                                                        "&:hover": {
                                                            backgroundColor:
                                                                theme.palette
                                                                    .secondary
                                                                    .main,
                                                            color: theme.palette
                                                                .secondary[100],
                                                        },
                                                    }}
                                                    aria-controls="menu-earning-card"
                                                    aria-haspopup="true"
                                                    onClick={handleClickMenu}
                                                >
                                                    <MoreHorizIcon fontSize="inherit" />
                                                </Avatar>
                                            </ButtonBase>
                                            <Menu
                                                id="menu-earning-card"
                                                anchorEl={anchorEl}
                                                keepMounted
                                                open={Boolean(anchorEl)}
                                                onClose={handleCloseMenu}
                                                variant="selectedMenu"
                                                anchorOrigin={{
                                                    vertical: "bottom",
                                                    horizontal: "right",
                                                }}
                                                transformOrigin={{
                                                    vertical: "top",
                                                    horizontal: "right",
                                                }}
                                            >
                                                <MenuItem
                                                    onClick={handleCloseMenu}
                                                >
                                                    <EditIcon
                                                        sx={{ mr: 1.75 }}
                                                    />{" "}
                                                    Edit Character
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={
                                                        handleClickDeleteCharacter
                                                    }
                                                >
                                                    <DeleteForeverIcon
                                                        sx={{ mr: 1.75 }}
                                                    />{" "}
                                                    Delete Character
                                                </MenuItem>
                                            </Menu>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Grid container alignItems="center">
                                        <Grid item>
                                            <Typography
                                                sx={{
                                                    fontSize: "2.125rem",
                                                    fontWeight: 600,
                                                    color: characterColor,
                                                    mr: 1,
                                                    mt: 1.75,
                                                    mb: 0.75,
                                                }}
                                            >
                                                {character.character_name}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <AnimateButton>
                                                <Tooltip title="Warcraft Logs">
                                                    <Link
                                                        href={`https://vanilla.warcraftlogs.com/character/us/living-flame/${character.character_name}`}
                                                        target="_blank"
                                                    >
                                                        <Avatar
                                                            sx={{
                                                                cursor: "pointer",
                                                                ...theme
                                                                    .typography
                                                                    .smallAvatar,
                                                                backgroundColor:
                                                                    theme
                                                                        .palette
                                                                        .secondary[200],
                                                                color: theme
                                                                    .palette
                                                                    .secondary
                                                                    .dark,
                                                            }}
                                                        >
                                                            <ArrowUpwardIcon
                                                                fontSize="inherit"
                                                                sx={{
                                                                    transform:
                                                                        "rotate3d(1, 1, 1, 45deg)",
                                                                }}
                                                            />
                                                        </Avatar>
                                                    </Link>
                                                </Tooltip>
                                            </AnimateButton>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item sx={{ mb: 1.25 }}>
                                    <Typography
                                        sx={{
                                            fontSize: "1rem",
                                            fontWeight: 500,
                                            color: theme.palette.secondary[200],
                                        }}
                                    >
                                        {character.spec}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardWrapper>
                    <Dialog
                        open={dialogOpen}
                        onClose={handleDialogClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            <Typography
                                sx={{
                                    fontSize: "1.5rem",
                                    fontWeight: 500,
                                }}
                            >
                                Are you sure you want to delete this character?
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Character: {character.character_name}
                            </DialogContentText>
                            <DialogContentText>
                                Class: {character.class}
                            </DialogContentText>
                            <DialogContentText>
                                Spec: {character.spec}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <AnimateButton>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        backgroundColor:
                                            theme.palette.error.main,
                                        cursor: "pointer",
                                        padding: "0.5rem 1rem",
                                        color: theme.palette.error.contrastText,
                                        fontSize: "1rem",
                                        borderRadius,
                                    }}
                                    onClick={handleDialogClose}
                                >
                                    Cancel
                                </Typography>
                            </AnimateButton>
                            <AnimateButton>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        backgroundColor:
                                            theme.palette.success.main,
                                        cursor: "pointer",
                                        padding: "0.5rem 1rem",
                                        color: theme.palette.error.contrastText,
                                        fontSize: "1rem",
                                        borderRadius,
                                    }}
                                    onClick={deleteCharacter}
                                >
                                    Confirm
                                </Typography>
                            </AnimateButton>
                        </DialogActions>
                    </Dialog>

                    <Drawer
                        open={modalOpen}
                        onClose={handleModalClose}
                        anchor="bottom"
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        PaperProps={{
                            sx: {
                                width: "80%",
                                margin: "0 auto",
                                borderTopLeftRadius: borderRadius,
                                borderTopRightRadius: borderRadius,
                                backgroundColor: "transparent",
                            },
                        }}
                    >
                        <Box>
                            <IFrameWrapper
                                title="Tabler Icons"
                                width="100%"
                                src={`https://atlasforge.gg/wow-classic/armory/us/living-flame/${character.character_name}`}
                            />
                        </Box>
                    </Drawer>
                </>
            )}
        </>
    );
}

CharacterCard.propTypes = {
    isLoading: PropTypes.bool,
};
