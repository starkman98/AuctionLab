export interface AdminAuctionResponse {
  auctionId: number;
  title: string;
  startingPrice: number;
  currentHighestBid: number | null;
  startTime: string;
  endTime: string;
  ownerUsername: string;
  ownerId: number;
  bidCount: number;
  isActive: boolean;
  inactivatedAt: string | null;
  imageUrl: string | null;
}

export interface AdminUserResponse {
  userId: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  inactivatedAt: string | null;
}

export interface ChangeRoleRequest {
  role: string;
}
