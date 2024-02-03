import { useMutation } from "@tanstack/react-query";
import supabase from "../../services/supabase";
import { queryClient } from "../../config";

export default function useUpdateProfile() {
    return useMutation({
        mutationFn: (newProfile) => updateProfile(newProfile),
        onMutate: (newProfile) => {
            queryClient.setQueryData(["profile"], () => [newProfile]);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
}

async function updateProfile(newProfile) {
    const { data, error } = await supabase
        .from("profiles")
        .update(newProfile)
        .eq("id", newProfile.id);

    if (error) console.error(error);
    return data;
}
