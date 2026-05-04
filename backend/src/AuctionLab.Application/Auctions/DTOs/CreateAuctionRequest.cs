using System.ComponentModel.DataAnnotations;

namespace AuctionLab.Application.Auctions.DTOs;

public sealed class CreateAuctionRequest
{
    [Required]
    [MinLength(2)]
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(4000)]
    public string Description { get; set; } = string.Empty;

    [Range(0, double.MaxValue, ErrorMessage ="Starting price must be positive")]
    public decimal StartingPrice { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Reservation price must be positive")]
    public decimal? ReservationPrice { get; set; }
    public DateTimeOffset EndTime { get; set; }
}
