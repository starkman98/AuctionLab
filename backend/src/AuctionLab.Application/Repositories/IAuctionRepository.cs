using AuctionLab.Application.Auctions.DTOs;
using AuctionLab.Domain.Entities;

namespace AuctionLab.Application.Repositories;

public interface IAuctionRepository
{
    Task<Auction?> GetByIdAsync(int auctionId, CancellationToken cancellationToken = default);
    Task<List<Auction>> GetOpenAsync(string? search, CancellationToken cancellationToken = default);
    Task<List<Auction>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default);
    Task AddAsync(Auction auction, CancellationToken cancellationToken = default);
    Task UpdateAsync(Auction auction, CancellationToken cancellationToken = default);
}
