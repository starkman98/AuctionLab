using AuctionLab.Domain.Constants;

namespace AuctionLab.Domain.Entities;

public class User
{
    public int UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = UserRoles.User;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? InactivatedAt { get; set; }
    public bool IsActive => InactivatedAt == null;

    public List<Auction> Auctions { get; set; } = [];
    public List<Bid> Bids { get; set; } = [];

}
