import { createAsyncThunk } from "@reduxjs/toolkit";
import { APP_ROUTES } from "@src/hooks/navigation/routes";
import { supabase } from "@src/services/supabase/client";

interface SignUpCredentials {
    email: string;
    password: string;
}

export const signUp = createAsyncThunk(
    'auth/signUp',
    async ({ email, password }: SignUpCredentials, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/#/${APP_ROUTES.EMAIL_VERIFICATION}`
                },
            });

            if (error) {
                return rejectWithValue(error.message);
            }

            return {
                user: data.user,
                session: data.session,
            };
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : 'An unexpected error occurred'
            );
        }
    }
);