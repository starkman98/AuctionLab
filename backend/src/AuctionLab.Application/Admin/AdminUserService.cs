using AuctionLab.Application.Admin.DTOs;
using AuctionLab.Application.Admin.Exceptions;
using AuctionLab.Application.Auctions.Exceptions;
using AuctionLab.Application.Repositories;
using AuctionLab.Domain.Constants;

namespace AuctionLab.Application.Admin;

public class AdminUserService : IAdminUserService
{
    private readonly IUserRepository _repo;

    public AdminUserService(IUserRepository repo)
    {
        _repo = repo;
    }

    public async Task<AdminUserResponse> ChangeRoleAsync(int userId, int requestingAdminId, ChangeRoleRequest request, CancellationToken cancellationToken = default)
    {
        if (!UserRoles.IsValid(request.Role))
            throw new InvalidRoleException(request.Role);

        if (userId == requestingAdminId)
            throw new ForbiddenException();

        var user = await _repo.GetByIdIncludingInactiveAsync(userId, cancellationToken)
            ?? throw new AdminUserNotFoundException();

        if (user.Role == UserRoles.Admin)
            throw new ForbiddenException();

        user.Role = request.Role;

        await _repo.UpdateAsync(user, cancellationToken);

        return AdminMapper.ToUserResponse(user);
    }

    public async Task<AdminUserResponse> InactivateAsync(int userId, int requestingAdminId, CancellationToken cancellationToken = default)
    {
        if (userId == requestingAdminId)
            throw new ForbiddenException();

        var user = await _repo.GetByIdIncludingInactiveAsync(userId, cancellationToken)
            ?? throw new AdminUserNotFoundException();

        if (user.Role == UserRoles.Admin)
            throw new ForbiddenException();

        if (user.InactivatedAt is not null)
            return AdminMapper.ToUserResponse(user);

        user.InactivatedAt = DateTimeOffset.UtcNow;

        await _repo.UpdateAsync(user, cancellationToken);

        return AdminMapper.ToUserResponse(user);
    }

    public async Task<List<AdminUserResponse>> GetAllAsync(int page, int pageSize, CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var users = await _repo.GetAllAsync(page, pageSize, cancellationToken);

        return users.Select(user => AdminMapper.ToUserResponse(user)).ToList();
    }

    public async Task<AdminUserResponse> ReactivateAsync(int userId, CancellationToken cancellationToken = default)
    {
        var user = await _repo.GetByIdIncludingInactiveAsync(userId, cancellationToken)
            ?? throw new AdminUserNotFoundException();

        if (user.InactivatedAt is null)
            return AdminMapper.ToUserResponse(user);

        user.InactivatedAt = null;

        await _repo.UpdateAsync(user, cancellationToken);

        return AdminMapper.ToUserResponse(user);
    }
}
