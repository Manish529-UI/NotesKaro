import axios from "axios";
import { serverUrl } from '../App';
import { setUserData } from "../redux/userSlice";


export const getCurrentUser = async (dispatch) => {
    try {
        const result = await axios.get(serverUrl + "/api/user/currentuser", { withCredentials: true }); 
        dispatch(setUserData(result.data));
    } catch (error) {
        console.error("Get Current User Error:", error);
    }
};

export const generateNotes = async (payload) => {
    try {
        // ⚡ Timeout 120 seconds (2 mins) kar diya hai
        const result = await axios.post(
            serverUrl + "/api/notes/generate-notes", 
            payload, 
            { 
                withCredentials: true,
                timeout: 120000 
            }
        );
        return result.data;

    } catch (error) {
        console.error("Generate Notes API Error:", error?.response?.data || error.message);
        throw error;
    }
}; 

export const downloadPdf = async (result) => {
    try {
        const response = await axios.post(serverUrl + "/api/pdf/generate-pdf", {result}, {
            responseType: "blob", withCredentials: true
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