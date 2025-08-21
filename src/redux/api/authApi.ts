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
  email: string;
  password: string;
}): Promise<AuthResponseDataDto> => {
  const response = await api.post("api/auth/login", data);
  return response.data.data;
};

// Forgot Password
export const forgotPasswordApi = async (
  email: string
): Promise<{ message: string; email: string }> => {
  const response = await api.post("/auth/forgot-password", { email });
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
