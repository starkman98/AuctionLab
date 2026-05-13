using AuctionLab.Application.Admin;
using AuctionLab.Application.Admin.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace AuctionLab.Api.Controllers
{
    [Route("api/admin/auctions")]
    public class AdminAuctionController : AdminControllerBase
    {
        private readonly IAdminAuctionService _service;

        public AdminAuctionController(IAdminAuctionService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<AdminAuctionResponse>>> GetAuctions(
            [FromQuery] int page,
            [FromQuery] int pageSize,
            CancellationToken cancellationToken = default)
        {
            var response = await _service.GetAllAsync(page, pageSize, cancellationToken);

            return Ok(response);
        }

        [HttpDelete("{auctionId}")]
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
