using AuctionLab.Application.Admin.DTOs;
using AuctionLab.Domain.Entities;

namespace AuctionLab.Application.Admin;

public static class AdminMapper
{
    public static AdminUserResponse ToUserResponse(User user) => new()
    {
        UserId = user.UserId,
        FirstName = user.FirstName,
        LastName = user.LastName,
        UserName = user.UserName,
        Email = user.Email,
        Role = user.Role,
        IsActive = user.IsActive,
        CreatedAt = user.CreatedAt,
        InactivatedAt = user.InactivatedAt
    };

    public static AdminAuctionResponse ToAuctionResponse(Auction auction) => new()
    {
        AuctionId = auction.AuctionId,
        Title = auction.Title,
        StartingPrice = auction.StartingPrice,
        CurrentHighestBid = auction.Bids.Count > 0 ? auction.Bids.Max(b => b.Amount) : null,
        StartTime = auction.StartTime,
        EndTime = auction.EndTime,
        OwnerUsername = auction.User.UserName,
        BidCount = auction.Bids.Count,
        IsActive = auction.IsActive,
        IsOpen = auction.IsOpen,
        InactivatedAt = auction.InactivatedAt,
        OwnerId = auction.UserId,
        ImageUrl = auction.ImageUrl
    };
}
