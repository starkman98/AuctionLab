using AuctionLab.Application.Auth.DTOs;
using AuctionLab.Application.Auth.Exceptions;
using AuctionLab.Application.Repositories;
using AuctionLab.Domain.Constants;
using AuctionLab.Domain.Entities;

namespace AuctionLab.Application.Auth;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepo;
    private readonly IPasswordHasher _hasher;
    private readonly IJwtTokenService _tokenService;

    public AuthService(IUserRepository userRepo, IPasswordHasher hasher, IJwtTokenService tokenService)
    {
        _userRepo = userRepo;
        _hasher = hasher;
        _tokenService = tokenService;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userRepo.GetByUsernameAsync(request.UserName)
            ?? throw new InvalidCredentialsException();

        if (!_hasher.Verify(request.Password, user.PasswordHash))
            throw new InvalidCredentialsException();

        var token = _tokenService.CreateToken(user);
        var tokenExpirationTime = _tokenService.GetExpirationTimeUtc(token);

        return new AuthResponse
        {
            Token = token,
            ExpiresAtUtc = tokenExpirationTime,
            UserId = user.UserId,
            UserName = user.UserName,
            Email = user.Email,
            Role = user.Role
        };
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        if (await _userRepo.EmailExistsAsync(request.Email))
            throw new DuplicateEmailException();

        if (await _userRepo.UsernameExistsAsync(request.UserName))
            throw new DuplicateUserNameException();

        var passwordHash = _hasher.Hash(request.Password);

        var newUser = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            UserName = request.UserName,
            Email = request.Email,
            PasswordHash = passwordHash,
            CreatedAt = DateTimeOffset.UtcNow,
            Role = UserRoles.User
        };

        await _userRepo.AddAsync(newUser);

        var token = _tokenService.CreateToken(newUser);

        var tokenExpirationTime = _tokenService.GetExpirationTimeUtc(token);

        return new AuthResponse
        {
            Token = token,
            ExpiresAtUtc = tokenExpirationTime,
            UserId = newUser.UserId,
            UserName = newUser.UserName,
            Email = newUser.Email,
            Role = newUser.Role
        };
    }
}
