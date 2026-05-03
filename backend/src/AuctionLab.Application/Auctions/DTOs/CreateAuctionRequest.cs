namespace AuctionLab.Application.Auctions.DTOs;

public sealed class CreateAuctionRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal StartingPrice { get; set; }
    public decimal ReservationPrice { get; set; }
    public DateTimeOffset EndTime { get; set; }
}
