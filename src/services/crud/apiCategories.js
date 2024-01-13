import supabase from "../supabase";

export async function getCategories() {
    const { data: categories, error } = await supabase
        .from("categories")
        .select("*");
    if (error) {
        console.error(error);
        throw new Error("Categories could not be loaded.");
    }

    return categories;
}

export async function getCategoriesCharacters() {
    const { data: categories, error } = await supabase.from("categories")
        .select(`
    id,
    categories_characters (
      character_id
    )
  `);

    if (error) {
        console.error(error);
        throw new Error("Category Characters could not be loaded.");
    }

    return categories;
}

export async function moveCharacterBetweenCategories(
    characterId,
    categoryId,
    lockoutId
) {
    const { data, error } = await supabase
        .from("categories_characters")
        .update({ category_id: categoryId })
        .eq("character_id", characterId)
        .eq("lockout_id", lockoutId);

    if (error) {
        console.error(error);
        throw new Error("Character could not be moved.");
    }

    return data;
}
