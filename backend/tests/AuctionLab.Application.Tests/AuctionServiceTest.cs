using AuctionLab.Application.Auctions;
using AuctionLab.Application.Auctions.DTOs;
using AuctionLab.Application.Auctions.Exceptions;
using AuctionLab.Application.Repositories;
using AuctionLab.Domain.Entities;
using Moq;

namespace AuctionLab.Application.Tests;

public class AuctionServiceTest
{
    private readonly Mock<IAuctionRepository> _auctionRepoMock = new();

    private AuctionService CreateService() => new(_auctionRepoMock.Object);

    [Fact]
    public async Task CreateAsync_WhenEndTimeLessThanOneHourAhead_ThrowsInvalidAuctionEndTimeException()
    {
        var service = CreateService();

        await Assert.ThrowsAsync<InvalidAuctionEndtimeException>(() =>
            service.CreateAsync(new CreateAuctionRequest
            {
                EndTime = DateTimeOffset.UtcNow.AddMinutes(10),
            }, 1));

    }

    [Fact]
    public async Task GetByIdAsync_WhenNotFound_ThrowsAuctionNotFoundException()
    {
        _auctionRepoMock
            .Setup(r => r.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Auction?)null);

        var service = CreateService();

        await Assert.ThrowsAsync<AuctionNotFoundException>(() =>
            service.GetByIdAsync(1));
    }

    [Fact]
    public async Task UpdateAsync_WhenNotFound_ThrowsAuctionNotFoundException()
    {
        _auctionRepoMock
            .Setup(r => r.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Auction?)null);

        var service = CreateService();

        await Assert.ThrowsAsync<AuctionNotFoundException>(() =>
            service.UpdateAsync(new UpdateAuctionRequest { Title = "Test" }, 1, 1));
    }

    [Fact]
    public async Task UpdateAsync_WhenUserIsNotOwner_ThrowsForbiddenException()
    {
        var auction = new Auction
        {
            AuctionId = 1,
            UserId = 1
        };

        _auctionRepoMock
            .Setup(r => r.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(auction);

        var service = CreateService();

        await Assert.ThrowsAsync<ForbiddenException>(() =>
            service.UpdateAsync(new UpdateAuctionRequest { Title = "Test" }, 1, 2));
    }
}
