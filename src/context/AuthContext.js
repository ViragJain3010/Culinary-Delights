"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { CombinedAuthServices } from "@/services/CombinedAuthServices";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastAuthCheck, setLastAuthCheck] = useState(0);
  const [userLoggedin, setUserLoggedin] = useState(false);

  // Check authentication status
  const checkAuthStatus = useCallback(
    async (force = false) => {
      // Skip rapid sequential checks unless forced
      const now = Date.now();
      if (!force && now - lastAuthCheck < 2000) {
        return user !== null;
      }

      setLastAuthCheck(now);
      setLoading(true);

      try {
        // Check if we have valid authentication
        if (CombinedAuthServices.isAuthenticated()) {
          const userInfo = await CombinedAuthServices.getUserInfo();
          setUser(userInfo);
          setLoading(false);
          return true;
        }

        // Not authenticated
        setUser(null);
        setLoading(false);
        return false;
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
        setLoading(false);
        return false;
      }
    },
    [user, lastAuthCheck]
  );

  // Initial auth check
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Function to trigger explicit auth check
  const refreshAuthStatus = () => checkAuthStatus(true);

  // Initiate login flow (will redirect browser)
  const initiateLogin = async (username, password) => {
    try {
      await CombinedAuthServices.initiateLogin(username, password);
      // Note: This function won't actually return as the browser redirects
      return true;
    } catch (error) {
      console.error("Login initiation failed:", error);
      throw error;
    }
  };

  // Handle OAuth callback after redirect
  const handleCallback = async (code, state) => {
    try {
      await CombinedAuthServices.handleCallback(code, state);
      await refreshAuthStatus();
      return true;
    } catch (error) {
      console.error("OAuth callback handling failed:", error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await CombinedAuthServices.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: () => checkAuthStatus(),
    refreshAuthStatus,
    initiateLogin,
    handleCallback,
    logout,
    userLoggedin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);