"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuthToken, getAuthData, DecodedToken, logout } from "@/lib/auth";

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
    if (typeof window !== "undefined") {
        const data = getAuthData(); // First check validity (clears localstorage if expired)
        const rawToken = getAuthToken(); // Now read the token (will be null if cleared above)
        
        // eslint-disable-next-line
        setToken(rawToken);
        setUser(data);
        setIsLoading(false);
    }
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
