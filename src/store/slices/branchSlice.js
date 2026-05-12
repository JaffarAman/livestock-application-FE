import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const createBranch = createAsyncThunk('branch/create', async (branchData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/branch-create`, branchData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create branch');
    }
});

export const fetchBranches = createAsyncThunk('branch/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/branch-get`, {
            withCredentials: true
        });
        return response.data.branches;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch branches');
    }
});

export const updateBranch = createAsyncThunk('branch/update', async ({ id, branchData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/branch-update/${id}`, branchData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update branch');
    }
});

export const deleteBranch = createAsyncThunk('branch/delete', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${API_URL}/branch-delete/${id}`, {
            withCredentials: true
        });
        return { id, message: response.data.message };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete branch');
    }
});

export const fetchBranchCapacity = createAsyncThunk('branch/fetchCapacity', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/branch-capacity`, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch branch capacity');
    }
});

export const fetchBranchDetail = createAsyncThunk('branch/fetchDetail', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/branch-detail/${id}`, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch branch detail');
    }
});

const branchSlice = createSlice({
    name: 'branch',
    initialState: {
        loading: false,
        error: null,
        success: false,
        branches: [],
        capacities: [],
        branchDetail: null,
    },
    reducers: {
        resetBranchState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.branchDetail = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createBranch.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createBranch.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(createBranch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchBranches.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBranches.fulfilled, (state, action) => {
                state.loading = false;
                state.branches = action.payload;
            })
            .addCase(fetchBranches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateBranch.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateBranch.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(updateBranch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteBranch.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deleteBranch.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.branches = state.branches.filter(branch => branch._id !== action.payload.id);
            })
            .addCase(deleteBranch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchBranchCapacity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBranchCapacity.fulfilled, (state, action) => {
                state.loading = false;
                state.capacities = action.payload;
            })
            .addCase(fetchBranchCapacity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchBranchDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBranchDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.branchDetail = action.payload;
            })
            .addCase(fetchBranchDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetBranchState } = branchSlice.actions;
export default branchSlice.reducer;
