using AuctionLab.Application.Admin.DTOs;
using AuctionLab.Domain.Enums;

namespace AuctionLab.Application.Admin
{
    public interface IAdminAuctionService
    {
        Task<List<AdminAuctionResponse>> GetAllAsync(int page, int pageSize, AuctionStatus status, string? search = null, CancellationToken cancellationToken = default);
        Task<AdminAuctionResponse> InactivateAsync(int auctionId, CancellationToken cancellationToken = default);
        Task<AdminAuctionResponse> ReactivateAsync(int auctionId, CancellationToken cancellationToken = default);
    }
}
