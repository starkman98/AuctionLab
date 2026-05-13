using Microsoft.AspNetCore.Authorization;

namespace AuctionLab.Api.Controllers
{
    [Authorize(Roles = "Admin")]
    public abstract class AdminControllerBase : AppControllerBase
    {
    }
}
