using System.ComponentModel.DataAnnotations;

namespace AuctionLab.Application.Users.DTOs;

public sealed class ChangePasswordRequest
{
    [Required]
    [MinLength(8)]
    [MaxLength(254)]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    [MaxLength(254)]
    public string NewPassword { get; set; } = string.Empty;
}
