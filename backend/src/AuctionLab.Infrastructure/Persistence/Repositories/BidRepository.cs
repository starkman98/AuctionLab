using AuctionLab.Application.Bids.Exceptions;
using AuctionLab.Application.Repositories;
using AuctionLab.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuctionLab.Infrastructure.Persistence.Repositories;

public class BidRepository : IBidRepository
{
    private readonly AppDbContext _context;

    public BidRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Bid bid, CancellationToken cancellationToken = default)
    {
        await _context.Bids.AddAsync(bid, cancellationToken);
        try
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateConcurrencyException)
        {
            throw new BidConflictException();
        }
    }

    public async Task DeleteAsync(Bid bid, CancellationToken cancellationToken = default)
    {
        _context.Bids.Remove(bid);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<Bid>> GetByAuctionIdAsync(int auctionId, CancellationToken cancellationToken = default)
        => await _context.Bids
        .AsNoTracking()
        .Include(b => b.User)
        .Where(b => b.AuctionId == auctionId)
        .OrderByDescending(b => b.CreatedAt)
        .ToListAsync(cancellationToken);

    public async Task<Bid?> GetByIdAsync(int bidId, CancellationToken cancellationToken = default)
        => await _context.Bids
        .Include(b => b.User)
        .FirstOrDefaultAsync(b => b.BidId == bidId, cancellationToken);


    public async Task<Bid?> GetLatestByAuctionIdAsync(int auctionId, CancellationToken cancellationToken = default)
        => await _context.Bids
        .OrderByDescending(b => b.CreatedAt)
        .FirstOrDefaultAsync(b => b.AuctionId == auctionId, cancellationToken);

    public async Task<List<Bid>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default)
        => await _context.Bids
        .Where(b => b.UserId == userId)
        .Include(b => b.Auction)
        .ThenInclude(a => a.Bids)
        .OrderByDescending(b => b.CreatedAt)
        .ToListAsync();
}
