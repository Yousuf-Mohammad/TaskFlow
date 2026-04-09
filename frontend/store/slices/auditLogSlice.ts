import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api';
import type { AuditLog } from '@/lib/types';

interface AuditLogState {
  items: AuditLog[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AuditLogState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchAuditLogs = createAsyncThunk(
  'auditLogs/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await api.get<AuditLog[]>('/audit-logs');
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch audit logs');
    }
  }
);

const auditLogSlice = createSlice({
  name: 'auditLogs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default auditLogSlice.reducer;
