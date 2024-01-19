import { Grid } from "@mui/material";
import useGuild from "../../../hooks/useGuild";
import useUserInfo from "../../../hooks/useUserInfo";
import { useStore } from "../../../store";
import { gridSpacing } from "../../../store/constant";
import CharacterCard from "./CharacterCard";

function MyCharactersOverview() {
    const user = useStore((state) => state.session.user);
    const userId = user.id;
    const discordName = user.user_metadata.name;
    const { profile, characters, players, isLoading, error } = useUserInfo(
        userId,
        discordName
    );
    console.log(characters);

    return (
        <Grid container spacing={gridSpacing}>
            {characters?.map((character, i) => (
                <Grid item xs={12} md={6} lg={4} key={i}>
                    <CharacterCard
                        character={character}
                        isLoading={isLoading}
                    />
                </Grid>
            ))}
        </Grid>
        // <div>
        //     {characters?.map((character) => (
        //         <div key={character.id}>
        //             <p> Awesome custom character component!!!</p>
        //             <div>{character.character_name}</div>
        //         </div>
        //     ))}
        // </div>
    );
}

export default MyCharactersOverview;
