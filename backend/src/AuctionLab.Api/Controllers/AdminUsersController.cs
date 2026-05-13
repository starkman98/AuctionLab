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
            [FromQuery] int page, 
            [FromQuery] int pageSize, 
            CancellationToken cancellationToken = default)
        {
            var response = await _service.GetAllAsync(page, pageSize, cancellationToken);

            return Ok(response);
        }

        [HttpPut("{userId}/role")]
        public async Task<ActionResult<AdminUserResponse>> ChangeRole(
            int userId, 
            [FromBody] ChangeRoleRequest request, 
            CancellationToken cancellationToken = default)
        {
            var response = await _service.ChangeRoleAsync(userId, request, cancellationToken);

            return Ok(response);
        }

        [HttpDelete("{userId}")]
        public async Task<ActionResult<AdminUserResponse>> Inactivate(int userId, CancellationToken cancellationToken = default)
        {
            var response = await _service.InactivateAsync(userId, cancellationToken);

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
