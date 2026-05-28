using AuctionLab.Application.Auctions.DTOs;
using AuctionLab.Domain.Entities;
using AuctionLab.Domain.Enums;

namespace AuctionLab.Application.Repositories;

public interface IAuctionRepository
{
    Task<Auction?> GetByIdAsync(int auctionId, CancellationToken cancellationToken = default);
    Task<(List<Auction>, int totalCount)> SearchAsync(string? search, AuctionStatus status, int page, int pageSize, CancellationToken cancellationToken = default);
    Task<List<Auction>> GetByUserIdAsync(int userId, AuctionStatus status, string? search = null, CancellationToken cancellationToken = default);
    Task AddAsync(Auction auction, CancellationToken cancellationToken = default);
    Task UpdateAsync(Auction auction, CancellationToken cancellationToken = default);
    Task<List<Auction>> GetAllAsync(int page, int pageSize, AuctionStatus status, string? search = null, CancellationToken cancellationToken = default);
    Task<Auction?> GetByIdIncludingInactiveAsync(int auctionId, CancellationToken cancellationToken = default);
}
