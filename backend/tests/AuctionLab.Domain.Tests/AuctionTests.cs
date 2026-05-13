using AuctionLab.Domain.Entities;

namespace AuctionLab.Domain.Tests;

public class AuctionTests
{
    [Fact]
    public void IsClosed_WhenEndTimeIsPast_ReturnsTrue()
    {
        var auction = new Auction
        {
            EndTime = DateTimeOffset.UtcNow.AddDays(-1)
        };

        Assert.True(auction.IsClosed);
    }

    [Fact]
    public void IsOpen_WhenInactivated_ReturnsFalse()
    {
        var auction = new Auction
        {
            EndTime = DateTimeOffset.UtcNow.AddDays(1),
            InactivatedAt = DateTimeOffset.UtcNow
        };

        Assert.False(auction.IsOpen);
    }

    [Fact]
    public void IsActive_WhenInactivatedAtIsSet_ReturnsFalse()
    {
        var auction = new Auction
        {
            InactivatedAt = DateTimeOffset.UtcNow
        };

        Assert.False(auction.IsActive);
    }

    [Fact]
    public void IsOpen_WhenEndTimeIsFutureAndActive_ReturnsTrue()
    {
        var auction = new Auction
        {
            EndTime = DateTimeOffset.UtcNow.AddDays(1),
            InactivatedAt = null
        };

        Assert.True(auction.IsOpen);
    }
}
