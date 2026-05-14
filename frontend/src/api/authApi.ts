import type { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth";
import { apiFetch } from "./apiFetch";

export const registerApi = (requestBody: RegisterRequest) =>
  apiFetch<AuthResponse>(`/auth/register`, {
    method: "POST",
    body: JSON.stringify(requestBody),
  });

export const loginApi = (requestBody: LoginRequest) =>
  apiFetch<AuthResponse>(`/auth/login`, {
    method: "POST",
    body: JSON.stringify(requestBody),
  });

export const logoutApi = () =>
  apiFetch<void>(`/auth/logout`, {
    method: "POST",
  });
