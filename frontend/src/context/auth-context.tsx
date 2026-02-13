"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuthToken, getAuthData, DecodedToken, logout } from "@/lib/auth";
import { apiRequest } from "@/lib/api";

interface AuthContextType {
  user: DecodedToken | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window !== "undefined") {
        const data = getAuthData(); // First check validity (clears localstorage if expired)
        const rawToken = getAuthToken(); // Now read the token (will be null if cleared above)
        
        setToken(rawToken);
        setUser(data);

        // Stale-While-Revalidate: If we have a valid token, verify/refresh data with backend
        if (rawToken && data) {
          try {
            // We fetch the latest user data from the API
            const freshUser = await apiRequest<{ full_name: string; email: string; role: string }>("/users/me");
            
            // We update the local state with the fresh data
            setUser((prev) => {
              if (!prev) return null;
              return {
                ...prev,
                full_name: freshUser.full_name,
                sub: freshUser.email,
              };
            });
          } catch (error) {
            console.error("Failed to refresh user data:", error);
            // Optional: If 401, we could force logout here, but let's be conservative
            // and rely on getAuthData validity for now to avoid loops if API is just down.
          }
        }
        
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleLogin = (rawToken: string) => {
    localStorage.setItem("token", rawToken);
    const data = getAuthData();
    setToken(rawToken);
    setUser(data);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
