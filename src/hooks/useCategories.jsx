import { useQuery } from "@tanstack/react-query";
import {
    getCategories,
    getCategoriesCharacters,
} from "../services/apiCategories";

export default function useCategories() {
    const {
        data: categoriesCharacters,
        isLoading: isLoadingCategoriesCharacters,
        error: isErrorCategoriesCharacters,
    } = useQuery({
        queryKey: ["categories_characters"],
        queryFn: getCategoriesCharacters,
        staleTime: Infinity,
        select: (data) => {
            return data.map((category) => {
                return {
                    categoryId: category.id,
                    categoryCharacters: category.categories_characters.map(
                        (character) => character.character_id
                    ),
                };
            });
        },
    });

    const {
        data: categories,
        isLoading,
        error: isCategoriesError,
    } = useQuery({
        queryKey: ["categories"],

        queryFn: getCategories,
        staleTime: Infinity,
        enabled: !isLoadingCategoriesCharacters,
        select: (data) => {
            const updatedCategories = data.map((category) => {
                const categoryCharacters = categoriesCharacters.find(
                    (categoryCharacter) =>
                        categoryCharacter.categoryId === category.id
                );

                return {
                    ...category,
                    data: categoryCharacters.categoryCharacters,
                };
            });

            return updatedCategories;
        },
    });

    return {
        categories,
        isLoading: isLoading || isLoadingCategoriesCharacters,
        error: isCategoriesError || isErrorCategoriesCharacters,
    };
}
