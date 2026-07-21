import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@src/services/supabase/client";

interface SignInCredentials {
    email: string;
    token: string;
}

interface UserMetadata {
  isNutritionist: boolean;
  isClient: boolean;
}

export const signIn = createAsyncThunk(
    'auth/signIn',
    async ({ email, token }: SignInCredentials, { rejectWithValue }) => {
        try {
          const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'email'
            })

            if (error) {
              return rejectWithValue(error.message);
            }

          if (!data.user) {
            return rejectWithValue('User not found');
          }

          const { isClient } = data.user.user_metadata as UserMetadata;

          if (isClient) {
            return rejectWithValue('Client users are not allowed to sign in');
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
