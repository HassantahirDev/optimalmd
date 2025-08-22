// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { loginUserApi, registerUserApi } from "../api/authApi";

// DTOs
export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
  city?: string;
}

export interface UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  dateOfBirth?: string | null;
  city?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponseDataDto {
  accessToken: string;
  user: UserResponseDto;
}

interface AuthState {
  user: UserResponseDto | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// ✅ Register thunk
export const registerUser = createAsyncThunk<
  AuthResponseDataDto,
  RegisterDto,
  { rejectValue: string }
>("api/auth/register", async (userData, thunkAPI) => {
  try {
    return await registerUserApi(userData);
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Registration failed"
    );
  }
});

// ✅ Login thunk
export const loginUser = createAsyncThunk<
  AuthResponseDataDto,
  { email: string; password: string },
  { rejectValue: string }
>("api/auth/login", async (credentials, thunkAPI) => {
  try {
    return await loginUserApi(credentials);
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Login failed"
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("authToken");
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<AuthResponseDataDto>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.accessToken;
          localStorage.setItem("authToken", action.payload.accessToken);
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<AuthResponseDataDto>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.accessToken;
          localStorage.setItem("authToken", action.payload.accessToken);
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
