import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for authentication
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const getUserType = (): 'user' | 'doctor' | 'admin' | null => {
  return localStorage.getItem('userType') as 'user' | 'doctor' | 'admin' | null;
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

export const isAdmin = (): boolean => {
  return getUserType() === 'admin';
};

export const clearAuthData = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userType');
  localStorage.removeItem('userId');
  localStorage.removeItem('name');
  localStorage.removeItem('profilePicture');
};

// JWT token validation
export const isTokenValid = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    // Decode JWT token (without verification - just to check expiration)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Check if token is expired
    if (payload.exp && payload.exp < currentTime) {
      // Token is expired, clear auth data
      clearAuthData();
      return false;
    }
    
    return true;
  } catch (error) {
    // Invalid token format, clear auth data
    clearAuthData();
    return false;
  }
};

// Check if user is authenticated and token is valid
export const isAuthenticatedAndValid = (): boolean => {
  return isAuthenticated() && isTokenValid();
};
