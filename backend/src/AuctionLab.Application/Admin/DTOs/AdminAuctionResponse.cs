namespace AuctionLab.Application.Admin.DTOs;

public sealed class AdminAuctionResponse
{
    public int AuctionId { get; set; }
    public string Title { get; set; } = string.Empty;
    public decimal StartingPrice { get; set; }
    public decimal? CurrentHighestBid { get; set; }
    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset EndTime { get; set; }
    public string OwnerUsername { get; set; } = string.Empty;
    public int BidCount { get; set; }
    public bool IsActive { get; set; }
    public DateTimeOffset? InactivatedAt { get; set; }
    public int OwnerId { get; set; }
}
