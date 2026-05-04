using System.ComponentModel.DataAnnotations;

namespace AuctionLab.Application.Auth.DTOs;

public sealed class RegisterRequest
{
    [Required]
    [MinLength(2)]
    [MaxLength(50)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MinLength(2)]
    [MaxLength(50)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [MinLength(2)]
    [MaxLength(30)]
    public string UserName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(254)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    [MaxLength(254)]
    public string Password { get; set; } = string.Empty;
}
