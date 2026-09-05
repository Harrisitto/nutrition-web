import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "../keys"
import { supabase } from "@src/services/supabase/client"
import { TABLE_ALL_NUTRITIONISTS } from "@src/services/supabase/definitions"
import { queryClient } from "../queryClient"
import { useEffect } from "react"
import type { Session } from "@supabase/supabase-js"

export type AuthSession = {
  session: Session | null
  user: Session["user"] | null
  userId: string | undefined
}

const toAuthSession = (session: Session | null): AuthSession => ({
  session,
  user: session?.user ?? null,
  userId: session?.user?.id,
})

/**
 * Supabase owns the auth state (OTP sign in, token refresh, sign out, other
 * tabs). Without this bridge the cached session query keeps whatever was true
 * when the app booted, so signing in never propagates to the queries that read
 * `userId` from it. Registered once per page load, guarded because StrictMode
 * mounts every effect twice.
 */
let authListenerStarted = false

const startAuthListener = () => {
  if (authListenerStarted) return
  authListenerStarted = true

  supabase.auth.onAuthStateChange((event, session) => {
    queryClient.setQueryData(queryKeys().auth.session, toAuthSession(session))

    // TOKEN_REFRESHED / INITIAL_SESSION keep the same user, so only the events
    // that can change *who* is signed in invalidate the per-user caches.
    if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
      queryClient.invalidateQueries({ queryKey: queryKeys().auth.profileBase })
      queryClient.invalidateQueries({ queryKey: queryKeys().auth.subscriptionBase })
    }
  })
}

export const useGetAuthInfo = () => {

  const { data: session } = useGetAuthSession();

  const query = useQuery({
    queryKey: queryKeys().auth.profile,
    queryFn: async () => {
      // Resolved here rather than captured from the render closure: right after
      // verifying the OTP this query is refetched before React has re-rendered
      // with the new session, so a captured `userId` would still be undefined.
      const { data: current } = await supabase.auth.getSession()
      const userId = current.session?.user?.id
      if(!userId) return null
      const { data, error } = await supabase
        .from(TABLE_ALL_NUTRITIONISTS.NAME)
        .select()
        .eq(TABLE_ALL_NUTRITIONISTS.COLS.USER_ID, userId)
        .maybeSingle()
      if (error) throw error
      return data
    },
    enabled: !!session,
  })

  return query
}

export const useGetAuthSession = () => {
  useEffect(startAuthListener, [])

  const query = useQuery({
    queryKey: queryKeys().auth.session,
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return toAuthSession(data.session)
    },
  })

  return query
}
