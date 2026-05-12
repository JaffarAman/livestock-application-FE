import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const createUser = createAsyncThunk('user/create', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/create-user`, userData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
});

export const fetchAllUsers = createAsyncThunk('user/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/all-users`, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
});

export const fetchBranchStaff = createAsyncThunk('user/fetchBranchStaff', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/branch-staff`, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch branch staff');
    }
});

// { id, data } — "data" matches ManagerStaff.jsx dispatch call
export const updateUser = createAsyncThunk('user/update', async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/update-user/${id}`, data, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
});

export const deleteUser = createAsyncThunk('user/delete', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${API_URL}/delete-user/${id}`, {
            withCredentials: true
        });
        return { id, message: response.data.message };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        loading: false,
        error: null,
        success: false,
        allUsers: [],
        branchStaff: [],
    },
    reducers: {
        resetUserState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createUser.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.allUsers = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchBranchStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBranchStaff.fulfilled, (state, action) => {
                state.loading = false;
                state.branchStaff = action.payload;
            })
            .addCase(fetchBranchStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateUser.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                // allUsers aur branchStaff dono se remove karo
                state.allUsers = state.allUsers.filter(user => user._id !== action.payload.id);
                state.branchStaff = state.branchStaff.filter(user => user._id !== action.payload.id);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;
