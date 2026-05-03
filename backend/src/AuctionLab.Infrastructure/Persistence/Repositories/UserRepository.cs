using AuctionLab.Application.Repositories;
using AuctionLab.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuctionLab.Infrastructure.Persistence.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(int userId)
        => await _context.Users.FindAsync(userId);

    public async Task AddAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
    }

    public async Task UpdatePasswordHash(int userId, string passwordHash)
        => await _context.Users.Where(u => u.UserId == userId)
            .ExecuteUpdateAsync(s => s.SetProperty(u => u.PasswordHash, passwordHash));

    public async Task<bool> EmailExistsAsync(string email)
         => await _context.Users.AnyAsync(u => u.Email == email);

    public async Task<User?> GetByUsernameAsync(string username)
        => await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);

    public async Task<bool> UsernameExistsAsync(string username)
        => await _context.Users.AnyAsync(u => u.UserName == username);
}
