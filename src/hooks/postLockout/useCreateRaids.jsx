import { useMutation } from "@tanstack/react-query";
import supabase from "../../services/supabase";

export default function useCreateRaids() {
    const raidMutation = useMutation({
        mutationFn: (raids) => insertRaid(raids),
    });
    return raidMutation;
}

async function insertRaid(raidData) {
    const { data, error } = await supabase.from("raids").insert(raidData);
    if (error) {
        console.log(error);
    }
    return { data, error };
}
