export interface BidSummaryResponse {
  bidId: number;
  amount: number;
  createdAt: string;
  bidderUsername: string;
}

export interface PlaceBidRequest {
  amount: number;
}
