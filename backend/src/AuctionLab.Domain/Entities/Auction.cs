namespace AuctionLab.Domain.Entities;

public class Auction
{
    public int AuctionId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal StartingPrice { get; set; }
    public decimal? ReservationPrice { get; set; }
    public DateTimeOffset StartTime { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset EndTime { get; set; }
    public DateTimeOffset? InactivatedAt { get; set; }

    public bool IsOpen => EndTime > DateTimeOffset.UtcNow && InactivatedAt == null;
    public bool IsClosed => EndTime <= DateTimeOffset.UtcNow;
    public bool IsActive => InactivatedAt == null;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public List<Bid> Bids { get; set; } = [];
}
