// src/store/slices/reportSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchReportData = createAsyncThunk('report/fetchData', async (params, { rejectWithValue }) => {
    try {
        const { type, range, startDate, endDate, branch } = params;
        const response = await axios.get(`${API_URL}/reports/${type}`, {
            params: { range, startDate, endDate, branch },
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch report data');
    }
});

const reportSlice = createSlice({
    name: 'report',
    initialState: {
        reportData: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearReportData: (state) => {
            state.reportData = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReportData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReportData.fulfilled, (state, action) => {
                state.loading = false;
                state.reportData = action.payload;
            })
            .addCase(fetchReportData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearReportData } = reportSlice.actions;
export default reportSlice.reducer;
