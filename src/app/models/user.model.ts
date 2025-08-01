export interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
} 