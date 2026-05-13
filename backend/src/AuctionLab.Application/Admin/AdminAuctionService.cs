using AuctionLab.Application.Admin.DTOs;
using AuctionLab.Application.Auctions.Exceptions;
using AuctionLab.Application.Repositories;

namespace AuctionLab.Application.Admin;

public class AdminAuctionService : IAdminAuctionService
{
    private readonly IAuctionRepository _repo;

    public AdminAuctionService(IAuctionRepository repo)
    {
        _repo = repo;
    }

    public async Task<AdminAuctionResponse> InactivateAsync(int auctionId, CancellationToken cancellationToken = default)
    {
        var auction = await _repo.GetByIdAsync(auctionId, cancellationToken)
            ?? throw new AuctionNotFoundException();

        if (auction.InactivatedAt is not null)
            return AdminMapper.ToAuctionResponse(auction);

        auction.InactivatedAt = DateTimeOffset.UtcNow;

        await _repo.UpdateAsync(auction, cancellationToken);

        return AdminMapper.ToAuctionResponse(auction);
    }

    public async Task<List<AdminAuctionResponse>> GetAllAsync(int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var auctions = await _repo.GetAllAsync(page, pageSize, cancellationToken);

        return auctions.Select(auction => AdminMapper.ToAuctionResponse(auction)).ToList();
    }

    public async Task<AdminAuctionResponse> ReactivateAsync(int auctionId, CancellationToken cancellationToken = default)
    {
        var auction = await _repo.GetByIdAsync(auctionId, cancellationToken)
            ?? throw new AuctionNotFoundException();

        if (auction.InactivatedAt is null)
            return AdminMapper.ToAuctionResponse(auction);

        auction.InactivatedAt = null;

        await _repo.UpdateAsync(auction, cancellationToken);

        return AdminMapper.ToAuctionResponse(auction);
    }
}
