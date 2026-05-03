using AuctionLab.Application.Users.DTOs;

namespace AuctionLab.Application.Users;

public interface IUserService
{
    Task ChangePasswordAsync(ChangePasswordRequest request, int userId, CancellationToken cancellationToken = default);
    Task<GetMeResponse> GetMeById(int userId, CancellationToken cancellationToken = default);
}
