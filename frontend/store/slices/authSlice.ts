import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api';
import { saveToken, removeToken, getPayload } from '@/lib/auth';
import type { Role } from '@/lib/types';

interface AuthState {
  token: string | null;
  email: string | null;
  role: Role | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  email: null,
  role: null,
  isLoading: false,
  error: null,
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await api.post<{ access_token: string }>(
        '/auth/login',
        credentials
      );
      saveToken(data.access_token);
      return data.access_token;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutAction(state) {
      state.token = null;
      state.email = null;
      state.role = null;
      removeToken();
    },
    restoreAuth(state) {
      const payload = getPayload();
      if (payload) {
        state.email = payload.email;
        state.role = payload.role;
        state.token = 'restored';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload;
        const payload = getPayload();
        state.email = payload?.email ?? null;
        state.role = payload?.role ?? null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logoutAction, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
