using AuctionLab.Application.Auctions.DTOs;
using AuctionLab.Domain.Entities;

namespace AuctionLab.Application.Auctions;

public interface IAuctionService
{
    Task<List<AuctionSummaryResponse>> GetOpenAsync(string? search, CancellationToken cancellationToken = default);
    Task<List<AuctionSummaryResponse>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default);
    Task<AuctionDetailResponse> GetByIdAsync(int auctionId, CancellationToken cancellationToken = default);
    Task<AuctionDetailResponse> CreateAsync(CreateAuctionRequest request, int userId, CancellationToken cancellationToken = default);
    Task<AuctionDetailResponse> UpdateAsync(UpdateAuctionRequest request, int auctionId, int userId, CancellationToken cancellationToken = default);
}
