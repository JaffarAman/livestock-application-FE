import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/auth`, credentials, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
});

export const forgetPassword = createAsyncThunk('auth/forgetPassword', async ({ email }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/forgetPassword`, { email });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ email, otp }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/verifyOtp/${email}`, { otp });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Invalid OTP');
    }
});

export const changePassword = createAsyncThunk('auth/changePassword', async ({ email, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/changePassword/${email}`, { newPassword, confirmPassword });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/logout`, {}, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        role: localStorage.getItem('role') || null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.role = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('role');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.role = action.payload.role;
                localStorage.setItem('user', JSON.stringify(action.payload.user));
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('role', action.payload.role);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(forgetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgetPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(forgetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.role = null;
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                localStorage.removeItem('role');
            })
            .addCase(logoutUser.rejected, (state) => {
                // Hamesha logout karo, bhale hi backend fail ho jaye (e.g. user delete ho chuka ho)
                state.user = null;
                state.token = null;
                state.role = null;
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                localStorage.removeItem('role');
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;