import type {
  BidSummaryResponse,
  MyBidResponse,
  PlaceBidRequest,
} from "@/types/bid";
import { apiFetch } from "./apiFetch";

export const getBids = (auctionId: number) =>
  apiFetch<BidSummaryResponse[]>(`/auctions/${auctionId}/bids`);

export const placeBid = (auctionId: number, requestBody: PlaceBidRequest) =>
  apiFetch<BidSummaryResponse>(`/auctions/${auctionId}/bids`, {
    method: "POST",
    body: JSON.stringify(requestBody),
  });

export const retractBid = (bidId: number) =>
  apiFetch<void>(`/bids/${bidId}`, {
    method: "DELETE",
  });

export const getMyBids = () => apiFetch<MyBidResponse[]>(`/bids/me`);
