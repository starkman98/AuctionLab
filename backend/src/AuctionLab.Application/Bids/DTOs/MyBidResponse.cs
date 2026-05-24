namespace AuctionLab.Application.Bids.DTOs;

public sealed class MyBidResponse
{
    public int AuctionId { get; set; }
    public string AuctionTitle { get; set; } = string.Empty;
    public DateTimeOffset EndTime { get; set; }
    public bool IsOpen { get; set; }
    public decimal MyBidAmount { get; set; }
    public decimal? CurrentHighestBid { get; set; }
    public bool IsWinning { get; set; }
    public string? ImageUrl { get; set; }
}