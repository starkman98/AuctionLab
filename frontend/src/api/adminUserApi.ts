import type { AdminUserResponse, ChangeRoleRequest } from "@/types/admin";
import { apiFetch } from "./apiFetch";

export const getUsers = (page?: number, pageSize?: number) =>
  apiFetch<AdminUserResponse[]>(
    `/admin/users?page=${page ?? 1}&pageSize=${pageSize ?? 20}`,
  );

export const changeRole = (userId: number, requestBody: ChangeRoleRequest) =>
  apiFetch<AdminUserResponse>(`/admin/users/${userId}/role`, {
    method: "PUT",
    body: JSON.stringify(requestBody),
  });

export const inactivateUser = (userId: number) =>
  apiFetch<AdminUserResponse>(`/admin/users/${userId}/inactivate`, {
    method: "PUT",
  });

export const reactivateUser = (userId: number) =>
  apiFetch<AdminUserResponse>(`/admin/users/${userId}/activate`, {
    method: "PUT",
  });
