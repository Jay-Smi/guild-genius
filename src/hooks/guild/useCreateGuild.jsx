import { useMutation } from "@tanstack/react-query";
import supabase from "../../services/supabase";
import { queryClient } from "../../config";

export default function useCreateGuild() {
    return useMutation({
        mutationFn: (guild) => insertGuild(guild),
        onMutate: (guild) => {
            queryClient.setQueryData(["guild"], () => [guild]);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["guild"] });
        },
    });
}

async function insertGuild(guild) {
    const { data, error } = await supabase
        .from("guilds")
        .insert([guild])
        .select();
    if (error) console.error(error);
    return data;
}
