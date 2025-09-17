// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { clearAuthData } from "@/lib/utils";
import { registerUserApi, loginUserApi, resendVerificationApi } from "../api/authApi";

// DTOs
export interface RegisterDto {
  // Mandatory Fields (Green in image)
  title?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  completeAddress: string;
  city: string;
  state: string;
  zipcode: string;
  primaryEmail: string;
  alternativeEmail?: string;
  primaryPhone: string;
  alternativePhone?: string;
  emergencyContactName: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone: string;
  referringSource: string;
  consentForTreatment: string;
  hipaaPrivacyNoticeAcknowledgment: string;
  releaseOfMedicalRecordsConsent: string;
  preferredMethodOfCommunication: string;
  disabilityAccessibilityNeeds?: string;
  
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
  title?: string | null;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  profilePicture: string | null;
  dateOfBirth: string;
  gender: string;
  completeAddress: string;
  city: string;
  state: string;
  zipcode: string;
  primaryEmail: string;
  alternativeEmail?: string | null;
  primaryPhone: string;
  alternativePhone?: string | null;
  emergencyContactName: string;
  emergencyContactRelationship?: string | null;
  emergencyContactPhone: string;
  referringSource: string;
  consentForTreatment: string;
  hipaaPrivacyNoticeAcknowledgment: string;
  releaseOfMedicalRecordsConsent: string;
  preferredMethodOfCommunication: string;
  disabilityAccessibilityNeeds?: string;
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

export interface DoctorResponseDto {
  id: string;
  email: string;
  title: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  profilePicture: string | null;
  completeAddress: string;
  city: string;
  state: string;
  zipcode: string;
  alternativeEmail: string | null;
  primaryPhone: string;
  alternativePhone: string | null;
  licenseNumber: string;
  specialization: string;
  qualifications: string[];
  experience: number;
  bio: string | null;
  isAvailable: boolean;
  consultationFee: string;
  workingHours: any;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponseDataDto {
  accessToken: string;
  user: UserResponseDto | DoctorResponseDto;
  userType: 'user' | 'doctor';
}

interface AuthState {
  user: UserResponseDto | DoctorResponseDto | null;
  token: string | null;
  userType: 'user' | 'doctor' | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  userType: null,
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
    // Debug: Log the actual error structure from the API
    console.log('API Error Response:', err);
    console.log('Error Response Data:', err?.response?.data);
    
    // Better error message extraction
    let errorMessage = "Registration failed";
    
    // Handle different error response structures
    if (err?.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err?.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err?.response?.data?.data?.message) {
      errorMessage = err.response.data.data.message;
    } else if (err?.response?.data?.data?.error) {
      errorMessage = err.response.data.data.error;
    } else if (err?.response?.data?.validationErrors) {
      // Handle validation errors array
      const validationErrors = err.response.data.validationErrors;
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        errorMessage = validationErrors.map((err: any) => err.message || err).join(', ');
      }
    } else if (err?.response?.data?.errors) {
      // Handle errors object
      const errors = err.response.data.errors;
      if (typeof errors === 'object') {
        errorMessage = Object.values(errors).join(', ');
      }
    } else if (err?.message) {
      errorMessage = err.message;
    }
    
    // Handle specific HTTP status codes
    if (err?.response?.status === 400) {
      if (!errorMessage || errorMessage === "Registration failed") {
        errorMessage = "Invalid registration data. Please check your information.";
      }
    } else if (err?.response?.status === 409) {
      if (!errorMessage || errorMessage === "Registration failed") {
        errorMessage = "User already exists with this email.";
      }
    } else if (err?.response?.status === 422) {
      if (!errorMessage || errorMessage === "Registration failed") {
        errorMessage = "Validation failed. Please check your information.";
      }
    } else if (err?.response?.status === 500) {
      if (!errorMessage || errorMessage === "Registration failed") {
        errorMessage = "Server error. Please try again later.";
      }
    }
    
    // Clean up the error message
    errorMessage = errorMessage.replace(/<[^>]*>/g, '').trim();
    
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

// ✅ Login thunk
export const loginUser = createAsyncThunk<
  AuthResponseDataDto,
  { userType: 'user' | 'doctor'; email: string; password: string },
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
  { message: string; email: string },
  string,
  { rejectValue: string }
>("api/auth/resend-verification", async (email, thunkAPI) => {
  try {
    return await resendVerificationApi(email);
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
      state.userType = null;
      clearAuthData();
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
          state.user = null;
          state.token = null;
          state.userType = null;
          // Clear any existing auth data
          localStorage.removeItem("authToken");
          localStorage.removeItem("userType");
          localStorage.removeItem("userId");
          localStorage.removeItem("name");
          localStorage.removeItem("profilePicture");
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
          state.userType = action.payload.userType;
          localStorage.setItem("authToken", action.payload.accessToken);
          localStorage.setItem("userType", action.payload.userType);
          localStorage.setItem("userId", action.payload.user.id);
          localStorage.setItem("name", action.payload.user.firstName);
          // Store email based on user type
          const userEmail = action.payload.userType === 'doctor' 
            ? (action.payload.user as DoctorResponseDto).email 
            : (action.payload.user as UserResponseDto).primaryEmail;
          localStorage.setItem("email", userEmail);
          localStorage.setItem("profilePicture", (action.payload.user as any).profilePicture || null);
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
