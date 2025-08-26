// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import appointmentSlice from "./slice/appointmentSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    appointment: appointmentSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
