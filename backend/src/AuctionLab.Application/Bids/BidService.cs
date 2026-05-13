using AuctionLab.Application.Auctions.Exceptions;
using AuctionLab.Application.Bids.DTOs;
using AuctionLab.Application.Bids.Exceptions;
using AuctionLab.Application.Repositories;
using AuctionLab.Domain.Entities;

namespace AuctionLab.Application.Bids;

public class BidService : IBidService
{
    private readonly IBidRepository _repo;
    private readonly IAuctionRepository _auctionRepo;
    public BidService(IBidRepository repo, IAuctionRepository auctionRepo)
    {
        _repo = repo;
        _auctionRepo = auctionRepo;
    }

    public async Task<List<BidSummaryResponse>> GetBidsForAuctionAsync(int auctionId, CancellationToken cancellationToken = default)
    {
        var bids = await _repo.GetByAuctionIdAsync(auctionId, cancellationToken);

        return bids.Select(b => new BidSummaryResponse
        {
            BidId = b.BidId,
            Amount = b.Amount,
            CreatedAt = b.CreatedAt,
            BidderUsername = b.User.UserName
        }).ToList();
    }

    public async Task<BidSummaryResponse> PlaceBidAsync(PlaceBidRequest request, int auctionId, int userId, CancellationToken cancellationToken = default)
    {
        var auction = await _auctionRepo.GetByIdAsync(auctionId, cancellationToken)
            ?? throw new AuctionNotFoundException();

        if (!auction.IsOpen)
            throw new AuctionNotOpenException();

        if (auction.UserId == userId)
            throw new CanNotBidOnOwnAuctionException();

        var currentHighestBid = auction.Bids.OrderByDescending(b => b.Amount).FirstOrDefault();

        if (currentHighestBid == null)
        {
            if (request.Amount < auction.StartingPrice)
                throw new BidTooLowException();
        }
        else
        {
            if (request.Amount <= currentHighestBid.Amount)
                throw new BidTooLowException();
        }

        var bid = new Bid
        {
            Amount = request.Amount,
            CreatedAt = DateTimeOffset.UtcNow,
            UserId = userId,
            AuctionId = auctionId
        };

        auction.LastBidAt = bid.CreatedAt;

        await _repo.AddAsync(bid, cancellationToken);

        var savedBid = await _repo.GetByIdAsync(bid.BidId, cancellationToken)
            ?? throw new BidNotFoundException();

        return new BidSummaryResponse
        {
            BidId = savedBid.BidId,
            Amount = savedBid.Amount,
            CreatedAt = savedBid.CreatedAt,
            BidderUsername = savedBid.User.UserName
        };
    }

    public async Task RetractBidAsync(int bidId, int userId, CancellationToken cancellationToken = default)
    {
        var bid = await _repo.GetByIdAsync(bidId, cancellationToken)
            ?? throw new BidNotFoundException();

        if (bid.UserId != userId)
            throw new NotBidOwnerException();

        var latestBid = await _repo.GetLatestByAuctionIdAsync(bid.AuctionId, cancellationToken)
            ?? throw new BidNotFoundException();

        if (bid.BidId != latestBid.BidId)
            throw new NotLatestBidException();

        var auction = await _auctionRepo.GetByIdAsync(bid.AuctionId, cancellationToken)
            ?? throw new AuctionNotFoundException();

        if (!auction.IsOpen)
            throw new AuctionNotOpenException();

        var previousBid = auction.Bids
            .Where(b => b.BidId != bidId)
            .OrderByDescending(b => b.Amount)
            .FirstOrDefault();

        auction.LastBidAt = previousBid?.CreatedAt;

        await _repo.DeleteAsync(bid, cancellationToken);
    }
}
