using System.ComponentModel.DataAnnotations;

namespace AuctionLab.Application.Auctions.DTOs;

public sealed class UpdateAuctionRequest
{
    [Required]
    [MinLength(2)]
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(4000)]
    public string Description { get; set; } = string.Empty;
}
