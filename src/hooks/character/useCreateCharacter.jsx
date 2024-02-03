import { useMutation } from "@tanstack/react-query";
import supabase from "../../services/supabase";
import { queryClient } from "../../config";

export default function useCreateCharacter() {
    return useMutation({
        mutationFn: (character) => insertCharacter(character),
        onMutate: (character) => {
            queryClient.setQueryData(["user-characters"], (old) => [
                ...old,
                character,
            ]);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["user-characters"] });
        },
    });
}

async function insertCharacter(character) {
    const { data, error } = await supabase
        .from("characters")
        .insert([character]);
    return { data, error };
}
