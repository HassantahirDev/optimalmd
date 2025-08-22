import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for authentication
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const getUserType = (): 'user' | 'doctor' | null => {
  return localStorage.getItem('userType') as 'user' | 'doctor' | null;
};

export const getUserId = (): string | null => {
  return localStorage.getItem('userId');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const isUser = (): boolean => {
  return getUserType() === 'user';
};

export const isDoctor = (): boolean => {
  return getUserType() === 'doctor';
};

export const clearAuthData = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userType');
  localStorage.removeItem('userId');
};
