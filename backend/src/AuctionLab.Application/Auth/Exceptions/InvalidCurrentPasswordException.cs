namespace AuctionLab.Application.Auth.Exceptions;

public class InvalidCurrentPasswordException : Exception
{
    public InvalidCurrentPasswordException()
        : base("Invalid current password.")
    {
    }
}
