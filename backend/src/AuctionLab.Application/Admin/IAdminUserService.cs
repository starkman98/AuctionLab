using AuctionLab.Application.Admin.DTOs;

namespace AuctionLab.Application.Admin;

public interface IAdminUserService
{
    Task<List<AdminUserResponse>> GetAllAsync(int page, int pageSize, string? search = null, CancellationToken cancellationToken = default);
    Task<AdminUserResponse> ChangeRoleAsync(int userId, int requestingAdminId, ChangeRoleRequest request, CancellationToken cancellationToken = default);
    Task<AdminUserResponse> InactivateAsync(int userId, int requestingAdminId, CancellationToken cancellationToken = default);
    Task<AdminUserResponse> ReactivateAsync(int userId, CancellationToken cancellationToken = default);
}
