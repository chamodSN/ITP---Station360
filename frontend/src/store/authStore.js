import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:4200/api/auth" : "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isCheckingAuth: true,
    isLoading: false,

    updateProfile: async (formData) => {
        try {
            const response = await axios.put(
                'http://localhost:4200/api/user/update-profile',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                }
            );

            if (response.data.success) {
                set({ user: response.data.user });
                return response.data;
            }
            throw new Error(response.data.message || 'Update failed');
        } catch (error) {
            throw error;
        }
    },

    setUser: (userData) => {
        set(state => ({
            ...state,
            user: userData
        }));
    },

    signup: async (email, password, name) => {
        set({ error: null });
        try {
            const response = await axios.post(`${API_URL}/signup`, { email, password, name });
            set({ user: response.data.user, isAuthenticated: true });
        } catch (error) {
            set({ error: error.response.data.message || "Error signing up" });
            throw error;
        }
    },
    login: async (email, password) => {
        set({ error: null });
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            set({
                isAuthenticated: true,
                user: response.data.user,
                error: null,
            });
            console.log("Login response:", response.data);
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || "Error logging in" });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${API_URL}/logout`);
            set({ user: null, isAuthenticated: false, error: null, isLoading: false });
        } catch (error) {
            set({ error: "Error logging out", isLoading: false });
            throw error;
        }
    },
    verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/verify-email`, { code });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
            return response.data;
        } catch (error) {
            set({ error: error.response.data.message || "Error verifying email", isLoading: false });
            throw error;
        }
    },
    checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/check-auth`);
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
	},
    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, { email });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: error.response.data.message || "Error sending reset password email",
            });
            throw error;
        }
    },
    resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: error.response.data.message || "Error resetting password",
            });
            throw error;
        }
    },
    deleteProfile: async () => {
        try {
            const response = await axios.delete(
                'http://localhost:4200/api/user/delete-profile',
                { withCredentials: true }
            );

            if (response.data.success) {
                set({
                    user: null,
                    isAuthenticated: false,
                    error: null
                });
                return response.data;
            }
            throw new Error(response.data.message || 'Delete failed');
        } catch (error) {
            throw error;
        }
    },
}));