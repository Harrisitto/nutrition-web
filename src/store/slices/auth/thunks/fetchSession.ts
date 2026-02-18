import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@src/services/supabase/client";

export const fetchSession = createAsyncThunk(
    'auth/fetchSession',
    async (_, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                return rejectWithValue(error.message);
            }

            return {
                user: data.session?.user || null,
                session: data.session || null,
            };
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : 'An unexpected error occurred'
            );
        }
    }
);