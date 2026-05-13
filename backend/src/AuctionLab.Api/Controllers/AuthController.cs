using AuctionLab.Application.Auth;
using AuctionLab.Application.Auth.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AuctionLab.Api.Controllers
{
    public class AuthController : AppControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
        {
            var response = await _authService.RegisterAsync(request, cancellationToken);

            return StatusCode(201, response);
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
        {
            var response = await _authService.LoginAsync(request, cancellationToken);

            return Ok(response);
        }
    }
}
