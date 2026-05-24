export interface BidSummaryResponse {
  bidId: number;
  amount: number;
  createdAt: string;
  bidderUsername: string;
}

export interface PlaceBidRequest {
  amount: number;
}

export interface MyBidResponse {
  auctionId: number;
  auctionTitle: string;
  endTime: string;
  isOpen: boolean;
  myBidAmount: number;
  currentHighestBid: number;
  isWinning: boolean;
  imageUrl: string | null;
}
