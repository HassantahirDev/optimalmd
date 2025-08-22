// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { loginUserApi, registerUserApi, resendVerificationApi } from "../api/authApi";

// DTOs
export interface RegisterDto {
  // Mandatory Fields (Green in image)
  medicalRecordNo: string;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  completeAddress: string;
  city: string;
  state: string;
  zipcode: string;
  primaryEmail: string;
  alternativeEmail: string;
  primaryPhone: string;
  alternativePhone: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  referringSource: string;
  consentForTreatment: string;
  hipaaPrivacyNoticeAcknowledgment: string;
  releaseOfMedicalRecordsConsent: string;
  preferredMethodOfCommunication: string;
  disabilityAccessibilityNeeds: string;
  
  // Optional Fields (Yellow in image)
  careProviderPhone?: string;
  lastFourDigitsSSN?: string;
  languagePreference?: string;
  ethnicityRace?: string;
  primaryCarePhysician?: string;
  insuranceProviderName?: string;
  insurancePolicyNumber?: string;
  insuranceGroupNumber?: string;
  insurancePhoneNumber?: string;
  guarantorResponsibleParty?: string;
  dateOfFirstVisitPlanned?: string;
  interpreterRequired?: string;
  advanceDirectives?: string;
  
  // Authentication fields
  password: string;
}

export interface UserResponseDto {
  id: string;
  medicalRecordNo: string;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  completeAddress: string;
  city: string;
  state: string;
  zipcode: string;
  primaryEmail: string;
  alternativeEmail: string;
  primaryPhone: string;
  alternativePhone: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  referringSource: string;
  consentForTreatment: string;
  hipaaPrivacyNoticeAcknowledgment: string;
  releaseOfMedicalRecordsConsent: string;
  preferredMethodOfCommunication: string;
  disabilityAccessibilityNeeds: string;
  careProviderPhone?: string | null;
  lastFourDigitsSSN?: string | null;
  languagePreference?: string | null;
  ethnicityRace?: string | null;
  primaryCarePhysician?: string | null;
  insuranceProviderName?: string | null;
  insurancePolicyNumber?: string | null;
  insuranceGroupNumber?: string | null;
  insurancePhoneNumber?: string | null;
  guarantorResponsibleParty?: string | null;
  dateOfRegistration: string;
  dateOfFirstVisitPlanned?: string | null;
  interpreterRequired?: string | null;
  advanceDirectives?: string | null;
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
  { primaryEmail: string; password: string },
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

// ✅ Resend Verification thunk
export const resendVerification = createAsyncThunk<
  { message: string; primaryEmail: string },
  string,
  { rejectValue: string }
>("api/auth/resend-verification", async (primaryEmail, thunkAPI) => {
  try {
    return await resendVerificationApi(primaryEmail);
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Failed to resend verification email"
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
        state.error = action.payload || "Registration failed";
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
        state.error = action.payload || "Login failed";
      })
      // Resend Verification
      .addCase(resendVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendVerification.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to resend verification email";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
