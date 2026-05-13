using AuctionLab.Domain.Entities;

namespace AuctionLab.Domain.Tests;

public class UserTests
{
    [Fact]
    public void IsActive_WhenInactivatedAtIsNull_ReturnsTrue()
    {
        var user = new User
        {
            InactivatedAt = null
        };

        Assert.True(user.IsActive);
    }

    [Fact]
    public void IsActive_WhenInactivatedIsSet_ReturnsFalse()
    {
        var user = new User
        {
            InactivatedAt = DateTimeOffset.UtcNow
        };

        Assert.False(user.IsActive);
    }
}
