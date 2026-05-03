using AuctionLab.Domain.Entities;

namespace AuctionLab.Application.Repositories;

public interface IUserRepository
{
    Task<User?> GetByUsernameAsync(string username);
    Task<bool> EmailExistsAsync(string email);
    Task<bool> UsernameExistsAsync(string username);
    Task AddAsync(User user);
}
