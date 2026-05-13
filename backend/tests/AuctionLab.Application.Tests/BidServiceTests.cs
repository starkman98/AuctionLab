using AuctionLab.Application.Auctions.Exceptions;
using AuctionLab.Application.Bids;
using AuctionLab.Application.Bids.DTOs;
using AuctionLab.Application.Bids.Exceptions;
using AuctionLab.Application.Repositories;
using AuctionLab.Domain.Entities;
using Moq;

namespace AuctionLab.Application.Tests;

public class BidServiceTests
{
    private readonly Mock<IBidRepository> _bidRepoMock = new();
    private readonly Mock<IAuctionRepository> _auctionRepoMock = new();

    private BidService CreateService() => new(_bidRepoMock.Object, _auctionRepoMock.Object);

    [Fact]
    public async Task PlaceBidAsync_WhenAuctionNotFound_ThrowsAuctionNotFoundException()
    {
        _auctionRepoMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Auction?)null);

        var service = CreateService();

        await Assert.ThrowsAsync<AuctionNotFoundException>(() =>
            service.PlaceBidAsync(new PlaceBidRequest { Amount = 100 }, auctionId: 1, userId: 1));
    }

    [Fact]
    public async Task PlaceBidAsync_WhenAuctionIsClosed_ThrowsAuctionNotOpenException()
    {
        var closedAuction = new Auction
        {
            AuctionId = 1,
            UserId = 99,
            EndTime = DateTimeOffset.UtcNow.AddDays(-1)
        };

        _auctionRepoMock
            .Setup(r => r.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(closedAuction);

        var service = CreateService();

        await Assert.ThrowsAsync<AuctionNotOpenException>(() =>
            service.PlaceBidAsync(new PlaceBidRequest { Amount = 100 }, auctionId: 1, userId: 1));
    }

    [Fact]
    public async Task PlaceBidAsync_WhenBiddingOnOwnAuction_ThrowsCanNotBidOnOwnAuctionException()
    {
        var auction = new Auction
        {
            AuctionId = 1,
            UserId = 1,
            EndTime = DateTimeOffset.UtcNow.AddDays(1)
        };

        _auctionRepoMock
            .Setup(r => r.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(auction);

        var service = CreateService();

        await Assert.ThrowsAsync<CanNotBidOnOwnAuctionException>(() =>
            service.PlaceBidAsync(new PlaceBidRequest { Amount = 100 }, auctionId: 1, userId: 1));
    }

    [Fact]
    public async Task PlaceBidAsync_WhenFirstBidBelowStartingPrice_ThrowsBidTooLowException()
    {
        var auction = new Auction
        {
            AuctionId = 1,
            UserId = 1,
            StartingPrice = 100,
            EndTime = DateTimeOffset.UtcNow.AddDays(1)
        };

        _auctionRepoMock.Setup(r => r.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(auction);

        var service = CreateService();

        await Assert.ThrowsAsync<BidTooLowException>(() =>
            service.PlaceBidAsync(new PlaceBidRequest { Amount = 10 }, auctionId: 1, userId: 2));
    }

    [Fact]
    public async Task PlaceBidAsync_WhenBidNotHigherThanCurrent_ThrowsBidTooLowException()
    {
        var auction = new Auction
        {
            AuctionId = 1,
            UserId = 1,
            StartingPrice = 100,
            EndTime = DateTimeOffset.UtcNow.AddDays(1),
            Bids = new List<Bid>
            {
                new Bid
                {
                    Amount = 200
                }
            }
        };

        _auctionRepoMock.Setup(r => r.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(auction);

        var service = CreateService();

        await Assert.ThrowsAsync<BidTooLowException>(() =>
            service.PlaceBidAsync(new PlaceBidRequest { Amount = 10 }, auctionId: 1, userId: 2));
    }

    [Fact]
    public async Task RetractBidAsync_WhenBidNotFound_ThrowsBidNotFoundException()
    {
        _bidRepoMock
            .Setup(r => r.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Bid?)null);

        var service = CreateService();

        await Assert.ThrowsAsync<BidNotFoundException>(() =>
            service.RetractBidAsync(1, 1));
    }

    [Fact]
    public async Task RetractBidAsync_WhenNotBidOwner_ThrowsNotBidOwnerException()
    {
        var bid = new Bid
        {
            BidId = 1,
            UserId = 1,
            Amount = 100
        };

        _bidRepoMock
            .Setup(r => r.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(bid);

        var service = CreateService();

        await Assert.ThrowsAsync<NotBidOwnerException>(() =>
            service.RetractBidAsync(1, 2));
    }

    [Fact]
    public async Task RetractBidAsync_WhenNotLatestBid_ThrowsNotLatestBidException()
    {
        var bidToRetract = new Bid
        {
            BidId = 2,
            UserId = 1,
            AuctionId = 10,
            Amount = 100
        };

        var latestBid = new Bid
        {
            BidId = 5,
            UserId = 2,
            AuctionId = 10,
            Amount = 100
        };

        _bidRepoMock
            .Setup(r => r.GetLatestByAuctionIdAsync(10, It.IsAny<CancellationToken>()))
            .ReturnsAsync(bidToRetract);

        _bidRepoMock
            .Setup(r => r.GetByIdAsync(5, It.IsAny<CancellationToken>()))
            .ReturnsAsync(latestBid);

        var service = CreateService();

        await Assert.ThrowsAsync<NotLatestBidException>(() =>
            service.RetractBidAsync(5, 2));
    }
}
