import supabase from "../supabase";

export async function getCharacters() {
    const { data: characters, error } = await supabase
        .from("characters")
        .select("*");
    if (error) {
        console.error(error);
        throw new Error("Characters could not be loaded.");
    }

    return characters;
}

export async function getCharactersTags() {
    const { data: characters, error } = await supabase.from("characters")
        .select(`
    id,
    characters_tags (
      tag_id
    )
  `);

    if (error) {
        console.error(error);
        throw new Error("Characters Tags could not be loaded.");
    }

    return characters;
}
