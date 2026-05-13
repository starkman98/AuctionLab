using AuctionLab.Application.Admin.DTOs;
using AuctionLab.Application.Admin.Exceptions;
using AuctionLab.Application.Repositories;
using AuctionLab.Application.Users.Exceptions;
using AuctionLab.Domain.Constants;

namespace AuctionLab.Application.Admin;

public class AdminUserService : IAdminUserService
{
    private readonly IUserRepository _repo;

    public AdminUserService(IUserRepository repo)
    {
        _repo = repo;
    }

    public async Task<AdminUserResponse> ChangeRoleAsync(int userId, ChangeRoleRequest request, CancellationToken cancellationToken = default)
    {
        if (!UserRoles.IsValid(request.Role))
            throw new InvalidRoleException(request.Role);

        var user = await _repo.GetByIdAsync(userId, cancellationToken)
            ?? throw new UserNotFoundException();

        user.Role = request.Role;

        await _repo.UpdateAsync(user, cancellationToken);

        return AdminMapper.ToUserResponse(user);
    }

    public async Task<AdminUserResponse> InactivateAsync(int userId, CancellationToken cancellationToken = default)
    {
        var user = await _repo.GetByIdAsync(userId, cancellationToken)
            ?? throw new UserNotFoundException();

        if (user.InactivatedAt is not null)
            return AdminMapper.ToUserResponse(user);

        user.InactivatedAt = DateTimeOffset.UtcNow;

        await _repo.UpdateAsync(user, cancellationToken);

        return AdminMapper.ToUserResponse(user);
    }

    public async Task<List<AdminUserResponse>> GetAllAsync(int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var users = await _repo.GetAllAsync(page, pageSize, cancellationToken);

        return users.Select(user => AdminMapper.ToUserResponse(user)).ToList();
    }

    public async Task<AdminUserResponse> ReactivateAsync(int userId, CancellationToken cancellationToken = default)
    {
        var user = await _repo.GetByIdAsync(userId, cancellationToken)
            ?? throw new UserNotFoundException();

        if (user.InactivatedAt is null)
            return AdminMapper.ToUserResponse(user);

        user.InactivatedAt = null;

        await _repo.UpdateAsync(user, cancellationToken);

        return AdminMapper.ToUserResponse(user);
    }
}
