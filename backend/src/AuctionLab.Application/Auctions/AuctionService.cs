using AuctionLab.Application.Auctions.DTOs;
using AuctionLab.Application.Auctions.Exceptions;
using AuctionLab.Application.Repositories;
using AuctionLab.Domain.Entities;

namespace AuctionLab.Application.Auctions;

public class AuctionService : IAuctionService
{
    private readonly IAuctionRepository _auctionRepo;
    private readonly IUserRepository _userRepo; 

    public AuctionService(IAuctionRepository auctionRepo, IUserRepository userRepo)
    {
        _auctionRepo = auctionRepo;
        _userRepo = userRepo;
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
            UserId = userId
        };

        await _auctionRepo.AddAsync(newAuction, cancellationToken);

        var createdAuction = await _auctionRepo.GetByIdAsync(newAuction.AuctionId, cancellationToken)
            ?? throw new AuctionNotFoundException();

        return AuctionMapper.ToDetailResponse(createdAuction);
    }

    public async Task<AuctionDetailResponse> GetByIdAsync(int auctionId, CancellationToken cancellationToken = default)
    {
        var auction = await _auctionRepo.GetByIdAsync(auctionId, cancellationToken)
            ?? throw new AuctionNotFoundException();

        return AuctionMapper.ToDetailResponse(auction);
    }

    public async Task<List<AuctionSummaryResponse>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default)
    {
        var auctions = await _auctionRepo.GetByUserIdAsync(userId, cancellationToken);

        var auctionsResponse = new List<AuctionSummaryResponse>();

        foreach (var auction in auctions)
        {
            auctionsResponse.Add(AuctionMapper.ToSummaryResponse(auction));
        }

        return auctionsResponse;
    }

    public async Task<List<AuctionSummaryResponse>> GetOpenAsync(string? search, CancellationToken cancellationToken = default)
    {
        var auctions = await _auctionRepo.GetOpenAsync(search, cancellationToken);

        var auctionsResponse = new List<AuctionSummaryResponse>();

        foreach (var auction in auctions)
        {
            auctionsResponse.Add(AuctionMapper.ToSummaryResponse(auction));
        }

        return auctionsResponse;
    }

    public async Task<AuctionDetailResponse> UpdateAsync(UpdateAuctionRequest request, int auctionId, int userId, CancellationToken cancellationToken = default)
    {
        var auction = await _auctionRepo.GetByIdAsync(auctionId, cancellationToken)
            ?? throw new AuctionNotFoundException();

        if (auction.UserId != userId)
            throw new ForbiddenException();

        auction.Title = request.Title;
        auction.Description = request.Description;

        await _auctionRepo.UpdateAsync(auction, cancellationToken);

        var updatedAuction = await _auctionRepo.GetByIdAsync(auction.AuctionId, cancellationToken)
            ?? throw new AuctionNotFoundException();

        return AuctionMapper.ToDetailResponse(updatedAuction);
    }
}
