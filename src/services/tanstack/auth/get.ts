import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "../keys"
import { supabase } from "@src/services/supabase/client"
import { TABLE_ALL_NUTRITIONISTS } from "@src/services/supabase/definitions"

export const useGetAuthInfo = () => {

  const { data } = useGetAuthSession();
  const userId = data?.session?.user?.id

  const query = useQuery({
    queryKey: queryKeys().auth.profile,
    queryFn: async () => {
      if(!userId) return null
      const { data, error } = await supabase
        .from(TABLE_ALL_NUTRITIONISTS.NAME)
        .select()
        .eq(TABLE_ALL_NUTRITIONISTS.COLS.USER_ID, userId)
        .maybeSingle()
      if (error) throw error
      return data
    },
  })

  return query
}

export const useGetAuthSession = () => {
  const query = useQuery({
    queryKey: queryKeys().auth.session,
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return {
        ...data,
        userId: data.session?.user?.id
      }
    },
  })

  return query
}
