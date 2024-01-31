import { queryClient } from "../../config";
import { useMutation } from "@tanstack/react-query";
import supabase from "../../services/supabase";

export default function useUpdateGuildCharacter() {
    return useMutation({
        mutationFn: (character) => updateCharacter(character),
        onMutate: (newCharacter) => {
            queryClient.setQueryData(["guild-characters"], (oldData) => {
                const newCharacters = oldData.map((character) =>
                    character.id === newCharacter.id ? newCharacter : character
                );
                return newCharacters;
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["guild-characters"] });
        },
    });
}

async function updateCharacter(character) {
    console.log("character", character);
    const { data, error } = await supabase
        .from("characters")
        .update(character)
        .eq("id", character.id);
}
//TABLE CHARACTER
//player_name
//character_name
//class
//spec
//guild_rank
//discord_name
//tags
//character_id
//player_id
//guild_id
//profile_id

//CHARACTER
//id
//character_name
//discord_name XXXXX
//class
//spec
//player_id XXXXX
//guild_id XXXXX
//guild_rank

//PLAYER
//id XXXXX
//player_name
//profile_id
//discord_name XXXXX
//guild_id XXXXX
