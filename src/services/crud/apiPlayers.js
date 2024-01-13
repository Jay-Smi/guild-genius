import supabase from "../supabase";

export async function getPlayers() {
    const { data: players, error } = await supabase.from("players").select("*");
    if (error) {
        console.error(error);
        throw new Error("Players could not be loaded.");
    }

    return players;
}

export async function getPlayersCharacters() {
    const { data: players, error } = await supabase.from("players").select(`
    id,
    players_characters (
      character_id
    )
  `);

    if (error) {
        console.error(error);
        throw new Error("Players Characters could not be loaded.");
    }

    return players;
}
