interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SocialLoginData {
  idToken: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string;
    isEmailVerified?: boolean;
    lastLogin?: string | null;
    createdAt?: string;
  };
}

const getApiBase = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
  }
  return '/api';
};

async function postAuth(endpoint: string, body: any): Promise<AuthResponse> {
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const urlsToTry = isLocal
    ? [`http://localhost:5000/api${endpoint}`, `/api${endpoint}`]
    : [`/api${endpoint}`, `http://localhost:5000/api${endpoint}`];

  let lastError: Error | null = null;

  for (const url of urlsToTry) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const text = await response.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { message: text };
      }

      if (!response.ok) {
        const errorMsg = data.message || data.error || `Authentication failed (${response.status})`;
        throw new Error(errorMsg);
      }

      if (data.token) {
        authService.setToken(data.token);
      }
      return data;
    } catch (err: any) {
      lastError = err;
      // If it was a real response from the backend (like invalid credentials or validation error), surface it immediately
      if (err.message && !err.message.includes('fetch') && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
        throw err;
      }
    }
  }

  throw new Error(lastError?.message || 'Cannot connect to authentication server. Please ensure backend is running.');
}

export const authService = {
  async signup(userData: SignupData): Promise<AuthResponse> {
    return postAuth('/auth/signup', userData);
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return postAuth('/auth/login', credentials);
  },

  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    return postAuth('/auth/google', { idToken });
  },

  async socialLogin(socialData: SocialLoginData): Promise<AuthResponse> {
    return postAuth('/auth/social', socialData);
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const url = isLocal ? 'http://localhost:5000/api/auth/forgot-password' : '/api/auth/forgot-password';

    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send password reset email.');
    }
    return data;
  },

  async resetPassword(token: string, password: string): Promise<AuthResponse> {
    return postAuth('/auth/reset-password', { token, password });
  },

  async getProfile(): Promise<any | null> {
    try {
      const token = this.getToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${getApiBase()}/auth/profile`, {
        credentials: 'include',
        headers,
      });

      if (!response.ok) {
        this.logout();
        return null;
      }

      return response.json();
    } catch (error) {
      console.error('Profile fetch error:', error);
      this.logout();
      return null;
    }
  },

  setToken(token: string): void {
    localStorage.setItem('triphawks_token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('triphawks_token');
  },

  async logout(): Promise<void> {
    localStorage.removeItem('triphawks_token');
    try {
      await fetch(`${getApiBase()}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Ignore network errors during logout
    }
  }
};