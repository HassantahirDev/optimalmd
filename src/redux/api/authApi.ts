// src/api/authApi.ts
import api from "@/service/api";
import { AuthResponseDataDto, RegisterDto } from "../slice/authSlice";

// Register User
export const registerUserApi = async (
  data: RegisterDto
): Promise<AuthResponseDataDto> => {
  const response = await api.post("api/auth/register", data);
  return response.data.data;
};

// Login User
export const loginUserApi = async (data: {
  primaryEmail: string;
  password: string;
}): Promise<AuthResponseDataDto> => {
  const response = await api.post("api/auth/login", data);
  return response.data.data;
};

// Forgot Password
export const forgotPasswordApi = async (
  primaryEmail: string
): Promise<{ message: string; primaryEmail: string }> => {
  const response = await api.post("/auth/forgot-password", { primaryEmail });
  return response.data.data;
};

// Resend Email Verification
export const resendVerificationApi = async (
  primaryEmail: string
): Promise<{ message: string; primaryEmail: string }> => {
  const response = await api.post("api/auth/resend-verification", { primaryEmail });
  return response.data.data;
};

// Reset Password
export const resetPasswordApi = async (
  token: string,
  newPassword: string
): Promise<{ message: string }> => {
  const response = await api.post("/auth/reset-password", {
    token,
    newPassword,
  });
  return response.data.data;
};
