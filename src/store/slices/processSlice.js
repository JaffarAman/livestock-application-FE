import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const createProcessing = createAsyncThunk('process/create', async ({ slaughterId, data }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/createProcessing/${slaughterId}`, data, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create processing');
    }
});

export const getAllProcesses = createAsyncThunk('process/getAll', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/getAllProcesses`, { withCredentials: true });
        return response.data.data || response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to get processes');
    }
});

// ✅ Update
export const updateProcess = createAsyncThunk('process/update', async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/updateProcess/${id}`, data, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update processing');
    }
});

// ✅ Delete
export const deleteProcess = createAsyncThunk('process/delete', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/deleteProcess/${id}`, { withCredentials: true });
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete processing');
    }
});

const processSlice = createSlice({
    name: 'process',
    initialState: {
        processes: [],
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetProcessState: (state) => {
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProcessing.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
            .addCase(createProcessing.fulfilled, (state) => { state.loading = false; state.success = true; })
            .addCase(createProcessing.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(getAllProcesses.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getAllProcesses.fulfilled, (state, action) => { state.loading = false; state.processes = action.payload; })
            .addCase(getAllProcesses.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(updateProcess.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
            .addCase(updateProcess.fulfilled, (state) => { state.loading = false; state.success = true; })
            .addCase(updateProcess.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(deleteProcess.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteProcess.fulfilled, (state, action) => {
                state.loading = false;
                state.processes = state.processes.filter(p => p._id !== action.payload);
            })
            .addCase(deleteProcess.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    }
});

export const { resetProcessState } = processSlice.actions;
export default processSlice.reducer;