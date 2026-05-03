using AuctionLab.Application.Auth;
using AuctionLab.Application.Repositories;
using AuctionLab.Application.Users.DTOs;
using AuctionLab.Application.Users.Exceptions;
using AuctionLab.Application.Auth.Exceptions;

namespace AuctionLab.Application.Users;

public class UserService : IUserService
{
    private readonly IUserRepository _repo;
    private readonly IPasswordHasher _hasher;

    public UserService(IUserRepository repo, IPasswordHasher hasher)
    {
        _repo = repo;
        _hasher = hasher;
    }

    public async Task ChangePasswordAsync(ChangePasswordRequest request, int userId)
    {
        var user = await _repo.GetByIdAsync(userId)
            ?? throw new UserNotFoundException();

        if (!_hasher.Verify(request.CurrentPassword, user.PasswordHash))
            throw new InvalidCredentialsException();

        var newPasswordHash = _hasher.Hash(request.NewPassword);

        await _repo.UpdatePasswordHash(userId, newPasswordHash);
    }

    public async Task<GetMeResponse> GetMeById(int userId)
    {
        var user = await _repo.GetByIdAsync(userId)
            ?? throw new UserNotFoundException();

        return new GetMeResponse
        {
            UserId = user.UserId,
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserName = user.UserName,
            Email = user.Email,
            Role = user.Role,
            CreatedAt = user.CreatedAt
        };
    }
}
