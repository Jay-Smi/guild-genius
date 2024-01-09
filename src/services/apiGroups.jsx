import supabase from "./supabase";

export async function getGroups() {
    const { data: groups, error } = await supabase.from("groups").select("*");
    if (error) {
        console.error(error);
        throw new Error("Groups could not be loaded.");
    }

    return groups;
}

export async function getGroupsCharacters() {
    const { data: groups, error } = await supabase.from("groups").select(`
    id,
    groups_characters (
      character_id
    )
  `);

    if (error) {
        console.error(error);
        throw new Error("Groups Characters could not be loaded.");
    }

    return groups;
}
