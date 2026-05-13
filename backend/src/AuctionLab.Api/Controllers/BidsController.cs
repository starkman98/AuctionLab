using AuctionLab.Application.Bids;
using AuctionLab.Application.Bids.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuctionLab.Api.Controllers;

public class BidsController : AppControllerBase
{
    private readonly IBidService _service;

    public BidsController(IBidService service)
    {
        _service = service;
    }

    [HttpGet("/api/auctions/{auctionId}/bids")]
    public async Task<ActionResult<List<BidSummaryResponse>>> GetAuctionBids(int auctionId, CancellationToken cancellationToken = default)
    {
        var response = await _service.GetBidsForAuctionAsync(auctionId, cancellationToken);

        return Ok(response);
    }

    [Authorize]
    [HttpPost("/api/auctions/{auctionId}/bids")]
    public async Task<ActionResult<BidSummaryResponse>> PlaceBid(PlaceBidRequest request, int auctionId, CancellationToken cancellationToken = default)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        var response = await _service.PlaceBidAsync(request, auctionId, userId, cancellationToken);

        return CreatedAtAction(nameof(PlaceBid), new { id = response.BidId }, response);
    }

    [Authorize]
    [HttpDelete("{bidId}")]
    public async Task<IActionResult> RetractBid(int bidId, CancellationToken cancellationToken = default)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        await _service.RetractBidAsync(bidId, userId, cancellationToken);

        return NoContent();
    }
}
