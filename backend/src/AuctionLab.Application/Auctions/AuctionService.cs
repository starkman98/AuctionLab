using AuctionLab.Application.Auctions.DTOs;
using AuctionLab.Application.Auctions.Exceptions;
using AuctionLab.Application.Repositories;
using AuctionLab.Application.Users.Exceptions;
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
        var newAuction = new Auction
        {
            Title = request.Title,
            Description = request.Description,
            StartingPrice = request.StartingPrice,
            ReservationPrice = request.StartingPrice,
            EndTime = request.EndTime,
            UserId = userId
        };

        await _auctionRepo.AddAsync(newAuction, cancellationToken);

        var owner = await _userRepo.GetByIdAsync(userId, cancellationToken)
            ?? throw new UserNotFoundException();

        return new AuctionDetailResponse
        {
            AuctionId = newAuction.AuctionId,
            Title = newAuction.Title,
            Description = newAuction.Description,
            StartingPrice = newAuction.StartingPrice,
            StartTime = newAuction.StartTime,
            EndTime = newAuction.EndTime,
            IsOpen = newAuction.IsOpen,
            OwnerUsername = owner.UserName,
            OwnerId = userId
        };
    }

    public async Task<AuctionDetailResponse> GetByIdAsync(int auctionId, CancellationToken cancellationToken = default)
    {
        var auction = await _auctionRepo.GetByIdAsync(auctionId, cancellationToken)
            ?? throw new AuctionNotFoundException();

        var user = await _userRepo.GetByIdAsync(auction.UserId, cancellationToken)
            ?? throw new UserNotFoundException();

        return new AuctionDetailResponse
        {
            Title = auction.Title,
            Description = auction.Description,
            OwnerUsername = user.UserName,
            EndTime = auction.EndTime
        };
    }

    public async Task<List<AuctionSummaryResponse>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default)
    {
        var auctions = await _auctionRepo.GetByUserIdAsync(userId, cancellationToken);

        var auctionsResponse = new List<AuctionSummaryResponse>();

        foreach (var auction in auctions)
        {
            auctionsResponse.Add(new AuctionSummaryResponse
            {
                Title = auction.Title,
                EndTime = auction.EndTime
            });
        }

        return auctionsResponse;
    }

    public async Task<List<AuctionSummaryResponse>> GetOpenAsync(string? search, CancellationToken cancellationToken = default)
    {
        var auctions = await _auctionRepo.GetOpenAsync(search, cancellationToken);

        var auctionsResponse = new List<AuctionSummaryResponse>();

        foreach (var auction in auctions)
        {
            auctionsResponse.Add(new AuctionSummaryResponse
            {
                Title = auction.Title,
                EndTime = auction.EndTime
            });
        }

        return auctionsResponse;
    }

    public async Task<AuctionDetailResponse> UpdateAsync(UpdateAuctionRequest request, int auctionId, int userId, CancellationToken cancellationToken = default)
    {
        var auction = await _auctionRepo.GetByIdAsync(auctionId)
            ?? throw new AuctionNotFoundException();

        auction.Title = request.Title;
        auction.Description = request.Description;

        await _auctionRepo.UpdateAsync(auction);

        var user = await _userRepo.GetByIdAsync(userId)
            ?? throw new UserNotFoundException();

        return new AuctionDetailResponse
        {
            AuctionId = auction.AuctionId,
            Title = auction.Title,
            Description = auction.Description,
            OwnerUsername = user.UserName,
            OwnerId = auction.UserId,
            StartingPrice = auction.StartingPrice,
            StartTime = auction.StartTime,
            EndTime = auction.EndTime,
            IsOpen = auction.IsOpen
        };
    }
}
