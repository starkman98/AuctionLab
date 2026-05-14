import type { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth";
import { apiFetch } from "./apiFetch";

export const register = (requestBody: RegisterRequest) =>
  apiFetch<AuthResponse>(`/auth/register`, {
    method: "POST",
    body: JSON.stringify(requestBody),
  });

export const login = (requestBody: LoginRequest) =>
  apiFetch<AuthResponse>(`/auth/login`, {
    method: "POST",
    body: JSON.stringify(requestBody),
  });

export const logout = () =>
  apiFetch<void>(`/auth/logout`, {
    method: "POST",
  });
