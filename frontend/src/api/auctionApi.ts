import {
  type AuctionSummaryResponse,
  type AuctionDetailResponse,
  type AuctionStatus,
  type CreateAuctionRequest,
  type UpdateAuctionRequest,
} from "@/types/auction";
import { apiFetch } from "./apiFetch";

export const getAuctions = (
  search?: string,
  status?: AuctionStatus,
  page?: number,
  pageSize?: number,
) =>
  apiFetch<AuctionSummaryResponse[]>(
    `/auctions?search=${search ?? ""}&status=${status ?? "open"}&page=${page ?? 1}&pageSize=${pageSize ?? 20}`,
  );

export const getAuction = (auctionId: number) =>
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
