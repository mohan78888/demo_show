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
  provider: 'google' | 'apple' | 'facebook';
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
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

const API_URL = '/api';

export const authService = {
  async signup(userData: SignupData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Backend server is not active on port 5000. Please start the backend server.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      if (data.token) {
        this.setToken(data.token);
      }
      return data;
    } catch (error: any) {
      console.error('Signup service error:', error);
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to server. Please make sure the backend is running on port 5000.');
      }
      throw error;
    }
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Backend server is not active on port 5000. Please start the backend server.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      if (data.token) {
        this.setToken(data.token);
      }
      return data;
    } catch (error: any) {
      console.error('Login service error:', error);
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to server. Please make sure the backend is running on port 5000.');
      }
      throw error;
    }
  },

  async socialLogin(socialData: SocialLoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/social`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socialData),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Backend server is not active on port 5000. Please start the backend server.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      if (data.token) {
        this.setToken(data.token);
      }
      return data;
    } catch (error: any) {
      console.error('Social login error:', error);
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to server. Please make sure the backend is running on port 5000.');
      }
      throw error;
    }
  },

  async getProfile(): Promise<any | null> {
    try {
      const token = this.getToken();
      if (!token) return null;

      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` },
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

  logout(): void {
    localStorage.removeItem('triphawks_token');
  }
};