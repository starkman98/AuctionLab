

namespace AuctionLab.Application.Auth.Exceptions;

public class DuplicateUserNameException : Exception
{
    public DuplicateUserNameException()
        : base("Username already exists.")
    {
    }

    public DuplicateUserNameException(string? message) : base(message)
    {
    }
}
