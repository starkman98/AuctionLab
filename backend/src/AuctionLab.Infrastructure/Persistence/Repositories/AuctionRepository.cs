using AuctionLab.Application.Repositories;
using AuctionLab.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuctionLab.Infrastructure.Persistence.Repositories;

public class AuctionRepository : IAuctionRepository
{
    private readonly AppDbContext _context;

    public AuctionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Auction auction, CancellationToken cancellationToken = default)
    {
        _context.Auctions.Add(auction);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<Auction?> GetByIdAsync(int auctionId, CancellationToken cancellationToken = default)
        => await _context.Auctions.FindAsync(auctionId, cancellationToken);

    public async Task<List<Auction>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default)
        => await _context.Auctions
        .IgnoreQueryFilters()
        .Where(a => a.UserId == userId)
        .OrderBy(a => a.EndTime)
        .ToListAsync(cancellationToken);

    public async Task<List<Auction>> GetOpenAsync(string? search, CancellationToken cancellationToken = default)
        => await _context.Auctions
        .Where(a => a.IsOpen && a.Title
        .Contains(search!))
        .OrderBy(a => a.EndTime)
        .ToListAsync(cancellationToken);

    public async Task UpdateAsync(Auction auction, CancellationToken cancellationToken = default)
        => await _context.SaveChangesAsync(cancellationToken);
}
