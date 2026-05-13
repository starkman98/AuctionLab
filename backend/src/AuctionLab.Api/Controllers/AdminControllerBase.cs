using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AuctionLab.Api.Controllers
{
    [Authorize(Roles = "Admin")]
    public abstract class AdminControllerBase : AppControllerBase
    {
    }
}
