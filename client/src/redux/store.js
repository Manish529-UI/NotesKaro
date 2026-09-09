import { configureStore } from '@reduxjs/toolkit';
import userSlice from "./userSlice.js"

// 🔥 Documentation ke hisab se 'export default' use karenge
export default configureStore({
  reducer: {
    user:userSlice
  },
});