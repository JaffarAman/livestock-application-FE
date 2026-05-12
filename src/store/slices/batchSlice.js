import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const createBatch = createAsyncThunk('batch/create', async (batchData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/create-Batch`, batchData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        const responseData = error.response?.data;
        const validationErrors = responseData?.errors;
        if (Array.isArray(validationErrors) && validationErrors.length > 0) {
            return rejectWithValue(validationErrors.map((item) => item.message).join(', '));
        }
        return rejectWithValue(responseData?.message || 'Failed to create batch');
    }
});

export const fetchBatchCategories = createAsyncThunk('batch/fetchCategories', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/batch-categories`, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
});

export const fetchBatches = createAsyncThunk('batch/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/get-all-batches`, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch batches');
    }
});

const batchSlice = createSlice({
    name: 'batch',
    initialState: {
        loading: false,
        error: null,
        success: false,
        categories: [],
        allBatches: [],
    },
    reducers: {
        resetBatchState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createBatch.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createBatch.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(createBatch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchBatchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBatchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchBatchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchBatches.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBatches.fulfilled, (state, action) => {
                state.loading = false;
                state.allBatches = action.payload;
            })
            .addCase(fetchBatches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetBatchState } = batchSlice.actions;
export default batchSlice.reducer;
