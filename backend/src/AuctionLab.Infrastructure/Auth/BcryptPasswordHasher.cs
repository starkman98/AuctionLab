using AuctionLab.Application.Auth;

namespace AuctionLab.Infrastructure.Auth;

public class BcryptPasswordHasher : IPasswordHasher
{
    public string Hash(string password)
        => BC.HashPassword(password);

    public bool Verify(string password, string hash)
        => BC.Verify(password, hash);
}
