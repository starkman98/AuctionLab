namespace AuctionLab.Application.Bids.DTOs;

public sealed class BidSummaryResponse
{
    public int BidId { get; set; }
    public decimal Amount { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public string BidderUsername { get; set; } = string.Empty;
}
