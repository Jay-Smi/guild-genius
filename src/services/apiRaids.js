import supabase from "./supabase";

export async function getRaids() {
    const { data: characters, error } = await supabase
        .from("raids")
        .select("*");
    if (error) {
        console.error(error);
        throw new Error("Raids could not be loaded.");
    }

    return characters;
}

export async function getRaidsGroups() {
    const { data: raids, error } = await supabase.from("raids").select(`
    id,
    raids_groups (
      group_id
    )
  `);

    if (error) {
        console.error(error);
        throw new Error("Raids Groups could not be loaded.");
    }

    return raids;
}
