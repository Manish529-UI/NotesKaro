import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user', 
    initialState: {
        userData: null
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        // ✅ Ye new reducer add karein credits update karne ke liye
        updateCredits: (state, action) => {
            if (state.userData) {
                state.userData.credits = action.payload;
            }
        }
    }
});

// ✅ updateCredits ko bhi export karein
export const { setUserData, updateCredits } = userSlice.actions;
export default userSlice.reducer;