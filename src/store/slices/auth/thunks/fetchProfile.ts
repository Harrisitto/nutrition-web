import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@src/services/supabase/client";
import { colsTableUsers, tableUsers } from "@src/services/supabase/definitions";

export const fetchProfile = createAsyncThunk(
    'auth/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const { data: user, error: errUser } = await supabase.auth.getUser();

            if (errUser) {
                return rejectWithValue(errUser.message);
            }

            const { data: profile, error: errProfile } = await supabase
                .from(tableUsers)
                .select("*")
                .eq(colsTableUsers.userId, user.user.id)
                .single();

            if (errProfile) {
                return rejectWithValue(errProfile.message);
            }

            return {
                profile
            };
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : 'An unexpected error occurred'
            );
        }
    }
);