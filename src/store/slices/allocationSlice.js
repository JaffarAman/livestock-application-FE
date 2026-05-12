// src/store/slices/allocationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const createAllocation = createAsyncThunk('allocation/create', async (allocationData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/create-allocation`, allocationData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create allocation');
    }
});

export const fetchAllAllocations = createAsyncThunk('allocation/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/get-all-allocations`, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch allocations');
    }
});

// Alias for convenience in Manager views
export const fetchAllocationsForBranch = fetchAllAllocations;

export const receiveAllocation = createAsyncThunk('allocation/receive', async (data, { rejectWithValue }) => {
    try {
        const { allocationId, quantity } = data;
        
        // Backend expects POST /receive/:allocationId with { receivedAnimals: number, status: "Received" }
        const response = await axios.post(`${API_URL}/receive/${allocationId}`, 
            { 
                receivedAnimals: quantity,
                status: "Received"
            }, 
            {
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to receive animals');
    }
});

const allocationSlice = createSlice({
    name: 'allocation',
    initialState: {
        loading: false,
        error: null,
        success: false,
        allAllocations: [],
        branchAllocations: [], // Keep this for backward compatibility with my recent refactor
    },
    reducers: {
        resetAllocationState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createAllocation.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createAllocation.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(createAllocation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllAllocations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllAllocations.fulfilled, (state, action) => {
                state.loading = false;
                state.allAllocations = action.payload;
                state.branchAllocations = action.payload; // Sync for now
            })
            .addCase(fetchAllAllocations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(receiveAllocation.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(receiveAllocation.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(receiveAllocation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetAllocationState } = allocationSlice.actions;
export default allocationSlice.reducer;
