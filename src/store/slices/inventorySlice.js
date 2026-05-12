import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getInventory = createAsyncThunk('inventory/get', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/inventory`, { withCredentials: true });
        return response.data.data || null;

    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to get inventory');
    }
});

const inventorySlice = createSlice({
    name: 'inventory',
    initialState: {
        inventory: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getInventory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getInventory.fulfilled, (state, action) => {
                state.loading = false;
                state.inventory = action.payload;
            })
            .addCase(getInventory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default inventorySlice.reducer;
