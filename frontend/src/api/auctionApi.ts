import {
  type AuctionSummaryResponse,
  type AuctionDetailResponse,
  type AuctionStatus,
  type CreateAuctionRequest,
  type UpdateAuctionRequest,
} from "@/types/auction";
import { apiFetch } from "./apiFetch";
import type { PagedResponse } from "@/types/pagination";

export const getAuctions = (
  search?: string,
  status?: AuctionStatus,
  page?: number,
  pageSize?: number,
) =>
  apiFetch<PagedResponse<AuctionSummaryResponse>>(
    `/auctions?search=${search ?? ""}&status=${status ?? "all"}&page=${page ?? 1}&pageSize=${pageSize ?? 20}`,
  );

export const getAuction = (auctionId: string) =>
  apiFetch<AuctionDetailResponse>(`/auctions/${auctionId}`);

export const createAuction = (requestBody: CreateAuctionRequest) =>
  apiFetch<AuctionDetailResponse>(`/auctions`, {
    method: "POST",
    body: JSON.stringify(requestBody),
  });

export const updateAuction = (
  auctionId: number,
  requestBody: UpdateAuctionRequest,
) =>
  apiFetch<AuctionDetailResponse>(`/auctions/${auctionId}`, {
    method: "PUT",
    body: JSON.stringify(requestBody),
  });

export const getMyAuctions = (status?: string, search?: string) =>
  apiFetch<AuctionSummaryResponse[]>(
    `/auctions/me?status=${status ?? "all"}&search=${search ?? ""}`,
  );
