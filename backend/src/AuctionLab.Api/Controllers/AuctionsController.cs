using AuctionLab.Application.Auctions;
using AuctionLab.Application.Auctions.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AuctionLab.Application.Auctions.Exceptions;
using AuctionLab.Domain.Enums;
using AuctionLab.Application.Common;

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
    public async Task<ActionResult<PagedResponse<AuctionSummaryResponse>>> GetAuctions(
        [FromQuery] string? search, 
        [FromQuery] AuctionStatus? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var resolvedStatus = status ?? AuctionStatus.Open;
        var response = await _service.SearchAsync(search, resolvedStatus, page, pageSize, cancellationToken);
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AuctionDetailResponse>> GetAuction(int id, CancellationToken cancellationToken = default)
    {
        var response = await _service.GetByIdAsync(id, cancellationToken);

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

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<List<AuctionSummaryResponse>>> GetMyAuctions(
        [FromQuery] AuctionStatus? status, 
        [FromQuery] string? search = null, 
        CancellationToken cancellationToken = default)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();

        var resolvedStatus = status ?? AuctionStatus.All;
        var response = await _service.GetByUserIdAsync(userId, resolvedStatus, search, cancellationToken);

        return Ok(response);
    }
}
