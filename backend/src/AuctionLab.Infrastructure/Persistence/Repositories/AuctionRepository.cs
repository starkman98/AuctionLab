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
        => await _context.Auctions
        .Include(a => a.User)
        .Include(a => a.Bids)
        .ThenInclude(b => b.User)
        .FirstOrDefaultAsync(a => a.AuctionId == auctionId, cancellationToken);

    public async Task<List<Auction>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default)
        => await _context.Auctions
        .AsNoTracking()
        .Where(a => a.UserId == userId)
        .Include(a => a.User)
        .Include(a => a.Bids)
        .ThenInclude(b => b.User)
        .OrderBy(a => a.EndTime)
        .ToListAsync(cancellationToken);

    public async Task<List<Auction>> GetOpenAsync(string? search, CancellationToken cancellationToken = default)
        => await _context.Auctions
        .AsNoTracking()
        .Where(a => a.EndTime > DateTimeOffset.UtcNow && a.InactivatedAt == null 
            && (search == null || a.Title.Contains(search) || a.Description.Contains(search)))
        .Include(a => a.User)
        .Include(a => a.Bids)
        .ThenInclude(b => b.User)
        .OrderBy(a => a.EndTime)
        .ToListAsync(cancellationToken);

    public async Task UpdateAsync(Auction auction, CancellationToken cancellationToken = default)
        => await _context.SaveChangesAsync(cancellationToken);
}
