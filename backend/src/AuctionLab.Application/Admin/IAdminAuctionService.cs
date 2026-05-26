using AuctionLab.Application.Admin.DTOs;

namespace AuctionLab.Application.Admin
{
    public interface IAdminAuctionService
    {
        Task<List<AdminAuctionResponse>> GetAllAsync(int page, int pageSize, string? search = null, CancellationToken cancellationToken = default);
        Task<AdminAuctionResponse> InactivateAsync(int auctionId, CancellationToken cancellationToken = default);
        Task<AdminAuctionResponse> ReactivateAsync(int auctionId, CancellationToken cancellationToken = default);
    }
}
