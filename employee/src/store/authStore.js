import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:4200/api/admin/employee" : "/api/admin/employee";

axios.defaults.withCredentials = true;

export const useEmployeeAuthStore = create((set, get) => ({
    employee: null,
    isAuthenticated: false,
    error: null,
    isCheckingAuth: true,
    isLoading: false,

    login: async (email, password) => {
        set({ error: null, isCheckingAuth: true });
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            set({
                isAuthenticated: true,
                employee: response.data.employee,
                error: null,
                isCheckingAuth: false
            });
            console.log("Login response:", response.data);
            return response.data;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error logging in",
                isCheckingAuth: false 
            });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${API_URL}/logout`);
            set({ 
                employee: null, 
                isAuthenticated: false, 
                error: null, 
                isLoading: false, 
                isCheckingAuth: false 
            });
        } catch (error) {
            set({ 
                error: "Error logging out", 
                isLoading: false, 
                isCheckingAuth: false 
            });
            throw error;
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            if (response.data.success) {
                set({ 
                    employee: response.data.employee, 
                    isAuthenticated: true, 
                    isCheckingAuth: false,
                    error: null
                });
            } else {
                set({ 
                    employee: null,
                    isAuthenticated: false, 
                    isCheckingAuth: false,
                    error: response.data.message
                });
            }
        } catch (error) {
            console.error("Auth check error:", error);
            set({ 
                employee: null,
                isAuthenticated: false, 
                isCheckingAuth: false,
                error: error.response?.data?.message || "Authentication failed"
            });
        }
    },
}));