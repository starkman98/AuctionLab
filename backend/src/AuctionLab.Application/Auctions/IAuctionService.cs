using AuctionLab.Application.Auctions.DTOs;
using AuctionLab.Application.Common;
using AuctionLab.Domain.Entities;
using AuctionLab.Domain.Enums;

namespace AuctionLab.Application.Auctions;

public interface IAuctionService
{
    Task<PagedResponse<AuctionSummaryResponse>> SearchAsync(string? search, AuctionStatus status, int page, int pageSize, CancellationToken cancellationToken = default);
    Task<List<AuctionSummaryResponse>> GetByUserIdAsync(int userId, AuctionStatus status, string? search = null, CancellationToken cancellationToken = default);
    Task<AuctionDetailResponse> GetByIdAsync(int auctionId, CancellationToken cancellationToken = default);
    Task<AuctionDetailResponse> CreateAsync(CreateAuctionRequest request, int userId, CancellationToken cancellationToken = default);
    Task<AuctionDetailResponse> UpdateAsync(UpdateAuctionRequest request, int auctionId, int userId, CancellationToken cancellationToken = default);
}
