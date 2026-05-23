using AuctionLab.Application.Auctions.DTOs;
using AuctionLab.Application.Bids.DTOs;
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
        ImageUrl = auction.ImageUrl,
        Bids = auction.IsOpen || auction.Bids.Count == 0
            ? auction.Bids.Select(b => new BidSummaryResponse
                {
                    BidId = b.BidId,
                    Amount = b.Amount,
                    CreatedAt = b.CreatedAt,
                    BidderUsername = b.User.UserName
                }).ToList()
            : auction.Bids
                .Where(b => b.Amount == auction.Bids.Max(x => x.Amount))
                .Select(b => new BidSummaryResponse
                {
                    BidId = b.BidId,
                    Amount = b.Amount,
                    CreatedAt = b.CreatedAt,
                    BidderUsername = b.User.UserName
                })
                .Take(1)
                .ToList()
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
        BidCount = auction.Bids.Count,
        ImageUrl = auction.ImageUrl,
        IsOpen = auction.IsOpen
    };
}
