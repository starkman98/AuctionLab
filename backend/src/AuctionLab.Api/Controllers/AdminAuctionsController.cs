using AuctionLab.Application.Admin;
using AuctionLab.Application.Admin.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace AuctionLab.Api.Controllers
{
    [Route("api/admin/auctions")]
    public class AdminAuctionsController : AdminControllerBase
    {
        private readonly IAdminAuctionService _service;

        public AdminAuctionsController(IAdminAuctionService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<AdminAuctionResponse>>> GetAuctions(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken cancellationToken = default)
        {
            var response = await _service.GetAllAsync(page, pageSize, cancellationToken);

            return Ok(response);
        }

        [HttpPut("{auctionId}/inactivate")]
        public async Task<ActionResult<AdminAuctionResponse>> Inactivate(int auctionId, CancellationToken cancellationToken = default)
        {
            var response = await _service.InactivateAsync(auctionId, cancellationToken);

            return Ok(response);
        }

        [HttpPut("{auctionId}/activate")]
        public async Task<ActionResult<AdminAuctionResponse>> Reactivate(int auctionId, CancellationToken cancellationToken = default)
        {
            var response = await _service.ReactivateAsync(auctionId, cancellationToken);

            return Ok(response);
        }
    }
}
