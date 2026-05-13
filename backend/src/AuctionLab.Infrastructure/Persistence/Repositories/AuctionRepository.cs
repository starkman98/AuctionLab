using AuctionLab.Application.Repositories;
using AuctionLab.Domain.Entities;
using AuctionLab.Domain.Enums;
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

    public async Task<List<Auction>> GetAllAsync(int page, int pageSize, CancellationToken cancellationToken = default)
        => await _context.Auctions
        .IgnoreQueryFilters()
        .AsNoTracking()
        .Include(a => a.User)
        .Include(a => a.Bids)
        .OrderBy(a => a.EndTime)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync(cancellationToken);

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

    public async Task<List<Auction>> SearchAsync(string? search, AuctionStatus status, CancellationToken cancellationToken = default)
    {
        var query = _context.Auctions.AsNoTracking().AsQueryable();

        query = status switch
        {
            AuctionStatus.Open => query.Where(a => a.EndTime > DateTimeOffset.UtcNow),
            AuctionStatus.Closed => query.Where(a => a.EndTime <= DateTimeOffset.UtcNow),
            _ => query
        };

        if (search != null)
            query = query.Where(a => a.Title.Contains(search) || a.Description.Contains(search));

        return await query
            .Include(a => a.User)
            .Include(a => a.Bids)
            .ThenInclude(b => b.User)
            .OrderBy(a => a.EndTime)
            .ToListAsync(cancellationToken);
    }

    public async Task UpdateAsync(Auction auction, CancellationToken cancellationToken = default)
        => await _context.SaveChangesAsync(cancellationToken);
}
