import {
    Divider,
    Grid,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import AuthCardWrapper from "../../../pages/authentication/AuthCardWrapper";
import Logo from "../../../../components/Logo";
import GuildForm from "./GuildForm";

export default function MyGuildsCreate() {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
    return (
        <Grid container direction="column" justifyContent="flex-end">
            <Grid item xs={12}>
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                        <AuthCardWrapper>
                            <Grid
                                container
                                spacing={2}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Grid item sx={{ mb: 3 }}>
                                    <Logo />
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid
                                        container
                                        direction={
                                            matchDownSM
                                                ? "column-reverse"
                                                : "row"
                                        }
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Grid item>
                                            <Stack
                                                alignItems="center"
                                                justifyContent="center"
                                                spacing={1}
                                            >
                                                <Typography
                                                    color={
                                                        theme.palette.secondary
                                                            .main
                                                    }
                                                    gutterBottom
                                                    variant={
                                                        matchDownSM
                                                            ? "h3"
                                                            : "h2"
                                                    }
                                                >
                                                    Create a guild
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    fontSize="16px"
                                                    textAlign={
                                                        matchDownSM
                                                            ? "center"
                                                            : "inherit"
                                                    }
                                                >
                                                    All fields required
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <GuildForm />
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>
                            </Grid>
                        </AuthCardWrapper>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
