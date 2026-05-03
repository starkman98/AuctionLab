using AuctionLab.Application.Users;
using AuctionLab.Application.Users.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuctionLab.Api.Controllers
{
    [Authorize]
    public class UsersController : AppControllerBase
    {
        private readonly IUserService _service;

        public UsersController(IUserService service)
        {
            _service = service;
        }

        [HttpGet("me")]
        public async Task<ActionResult<GetMeResponse>> GetMe(CancellationToken cancellationToken)
        {
            if (!TryGetUserId(out var userId))
                return Unauthorized();

            var response = await _service.GetMeById(userId, cancellationToken);

            return Ok(response);
        }

        [HttpPut("me/password")]
        public async Task<ActionResult> ChangePasswordAsync([FromBody] ChangePasswordRequest request, CancellationToken cancellationToken)
        {
            if (!TryGetUserId(out var userId))
                return Unauthorized();

            await _service.ChangePasswordAsync(request, userId, cancellationToken);

            return NoContent();
        }
    }
}
