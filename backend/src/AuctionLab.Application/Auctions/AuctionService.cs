using AuctionLab.Application.Auctions.DTOs;
using AuctionLab.Application.Auctions.Exceptions;
using AuctionLab.Application.Common;
using AuctionLab.Application.Repositories;
using AuctionLab.Domain.Entities;
using AuctionLab.Domain.Enums;

namespace AuctionLab.Application.Auctions;

public class AuctionService : IAuctionService
{
    private readonly IAuctionRepository _repo;

    public AuctionService(IAuctionRepository auctionRepo)
    {
        _repo = auctionRepo;
    }

    public async Task<AuctionDetailResponse> CreateAsync(CreateAuctionRequest request, int userId, CancellationToken cancellationToken = default)
    {
        if (request.EndTime < DateTimeOffset.UtcNow.AddHours(1))
            throw new InvalidAuctionEndtimeException();

        var newAuction = new Auction
        {
            Title = request.Title,
            Description = request.Description,
            StartingPrice = request.StartingPrice,
            ReservationPrice = request.ReservationPrice,
            EndTime = request.EndTime,
            UserId = userId,
            ImageUrl = request.ImageUrl
        };

        await _repo.AddAsync(newAuction, cancellationToken);

        var createdAuction = await _repo.GetByIdAsync(newAuction.AuctionId, cancellationToken)
            ?? throw new AuctionNotFoundException();

        return AuctionMapper.ToDetailResponse(createdAuction);
    }

    public async Task<AuctionDetailResponse> GetByIdAsync(int auctionId, CancellationToken cancellationToken = default)
    {
        var auction = await _repo.GetByIdAsync(auctionId, cancellationToken)
            ?? throw new AuctionNotFoundException();

        return AuctionMapper.ToDetailResponse(auction);
    }

    public async Task<List<AuctionSummaryResponse>> GetByUserIdAsync(int userId, AuctionStatus status, string? search = null, CancellationToken cancellationToken = default)
    {
        var auctions = await _repo.GetByUserIdAsync(userId, status, search, cancellationToken);

        var auctionsResponse = new List<AuctionSummaryResponse>();

        foreach (var auction in auctions)
        {
            auctionsResponse.Add(AuctionMapper.ToSummaryResponse(auction));
        }

        return auctionsResponse;
    }

    public async Task<PagedResponse<AuctionSummaryResponse>> SearchAsync(
        string? search,
        AuctionStatus status,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (auctions, totalCount) = await _repo.SearchAsync(search, status, page, pageSize, cancellationToken);

        var items = auctions.Select(auction => AuctionMapper.ToSummaryResponse(auction)).ToList();

        return new PagedResponse<AuctionSummaryResponse>(items, totalCount, page, pageSize);
    }

    public async Task<AuctionDetailResponse> UpdateAsync(UpdateAuctionRequest request, int auctionId, int userId, CancellationToken cancellationToken = default)
    {
        var auction = await _repo.GetByIdAsync(auctionId, cancellationToken)
            ?? throw new AuctionNotFoundException();

        if (auction.UserId != userId)
            throw new ForbiddenException();

        auction.Title = request.Title;
        auction.Description = request.Description;
        auction.ImageUrl = request.ImageUrl;

        await _repo.UpdateAsync(auction, cancellationToken);

        var updatedAuction = await _repo.GetByIdAsync(auction.AuctionId, cancellationToken)
            ?? throw new AuctionNotFoundException();

        return AuctionMapper.ToDetailResponse(updatedAuction);
    }
}
