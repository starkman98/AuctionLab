using AuctionLab.Application.Auctions.DTOs;
using AuctionLab.Domain.Entities;

namespace AuctionLab.Application.Auctions;

public static class AuctionMapper
{
    public static AuctionDetailResponse ToDetailResponse(Auction auction) => new()
    {
        AuctionId = auction.AuctionId,
        Title = auction.Title,
        Description = auction.Description,
        OwnerUsername = auction.User.UserName,
        OwnerId = auction.UserId,
        StartingPrice = auction.StartingPrice,
        CurrentHighestBid = auction.Bids.Count > 0 ? auction.Bids.Max(b => b.Amount) : null,
        StartTime = auction.StartTime,
        EndTime = auction.EndTime,
        IsOpen = auction.IsOpen,
        Bids = auction.Bids.Select(b => new BidSummaryResponse
        {
            BidId = b.BidId,
            Amount = b.Amount,
            CreatedAt = b.CreatedAt,
            BidderUsername = b.User.UserName
        }).ToList()
    };

    public static AuctionSummaryResponse ToSummaryResponse(Auction auction) => new()
    {
        AuctionId = auction.AuctionId,
        Title = auction.Title,
        StartingPrice = auction.StartingPrice,
        CurrentHighestBid = auction.Bids.Count > 0 ? auction.Bids.Max(b => b.Amount) : null,
        StartTime = auction.StartTime,
        EndTime = auction.EndTime,
        OwnerUsername = auction.User.UserName,
        BidCount = auction.Bids.Count
    };
}
