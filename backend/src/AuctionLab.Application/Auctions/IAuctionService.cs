using AuctionLab.Application.Auctions.DTOs;
using AuctionLab.Domain.Entities;
using AuctionLab.Domain.Enums;

namespace AuctionLab.Application.Auctions;

public interface IAuctionService
{
    Task<List<AuctionSummaryResponse>> SearchAsync(string? search, AuctionStatus status, CancellationToken cancellationToken = default);
    Task<List<AuctionSummaryResponse>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default);
    Task<AuctionDetailResponse> GetByIdAsync(int auctionId, CancellationToken cancellationToken = default);
    Task<AuctionDetailResponse> CreateAsync(CreateAuctionRequest request, int userId, CancellationToken cancellationToken = default);
    Task<AuctionDetailResponse> UpdateAsync(UpdateAuctionRequest request, int auctionId, int userId, CancellationToken cancellationToken = default);
}
