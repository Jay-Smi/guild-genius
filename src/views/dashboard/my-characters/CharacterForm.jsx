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
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    Stack,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AnimateButton from "../../../components/extended/AnimateButton";
import { allClasses, allSpecs } from "../../../utils/wowHelpers";
import { useStore } from "../../../store";
import useUserInfo from "../../../hooks/useUserInfo";
import useGuild from "../../../hooks/useGuild";
import useCreateCharacter from "../../../hooks/character/useCreateCharacter";
import { queryClient } from "../../../config";
import { useNavigate } from "react-router-dom";
function CharacterForm({ ...others }) {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const [checked, setChecked] = useState(true);
    const user = useStore((state) => state.session.user);

    const userId = user.id;
    const discordName = user.user_metadata.name;
    const { profile, characters, players } = useUserInfo(userId, discordName);
    const somePlayerisInGuild =
        players?.some((player) => player.guild_id !== null) || false;

    const { guild } = useGuild(players[0].guild_id, somePlayerisInGuild);
    const mainPlayer =
        players.find((player) => player.id === profile[0].main_player) ||
        players[0];
    const characterMutation = useCreateCharacter();
    const navigate = useNavigate();

    async function handleSubmit(
        values,
        { setErrors, setStatus, setSubmitting }
    ) {
        try {
            await characterMutation.mutateAsync(values);
            queryClient.invalidateQueries(["characters", discordName]);
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
    return (
        <Formik
            initialValues={{
                character_name: "",
                class: "",
                spec: "",
                player_id: mainPlayer.id,
                discord_name: discordName,
                guild_id: guild[0].id,
                guild_rank: "member",
                submit: null,
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
