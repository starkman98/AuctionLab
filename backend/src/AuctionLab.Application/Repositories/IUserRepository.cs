using AuctionLab.Domain.Entities;

namespace AuctionLab.Application.Repositories;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(int userId);
    Task<User?> GetByUsernameAsync(string username);
    Task UpdatePasswordHash(int userId, string passwordHash);
    Task<bool> EmailExistsAsync(string email);
    Task<bool> UsernameExistsAsync(string username);
    Task AddAsync(User user);
}
