import { useNotification } from "@src/store/slices/notification/hook";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useLanguageCode } from "@src/hooks/helpers/language";
import type { SupportedLanguage } from "@src/services/i18n/config";
import type { ViewInsert } from "@src/services/supabase/database";
import { supabase } from "@src/services/supabase/client";
import { queryKeys } from "../keys";
import { queryClient } from "../queryClient";
import { useGetAuthInfo, useGetAuthSession } from "./get";


export const useInsertAuthInfo = () => {
  const { addMutationError } = useNotification();
  const { data } = useGetAuthSession()
  const userId = data?.userId;

  const mutation = useMutation({
    // id defaults to auth.uid() in nutri_profile, so only the name is sent
    mutationFn: async ({ name }: Pick<ViewInsert<"nutri_profile">, "name">) => {
      if (!userId) throw new Error('No authenticated user found')
      // upsert doesn't work on a view with INSTEAD OF triggers: insert or update depending on the row
      const { data: existing, error: existingError } = await supabase
        .from("nutri_profile")
        .select("id")
        .maybeSingle()
      if (existingError) throw existingError

      const { data, error } = existing
        ? await supabase
            .from("nutri_profile")
            .update({ name })
            .eq("id", existing.id)
            .select()
            .single()
        : await supabase
            .from("nutri_profile")
            .insert({ name })
            .select()
            .single()
      if (error) throw error
      return data
    },
    onError: () => {
      addMutationError();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys().auth.profile, () => data)
    },
  })
  return mutation
}

/**
 * Guarda el idioma de la web en nutri_profile.language_code: la base lo usa para buscar y devolver
 * nombres (scored_search_recipe_types_for_client). Se sincroniza al cambiar de idioma y tambien al
 * entrar, por si el idioma detectado del navegador no es el guardado.
 */
export const useSyncProfileLanguage = () => {
  const langCode = useLanguageCode();
  const { data: profile } = useGetAuthInfo();
  const { addMutationError } = useNotification();
  // Un intento por idioma: si falla no se reintenta en bucle
  const attempted = useRef<SupportedLanguage | null>(null);

  const { mutate } = useMutation({
    mutationFn: async ({ id, language_code }: { id: string; language_code: SupportedLanguage }) => {
      const { data, error } = await supabase
        .from("nutri_profile")
        .update({ language_code })
        .eq("id", id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onError: () => {
      addMutationError();
    },
    onSuccess: (data) => {
      // El perfil nuevo cambia la key de los tipos de receta (useFetchRecipeTypes) y se vuelven a pedir
      queryClient.setQueryData(queryKeys().auth.profile, () => data)
    },
  })

  useEffect(() => {
    if (!profile || profile.language_code === langCode || attempted.current === langCode) return
    attempted.current = langCode
    mutate({ id: profile.id, language_code: langCode })
  }, [profile, langCode, mutate])
}

export const useVerifyAuth = ({
  email,
}: { email: string }) => {
  const { addMutationError } = useNotification();

  const mutation = useMutation({
    mutationKey: queryKeys().auth.session,
    mutationFn: async ({ token }: { token: string }) => {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      })
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      // The auth listener also publishes this, but seeding it synchronously
      // means anything reading the session right after `mutate` resolves (the
      // sign-up page refetches the profile there) already sees the new user.
      queryClient.setQueryData(queryKeys().auth.session, {
        session: data.session,
        user: data.user,
        userId: data.session?.user?.id,
      })
      queryClient.invalidateQueries({ queryKey: queryKeys().auth.profileBase })
      queryClient.invalidateQueries({ queryKey: queryKeys().auth.subscriptionBase })
    },
    onError: () => {
      addMutationError();
    },
  })
  return mutation
}

export const useSignOut = () => {
  const { addMutationError } = useNotification();

  const mutation = useMutation({
    mutationKey: queryKeys().auth.session,
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    onError: () => {
      addMutationError();
    },
    onSuccess: () => {
      queryClient.setQueryData(queryKeys().auth.session, {
        session: null,
        user: null,
        userId: undefined,
      })
      queryClient.setQueryData(queryKeys().auth.profile, null)
      // Subscription state is keyed by user id, so it survives a sign out and
      // would be handed to whoever signs in next on this browser.
      queryClient.removeQueries({ queryKey: queryKeys().auth.subscriptionBase })
    },
  })
  return mutation
}
