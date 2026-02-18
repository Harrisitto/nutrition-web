import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@src/services/supabase/client";

interface SignInCredentials {
    email: string;
    password: string;
}

export const signIn = createAsyncThunk(
    'auth/signIn',
    async ({ email, password }: SignInCredentials, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
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
