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

    public async Task<User?> GetByIdAsync(int userId, CancellationToken cancellationToken = default)
        => await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);


    public async Task AddAsync(User user, CancellationToken cancellationToken = default)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdatePasswordHash(int userId, string passwordHash, CancellationToken cancellationToken = default)
        => await _context.Users.Where(u => u.UserId == userId)
            .ExecuteUpdateAsync(s => s.SetProperty(u => u.PasswordHash, passwordHash), cancellationToken);

    public async Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default)
         => await _context.Users.AnyAsync(u => u.Email == email, cancellationToken);

    public async Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken = default)
        => await _context.Users.FirstOrDefaultAsync(u => u.UserName == username, cancellationToken);

    public async Task<bool> UsernameExistsAsync(string username, CancellationToken cancellationToken = default)
        => await _context.Users.AnyAsync(u => u.UserName == username, cancellationToken);

    public async Task UpdateAsync(User user, CancellationToken cancellationToken = default)
        => await _context.SaveChangesAsync(cancellationToken);

    public async Task<List<User>> GetAllAsync(int page, int pageSize, string? search = null, CancellationToken cancellationToken = default)
    {
        var query = _context.Users.IgnoreQueryFilters().AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(u => u.UserName.Contains(search) || u.Email.Contains(search));
        return await query
        .OrderBy(u => u.UserName)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync(cancellationToken);
    }

    public async Task<User?> GetByIdIncludingInactiveAsync(int userId, CancellationToken cancellationToken = default)
        => await _context.Users
        .IgnoreQueryFilters()
        .FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);
}
