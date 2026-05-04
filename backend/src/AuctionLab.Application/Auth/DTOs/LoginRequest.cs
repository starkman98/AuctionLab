using System.ComponentModel.DataAnnotations;

namespace AuctionLab.Application.Auth.DTOs;

public sealed class LoginRequest
{
    [Required]
    [MinLength(2)]
    [MaxLength(30)]
    public string UserName { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    [MaxLength(254)]
    public string Password { get; set; } = string.Empty;
}
