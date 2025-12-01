// Submissions slice
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchSubmissions = createAsyncThunk('submissions/fetch', async () => {
  const response = await api.get('/submissions/my');
  return response.data;
});

const submissionsSlice = createSlice({
  name: 'submissions',
  initialState: { list: [], loading: false },
  extraReducers: (builder) => {
    builder.addCase(fetchSubmissions.fulfilled, (state, action) => {
      state.list = action.payload;
      state.loading = false;
    });
  },
});

export default submissionsSlice.reducer;