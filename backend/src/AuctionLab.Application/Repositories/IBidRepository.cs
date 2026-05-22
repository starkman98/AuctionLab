using AuctionLab.Domain.Entities;

namespace AuctionLab.Application.Repositories;

public interface IBidRepository
{
    Task AddAsync(Bid bid, CancellationToken cancellationToken = default);
    Task DeleteAsync(Bid bid, CancellationToken cancellationToken = default);
    Task<List<Bid>> GetByAuctionIdAsync(int auctionId, CancellationToken cancellationToken = default);
    Task<Bid?> GetLatestByAuctionIdAsync(int auctionId, CancellationToken cancellationToken = default);
    Task<Bid?> GetByIdAsync(int bidId, CancellationToken cancellationToken = default);
    Task<List<Bid>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default);
}
