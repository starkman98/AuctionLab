namespace AuctionLab.Application.Auctions.DTOs;

public sealed class UpdateAuctionRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
