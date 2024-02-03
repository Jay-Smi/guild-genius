import { Formik } from "formik";
import * as Yup from "yup";
import useScriptRef from "../../../hooks/useScriptRef";
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
import AnimateButton from "../../../components/extended/AnimateButton";
import { allClasses, allSpecs } from "../../../utils/wowHelpers";
import { useStore } from "../../../store";
import useUserInfo from "../../../hooks/useUserInfo";
import useGuild from "../../../hooks/useGuild";
import useCreateCharacter from "../../../hooks/character/useCreateCharacter";
import { queryClient } from "../../../config";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader";
function CharacterForm({ ...others }) {
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
    const activePlayer = players?.find(
        (player) => player.id === profile[0].active_player_id
    );

    const { guild, isLoadingGuild } = useGuild(activePlayer?.guild_id);

    const { mutate: createCharacter } = useCreateCharacter();
    const navigate = useNavigate();

    async function handleSubmit(
        values,
        { setErrors, setStatus, setSubmitting }
    ) {
        let gId = null;
        let rank = null;

        const activePlayerInGuild = !!activePlayer.guild_id;

        if (activePlayerInGuild && checked) {
            gId = activePlayer.guild_id;
            const guildToUse = guild.find(
                (g) => g.id === activePlayer.guild_id
            );

            const isGM = guildToUse.user_id === userId;

            if (isGM) {
                rank = 0;
            } else {
                rank = 15;
            }
        }

        const newCharacter = {
            character_name: values.character_name,
            class: values.class,
            spec: values.spec,
            player_id: activePlayer.id,
            guild_id: gId,
            discord_name: activePlayer.discord_name,
            guild_rank: rank,
        };

        try {
            await createCharacter(newCharacter);

            navigate("/my-characters/overview");
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

    if (isLoading || isLoadingGuild) return <Loader />;
    return (
        <Formik
            initialValues={{
                character_name: "",
                class: "",
                spec: "",
            }}
            validationSchema={Yup.object().shape({
                character_name: Yup.string()
                    .min(1)
                    .required("Character name is required"),
                class: Yup.string().required("Class is required"),
                spec: Yup.string().required("Spec is required"),
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
                        error={Boolean(
                            touched.character_name && errors.character_name
                        )}
                        sx={{ ...theme.typography.customInput }}
                    >
                        <InputLabel htmlFor="outlined-adornment-character-name">
                            Character&apos;s name
                        </InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-character-name"
                            type="text"
                            value={values.character_name}
                            name="character_name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Character's name"
                            inputProps={{}}
                        />
                        {touched.character_name && errors.character_name && (
                            <FormHelperText
                                error
                                id="standard-weight-helper-text-character-name"
                            >
                                {errors.character_name}
                            </FormHelperText>
                        )}
                    </FormControl>
                    <FormControl
                        fullWidth
                        error={Boolean(touched.class && errors.class)}
                        sx={{
                            ...theme.typography.customInput,
                        }}
                    >
                        <InputLabel htmlFor="outlined-adornment-class-selection">
                            Class
                        </InputLabel>

                        <Select
                            id="outlined-adornment-class-selection"
                            value={values.class}
                            name="class"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Class"
                            inputProps={{}}
                            sx={{ pt: 2 }}
                        >
                            {allClasses().map((wowClass) => {
                                return (
                                    <MenuItem value={wowClass} key={wowClass}>
                                        {wowClass}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                        {touched.class && errors.class && (
                            <FormHelperText
                                error
                                id="standard-weight-helper-text-class"
                            >
                                {errors.class}
                            </FormHelperText>
                        )}
                    </FormControl>

                    <FormControl
                        fullWidth
                        error={Boolean(touched.spec && errors.spec)}
                        sx={{
                            ...theme.typography.customInput,
                        }}
                    >
                        <InputLabel htmlFor="outlined-adornment-spec">
                            Spec
                        </InputLabel>

                        <Select
                            id="outlined-adornment-spec"
                            value={values.spec}
                            name="spec"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Spec"
                            inputProps={{}}
                            sx={{ pt: 2 }}
                        >
                            {allSpecs()[values.class]?.map((wowClass) => {
                                return (
                                    <MenuItem value={wowClass} key={wowClass}>
                                        {wowClass}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                        {touched.spec && errors.spec && (
                            <FormHelperText
                                error
                                id="standard-weight-helper-text-class"
                            >
                                {errors.spec}
                            </FormHelperText>
                        )}
                    </FormControl>
                    {/* <input
                        type="hidden"
                        name="player_id"
                        value={mainPlayer.id}
                    />
                    <input
                        type="hidden"
                        name="discord_name"
                        value={discordName}
                    />
                    <input type="hidden" name="guild_id" value={guild.id} />
                    <input type="hidden" name="guild_rank" value="member" /> */}
                    <Stack
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
                    </Stack>
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

export default CharacterForm;
