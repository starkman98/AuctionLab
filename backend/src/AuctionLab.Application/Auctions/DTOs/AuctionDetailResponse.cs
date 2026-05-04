namespace AuctionLab.Application.Auctions.DTOs;

public sealed class AuctionDetailResponse
{
    public int AuctionId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string OwnerUsername { get; set; } = string.Empty;
    public int OwnerId { get; set; }
    public decimal StartingPrice { get; set; }
    public decimal? CurrentHighestBid { get; set; }
    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset EndTime { get; set; }
    public bool IsOpen { get; set; }
    public List<BidSummaryResponse> Bids { get; set; } = [];
}
