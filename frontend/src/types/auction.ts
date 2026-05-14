import type { BidSummaryResponse } from "./bid";

export type AuctionStatus = "open" | "closed" | "all";

export interface AuctionSummaryResponse {
  auctionId: number;
  title: string;
  startingPrice: number;
  currentHighestBid: number | null;
  startTime: string;
  endTime: string;
  ownerUsername: string;
  bidCount: number;
}

export interface AuctionDetailResponse {
  auctionId: number;
  title: string;
  description: string;
  ownerUsername: string;
  ownerId: number;
  startingPrice: number;
  currentHighestBid: number | null;
  startTime: string;
  endTime: string;
  isOpen: boolean;
  bids: BidSummaryResponse[];
}

export interface CreateAuctionRequest {
  title: string;
  description: string;
  startingPrice: number;
  reservationPrice?: number;
  endTime: string;
}

export interface UpdateAuctionRequest {
  title: string;
  description: string;
}
