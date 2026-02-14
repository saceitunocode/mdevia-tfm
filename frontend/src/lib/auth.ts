"use client";

import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  sub: string; // email
  role: "ADMIN" | "AGENT";
  full_name?: string;
  exp: number;
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function getAuthData(): DecodedToken | null {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    // Verificar si el token ha expirado
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.removeItem("token");
      return null;
    }
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getAuthData();
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    window.location.href = "/oficina/acceso";
  }
}
