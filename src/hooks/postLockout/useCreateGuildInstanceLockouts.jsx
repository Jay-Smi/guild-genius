import { useMutation } from "@tanstack/react-query";
import supabase from "../../services/supabase";

export default function useCreateGuildInstanceLockouts() {
    const mutation = useMutation({
        mutationFn: (lockouts) => insertLockouts(lockouts),
    });
    return mutation;
}

async function insertLockouts(lockoutData) {
    const { data, error } = await supabase
        .from("guild_instance_lockouts")
        .insert(lockoutData);
    if (error) {
        console.log(error);
    }
    return { data, error };
}
