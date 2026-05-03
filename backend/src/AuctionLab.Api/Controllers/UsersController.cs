using AuctionLab.Application.Users;
using AuctionLab.Application.Users.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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
        public async Task<ActionResult<GetMeResponse>> GetMe()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!TryGetUserId(out var userId))
                return Unauthorized();

            var response = await _service.GetMeById(userId);

            return Ok(response);
        }

        [HttpPut("me/password")]
        public async Task<ActionResult> ChangePasswordAsync([FromBody] ChangePasswordRequest request)
        {
            if (!TryGetUserId(out var userId))
                return Unauthorized();

            await _service.ChangePasswordAsync(request, userId);

            return Ok();
        }
    }
}
