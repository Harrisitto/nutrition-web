import { supabase } from "@src/services/supabase/client"
import { tableUsers } from "@src/services/supabase/definitions"
import { useQuery } from "@tanstack/react-query"


export const useFetchSingleUser = () => {

    return useQuery({
        queryKey: ["user", "single"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from(tableUsers)
                .select("*")
                .single()
            if (error) {
                return []
            }
            return data
        }  
    })
}