using AuctionLab.Application.Auctions;
using AuctionLab.Application.Auctions.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AuctionLab.Application.Users.Exceptions;
using AuctionLab.Application.Auctions.Exceptions;

namespace AuctionLab.Api.Controllers;

public class AuctionsController : AppControllerBase
{
    private readonly IAuctionService _service;

    public AuctionsController(IAuctionService service)
    {
        _service = service;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<AuctionDetailResponse>> CreateAuction([FromBody] CreateAuctionRequest request, CancellationToken cancellationToken = default)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        var response = await _service.CreateAsync(request, userId, cancellationToken);

        return CreatedAtAction(nameof(GetAuction), new { id = response.AuctionId }, response);
    }

    [HttpGet]
    public async Task<ActionResult<List<AuctionSummaryResponse>>> GetAuctions([FromQuery] string? search, CancellationToken cancellationToken = default)
    {
        var response = await _service.GetOpenAsync(search, cancellationToken);
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AuctionDetailResponse>> GetAuction(int id, CancellationToken cancellationToken = default)
    {
        var response = await _service.GetByIdAsync(id, cancellationToken)
            ?? throw new AuctionNotFoundException();

        return Ok(response);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<AuctionDetailResponse>> UpdateAuction(
        int id, [FromBody] UpdateAuctionRequest request, CancellationToken cancellationToken = default)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        var response = await _service.UpdateAsync(request, id, userId, cancellationToken);
        return Ok(response);
    }
}
