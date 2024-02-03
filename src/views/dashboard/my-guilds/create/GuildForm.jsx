import { Formik } from "formik";
import * as Yup from "yup";
import useScriptRef from "../../../../hooks/useScriptRef";
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import AnimateButton from "../../../../components/extended/AnimateButton";
import {
    allClasses,
    allSODRealms,
    allSpecs,
} from "../../../../utils/wowHelpers";
import { useStore } from "../../../../store";
import useUserInfo from "../../../../hooks/useUserInfo";
import useGuild from "../../../../hooks/useGuild";
import useCreateCharacter from "../../../../hooks/character/useCreateCharacter";
import { queryClient } from "../../../../config";
import { useNavigate } from "react-router-dom";
import Loader from "../../../../components/Loader";
import useCreateGuild from "../../../../hooks/guild/useCreateGuild";
import useUpdateOwnPlayer from "../../../../hooks/player/useUpdateOwnPlayer";
export default function GuildForm({ ...others }) {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const [checked, setChecked] = useState(true);
    const user = useStore((state) => state.session.user);

    const userId = user.id;
    const discordName = user.user_metadata.name;
    const { profile, characters, players, isLoading } = useUserInfo(
        userId,
        discordName
    );
    const activePlayer = players.find(
        (player) => player.id === profile[0].active_player_id
    );

    const { mutateAsync: createGuild } = useCreateGuild();
    const { mutateAsync: updatePlayer } = useUpdateOwnPlayer();

    const navigate = useNavigate();

    async function handleSubmit(
        values,
        { setErrors, setStatus, setSubmitting }
    ) {
        const { submit, ...rest } = values;

        const guildId = crypto.randomUUID();
        const newGuild = {
            ...rest,
            id: guildId,
            user_id: userId,
        };

        try {
            await createGuild(newGuild);
            await updatePlayer({
                ...activePlayer,
                guild_id: guildId,
            });
            navigate("/my-guilds/overview");

            if (scriptedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);
            }
        } catch (err) {
            console.error(err);
            if (scriptedRef.current) {
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
            }
        }
    }

    if (isLoading) return <Loader />;
    return (
        <Formik
            initialValues={{
                guild_name: "",
                faction: "",
                realm: "",
                region: "",
                submit: null,
            }}
            validationSchema={Yup.object().shape({
                guild_name: Yup.string()
                    .min(1)
                    .required("Guild name is required"),
                faction: Yup.string().required("Faction is required"),
                realm: Yup.string().required("Realm is required"),
                region: Yup.string().required("Region is required"),
            })}
            onSubmit={handleSubmit}
        >
            {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                touched,
                values,
            }) => (
                <form noValidate onSubmit={handleSubmit} {...others}>
                    <FormControl
                        fullWidth
                        error={Boolean(touched.guild_name && errors.guild_name)}
                        sx={{ ...theme.typography.customInput }}
                    >
                        <InputLabel htmlFor="outlined-adornment-character-name">
                            Guild&apos;s name
                        </InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-guild-name"
                            type="text"
                            value={values.guild_name}
                            name="guild_name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Guild's name"
                            inputProps={{}}
                        />
                        {touched.guild_name && errors.guild_name && (
                            <FormHelperText
                                error
                                id="standard-weight-helper-text-guild-name"
                            >
                                {errors.guild_name}
                            </FormHelperText>
                        )}
                    </FormControl>
                    <FormControl
                        fullWidth
                        error={Boolean(touched.faction && errors.faction)}
                        sx={{
                            ...theme.typography.customInput,
                        }}
                    >
                        <InputLabel htmlFor="outlined-adornment-faction-selection">
                            Faction
                        </InputLabel>

                        <Select
                            id="outlined-adornment-faction-selection"
                            value={values.faction}
                            name="faction"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Faction"
                            inputProps={{}}
                            sx={{ pt: 2 }}
                        >
                            {["Alliance", "Horde"].map((faction) => {
                                return (
                                    <MenuItem value={faction} key={faction}>
                                        {faction}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                        {touched.faction && errors.faction && (
                            <FormHelperText
                                error
                                id="standard-weight-helper-text-faction"
                            >
                                {errors.faction}
                            </FormHelperText>
                        )}
                    </FormControl>

                    <FormControl
                        fullWidth
                        error={Boolean(touched.realm && errors.realm)}
                        sx={{
                            ...theme.typography.customInput,
                        }}
                    >
                        <InputLabel htmlFor="outlined-adornment-realm">
                            Realm
                        </InputLabel>

                        <Select
                            id="outlined-adornment-realm"
                            value={values.realm}
                            name="realm"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Realm"
                            inputProps={{}}
                            sx={{ pt: 2 }}
                        >
                            {allSODRealms.map((realm) => {
                                return (
                                    <MenuItem value={realm.id} key={realm.id}>
                                        {realm.name}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                        {touched.realm && errors.realm && (
                            <FormHelperText
                                error
                                id="standard-weight-helper-text-realm"
                            >
                                {errors.realm}
                            </FormHelperText>
                        )}
                    </FormControl>

                    <FormControl
                        fullWidth
                        error={Boolean(touched.region && errors.region)}
                        sx={{
                            ...theme.typography.customInput,
                        }}
                    >
                        <InputLabel htmlFor="outlined-adornment-region">
                            Region
                        </InputLabel>

                        <Select
                            id="outlined-adornment-region"
                            value={values.region}
                            name="region"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Region"
                            inputProps={{}}
                            sx={{ pt: 2 }}
                        >
                            {[
                                { name: "EU", id: "eu" },
                                { name: "US", id: "us" },
                            ].map((region) => {
                                return (
                                    <MenuItem value={region.id} key={region.id}>
                                        {region.name}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                        {touched.region && errors.region && (
                            <FormHelperText
                                error
                                id="standard-weight-helper-text-region"
                            >
                                {errors.region}
                            </FormHelperText>
                        )}
                    </FormControl>

                    {/* <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={1}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checked}
                                    onChange={(event) =>
                                        setChecked(event.target.checked)
                                    }
                                    name="checked"
                                    color="primary"
                                />
                            }
                            label="Add to current guild"
                        />
                    </Stack> */}
                    {errors.submit && (
                        <Box sx={{ mt: 3 }}>
                            <FormHelperText error>
                                {errors.submit}
                            </FormHelperText>
                        </Box>
                    )}

                    <Box sx={{ mt: 2 }}>
                        <AnimateButton>
                            <Button
                                disableElevation
                                disabled={isSubmitting}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                color="secondary"
                            >
                                Submit
                            </Button>
                        </AnimateButton>
                    </Box>
                </form>
            )}
        </Formik>
    );
}
