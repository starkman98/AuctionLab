using AuctionLab.Application.Auth;
using AuctionLab.Domain.Constants;
using AuctionLab.Domain.Entities;
using AuctionLab.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AuctionLab.Api.Extensions;

public static class WebApplicationExtensions
{
    public static async Task SeedAdminAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
        var seed = app.Configuration.GetSection("AdminSeed");

        await db.Database.MigrateAsync();

        if (await db.Users.AnyAsync(u => u.Role == UserRoles.Admin))
            return;

        db.Users.Add(new User
        {
            FirstName = seed["FirstName"] ?? "Admin",
            LastName = seed["LastName"] ?? "User",
            UserName = seed["UserName"] ?? "admin",
            Email = seed["Email"] ?? "admin@auctionlab.dev",
            PasswordHash = hasher.Hash(seed["Password"]
                ?? throw new InvalidOperationException("AdminSeed:Password is required")),
            Role = UserRoles.Admin
        });

        await db.SaveChangesAsync();
    }
}
