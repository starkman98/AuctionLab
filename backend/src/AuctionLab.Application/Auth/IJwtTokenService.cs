using AuctionLab.Domain.Entities;

namespace AuctionLab.Application.Auth;

public interface IJwtTokenService
{
    string CreateToken(User user);
    DateTime GetExpirationTimeUtc(string token);
}
