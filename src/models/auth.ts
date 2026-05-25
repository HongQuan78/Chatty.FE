export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  expiresIn?: number;
  refreshToken?: string;
  refreshExpiresIn?: number;
  userId?: string;
  userName?: string;
  message?: string;
  error?: string;
  errors?: string[];
}

export type ApiErrorShape = {
  error?: string;
  message?: string;
  title?: string;
  detail?: string;
  errors?: Record<string, string[]> | string[];
};
