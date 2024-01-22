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
    useMediaQuery,
} from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useState } from "react";

const RosterBuilderSidebar = ({ listItems }) => {
    const theme = useTheme();
    const matchUpLg = useMediaQuery(theme.breakpoints.up("lg"));
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

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
            <Stack
                spacing={3}
                divider={<Divider />}
                sx={{ paddingTop: matchUpLg ? 0 : "30px" }}
            >
                {listItems.map((item) => (
                    <Box
                        key={item.id}
                        sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            color: theme.palette.grey[500],
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                            }}
                        >
                            {item.icon}
                            <Typography
                                variant="h4"
                                sx={{ fontWeight: "600", ml: 2 }}
                                color={theme.palette.secondary.main}
                            >
                                {item.name}
                            </Typography>
                        </Box>

                        {item.content}
                    </Box>
                ))}
            </Stack>
        </PerfectScrollbar>
    );

    const mobileDrawer = (
        <>
            <List
                disablePadding
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {listItems.map((item) => (
                    <ListItem disablePadding key={item.id}>
                        <ListItemButton
                            sx={{
                                padding: 1,
                                margin: 0,
                                mb: 2,
                                justifyContent: "center",
                            }}
                            onClick={toggleMobileDrawer}
                        >
                            <ListItemIcon sx={{ justifyContent: "center" }}>
                                {item.icon}
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </>
    );

    return (
        <Box
            component="nav"
            sx={{
                flexShrink: { md: 0 },
                width: "auto",
            }}
            aria-label="roster-builder-options"
        >
            {/* DESKTOP VIEW */}
            {matchUpLg && (
                <Drawer
                    variant={"persistent"}
                    anchor="right"
                    open
                    sx={{
                        "& .MuiDrawer-paper": {
                            width: "auto",
                            background: theme.palette.background.default,
                            color: theme.palette.text.primary,
                            borderRight: "none",
                            [theme.breakpoints.up("lg")]: {
                                top: "88px",
                                pt: "24px",
                            },
                            zIndex: 1,
                        },
                    }}
                    PaperProps={{
                        style: {},
                    }}
                    ModalProps={{ keepMounted: true }}
                    color="inherit"
                >
                    {desktopDrawer}
                </Drawer>
            )}
            {/* MOBILE CLOSED VIEW */}

            {!matchUpLg && mobileDrawerOpen && (
                <Drawer
                    variant={"temporary"}
                    anchor="right"
                    open={mobileDrawerOpen}
                    onClose={toggleMobileDrawer}
                    sx={{
                        "& .MuiDrawer-paper": {
                            width: "auto",
                            background: theme.palette.background.default,
                            color: theme.palette.text.primary,
                            borderRight: "none",
                            [theme.breakpoints.up("lg")]: {
                                top: "88px",
                                pt: "24px",
                            },
                            zIndex: 1,
                        },
                    }}
                    ModalProps={{ keepMounted: true }}
                    color="inherit"
                >
                    {desktopDrawer}
                </Drawer>
            )}
            {!matchUpLg && !mobileDrawerOpen && (
                <Drawer
                    variant="persistent"
                    open={!mobileDrawerOpen}
                    anchor="right"
                    sx={{
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
                    }}
                >
                    {mobileDrawer}
                </Drawer>
            )}
            {/*
            {!matchUpLg && mobileDrawerOpen && (
                <Drawer
                    variant="temporary"
                    open={mobileDrawerOpen}
                    anchor="right"
                    sx={{
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
                    }}
                >
                    {mobileDrawer}
                </Drawer>
            )} */}
        </Box>
    );
};

export default RosterBuilderSidebar;
