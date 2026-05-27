using AuctionLab.Application.Bids.DTOs;

namespace AuctionLab.Application.Bids;

public interface IBidService
{
    Task<List<BidSummaryResponse>> GetBidsForAuctionAsync(int auctionId, CancellationToken cancellationToken = default);
    Task<BidSummaryResponse> PlaceBidAsync(PlaceBidRequest request, int auctionId, int userId, CancellationToken cancellationToken = default);
    Task RetractBidAsync(int bidId, int userId, CancellationToken cancellationToken = default);
    Task<List<MyBidResponse>> GetByUserIdAsync(int userId, string? search = null, CancellationToken cancellationToken = default);
}
