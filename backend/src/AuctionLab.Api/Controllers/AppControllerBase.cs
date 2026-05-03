using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AuctionLab.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppControllerBase : ControllerBase
    {
        protected bool TryGetUserId(out int userId)
            => int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out userId);
    }
}
