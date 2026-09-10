import axios from "axios";
import { setUserData } from "../redux/userSlice";

const serverUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Centralized Axios instance with Bearer token interceptor
const API = axios.create({
    baseURL: serverUrl,
});

// Automatically attach token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getCurrentUser = async (dispatch) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return; // No token = not logged in, skip API call
        const result = await API.get("/api/user/currentuser");
        dispatch(setUserData(result.data));
    } catch (error) {
        // Token expired or invalid — clear it
        localStorage.removeItem("token");
        console.error("Get Current User Error:", error);
    }
};

export const generateNotes = async (payload) => {
    try {
        const result = await API.post(
            "/api/notes/generate-notes",
            payload,
            { timeout: 120000 }
        );
        return result.data;
    } catch (error) {
        console.error("Generate Notes API Error:", error?.response?.data || error.message);
        throw error;
    }
};

export const downloadPdf = async (result) => {
    try {
        const response = await API.post("/api/pdf/generate-pdf", { result }, {
            responseType: "blob"
        })

        const blob = new Blob([response.data], {
            type: "application/pdf"
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "NotesKaro.pdf";
        link.click();

        window.URL.revokeObjectURL(url);
    } catch (error) {
        throw new Error("PDF Download Failed");
    }
}

export default API;