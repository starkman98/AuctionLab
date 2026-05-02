namespace AuctionLab.Domain.Entities;

public class Bid
{
    public int BidId { get; set; }
    public decimal Amount { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int AuctionId { get; set; }
    public Auction Auction { get; set; } = null!;
}
