using AuctionLab.Application.Admin;
using AuctionLab.Application.Admin.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace AuctionLab.Api.Controllers
{
    [Route("api/admin/users")]
    public class AdminUsersController : AdminControllerBase
    {
        private readonly IAdminUserService _service;

        public AdminUsersController(IAdminUserService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<AdminUserResponse>>> GetUsers(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 20,
            [FromQuery] string? search = null, 
            CancellationToken cancellationToken = default)
        {
            var response = await _service.GetAllAsync(page, pageSize, search, cancellationToken);

            return Ok(response);
        }

        [HttpPut("{userId}/role")]
        public async Task<ActionResult<AdminUserResponse>> ChangeRole(
            int userId, 
            [FromBody] ChangeRoleRequest request, 
            CancellationToken cancellationToken = default)
        {
            if (!TryGetUserId(out int requestingAdminId))
                return Unauthorized();

            var response = await _service.ChangeRoleAsync(userId, requestingAdminId, request, cancellationToken);

            return Ok(response);
        }

        [HttpPut("{userId}/inactivate")]
        public async Task<ActionResult<AdminUserResponse>> Inactivate(int userId, CancellationToken cancellationToken = default)
        {
            if (!TryGetUserId(out int requestingAdminId))
                return Unauthorized();

            var response = await _service.InactivateAsync(userId, requestingAdminId, cancellationToken);

            return Ok(response);
        }

        [HttpPut("{userId}/activate")]
        public async Task<ActionResult<AdminUserResponse>> Reactivate(int userId, CancellationToken cancellationToken = default)
        {
            var response = await _service.ReactivateAsync(userId, cancellationToken);

            return Ok(response);
        }
    }
}
