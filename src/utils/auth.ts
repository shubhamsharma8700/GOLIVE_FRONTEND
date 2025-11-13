// Authentication utilities

export interface User {
  id?: string;
  email?: string;
  username?: string;  // <-- added
  name?: string;
  role?: "admin" | "user";
}

export interface AuthToken {
  token: string;
  expiresAt: number;
  user: User;
}

// Token management
export const authUtils = {
  // Save auth token to localStorage
  setToken: (token: string, user: User, expiresIn: number = 3600) => {
    const authData: AuthToken = {
      token,
      expiresAt: Date.now() + expiresIn * 1000,
      user,
    };
    localStorage.setItem("authToken", token);
    localStorage.setItem("authData", JSON.stringify(authData));
  },

  // Get auth token from localStorage
  getToken: (): string | null => {
    return localStorage.getItem("authToken");
  },

  // Get auth data
  getAuthData: (): AuthToken | null => {
    const data = localStorage.getItem("authData");
    if (!data) return null;

    try {
      const authData: AuthToken = JSON.parse(data);
      if (authData.expiresAt < Date.now()) {
        authUtils.clearToken();
        return null;
      }
      return authData;
    } catch (err) {
      return null;
    }
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const authData = authUtils.getAuthData();
    return authData?.user || null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authUtils.getToken() && !!authUtils.getAuthData();
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    const user = authUtils.getCurrentUser();
    return user?.role === "admin";
  },

  // Clear auth token
  clearToken: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authData");
  },

  // Basic JWT validator
  validateToken: (token: string): boolean => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1]));
      return payload.exp * 1000 > Date.now();
    } catch (err) {
      return false;
    }
  },
};
