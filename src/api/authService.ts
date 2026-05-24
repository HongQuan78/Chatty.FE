const API_BASE_URL = '/api';

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

type ApiErrorShape = {
  error?: string;
  message?: string;
  title?: string;
  detail?: string;
  errors?: Record<string, string[]> | string[];
};

const getErrorMessage = (errorData: ApiErrorShape, fallback: string) => {
  if (errorData.error) return errorData.error;
  if (errorData.message) return errorData.message;
  if (errorData.detail) return errorData.detail;

  if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
    return errorData.errors.join(' ');
  }

  if (errorData.errors && !Array.isArray(errorData.errors)) {
    const validationMessages = Object.values(errorData.errors).flat();
    if (validationMessages.length > 0) {
      return validationMessages.join(' ');
    }
  }

  return errorData.title || fallback;
};

const storeAuthSession = (result: AuthResponse) => {
  const token = result.token || result.accessToken;
  if (token) {
    localStorage.setItem('token', token);
  }
  if (result.refreshToken) {
    localStorage.setItem('refreshToken', result.refreshToken);
  }
  if (result.expiresIn) {
    localStorage.setItem('expiresIn', String(result.expiresIn));
    localStorage.setItem('tokenExpiresAt', String(Date.now() + result.expiresIn * 1000));
  }
  if (result.refreshExpiresIn) {
    localStorage.setItem('refreshExpiresIn', String(result.refreshExpiresIn));
    localStorage.setItem('refreshTokenExpiresAt', String(Date.now() + result.refreshExpiresIn * 1000));
  }
  if (result.userId) {
    localStorage.setItem('userId', result.userId);
  }
  if (result.userName) {
    localStorage.setItem('userName', result.userName);
  }
};

let refreshPromise: Promise<AuthResponse> | null = null;

export const authService = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/Auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(getErrorMessage(errorData, 'Registration failed'));
    }

    return response.json();
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(getErrorMessage(errorData, 'Login failed. Please check your credentials.'));
    }

    const result = await response.json();
    storeAuthSession(result);
    return result;
  },

  refresh: async (): Promise<AuthResponse> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('Missing refresh token');
    }

    const response = await fetch(`${API_BASE_URL}/Auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(getErrorMessage(errorData, 'Session expired. Please log in again.'));
    }

    const result = await response.json();
    storeAuthSession(result);
    return result;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('refreshExpiresIn');
    localStorage.removeItem('tokenExpiresAt');
    localStorage.removeItem('refreshTokenExpiresAt');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
  },

  getAuthHeaders: (): Record<string, string> => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  getAccessToken: () => localStorage.getItem('token') || '',

  authFetch: async (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
    const makeRequest = () => {
      const headers = new Headers(init.headers);
      if (!headers.has('Content-Type') && !(init.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
      }

      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return fetch(input, {
        ...init,
        headers,
      });
    };

    let response = await makeRequest();
    if (response.status !== 401) {
      return response;
    }

    try {
      refreshPromise ??= authService.refresh().finally(() => {
        refreshPromise = null;
      });
      await refreshPromise;
      response = await makeRequest();
      return response;
    } catch (error) {
      authService.logout();
      throw error;
    }
  },

  getCurrentUserId: () => localStorage.getItem('userId'),
};
