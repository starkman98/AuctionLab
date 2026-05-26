import type { AdminAuctionResponse } from "@/types/admin";
import { apiFetch } from "./apiFetch";

export const getAuctions = (
  page?: number,
  pageSize?: number,
  search?: string,
) =>
  apiFetch<AdminAuctionResponse[]>(
    `/admin/auctions?page=${page ?? 1}&pageSize=${pageSize ?? 20}&search=${search ?? ""}`,
  );

export const inactivateAuction = (auctionId: number) =>
  apiFetch<AdminAuctionResponse>(`/admin/auctions/${auctionId}/inactivate`, {
    method: "PUT",
  });

export const reactivateAuction = (auctionId: number) =>
  apiFetch<AdminAuctionResponse>(`/admin/auctions/${auctionId}/activate`, {
    method: "PUT",
  });
