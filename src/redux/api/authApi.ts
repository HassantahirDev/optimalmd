// src/api/authApi.ts
import api from "@/service/api";
import { AuthResponseDataDto, RegisterDto } from "../slice/authSlice";

// Register User
export const registerUserApi = async (
  data: RegisterDto
): Promise<AuthResponseDataDto> => {
  const response = await api.post("auth/register", data);
  return response.data.data;
};

// Login User/Doctor
export const loginUserApi = async (data: {
  userType: 'user' | 'doctor';
  email: string;
  password: string;
}): Promise<AuthResponseDataDto> => {
  const response = await api.post("auth/login", data);
  return response.data.data;
};

// Forgot Password
export const forgotPasswordApi = async (
  email: string
): Promise<{ message: string; email: string }> => {
  const response = await api.post("auth/forgot-password", { email });
  return response.data.data;
};

// Resend Email Verification
export const resendVerificationApi = async (
  email: string
): Promise<{ message: string; email: string }> => {
  const response = await api.post("auth/resend-verification", { email });
  return response.data.data;
};

// Reset Password
export const resetPasswordApi = async (
  token: string,
  accountType: 'user' | 'doctor',
  newPassword: string
): Promise<{ message: string }> => {
  const response = await api.post("auth/reset-password", {
    token,
    accountType,
    newPassword,
  });
  return response.data.data;
};
