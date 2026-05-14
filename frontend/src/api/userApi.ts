import type { AuthUser } from "@/types/auth";
import { apiFetch } from "./apiFetch";
import type { ChangePasswordRequest } from "@/types/user";

export const getMe = () => apiFetch<AuthUser>(`/users/me`);

export const changePassword = (requestBody: ChangePasswordRequest) =>
  apiFetch<void>(`/users/me/password`, {
    method: "PUT",
    body: JSON.stringify(requestBody),
  });
