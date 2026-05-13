namespace AuctionLab.Application.Admin.Exceptions;

public class InvalidRoleException : Exception
{
    public InvalidRoleException(string role)
        : base($"Invalid role: {role}")
    {
    }
}
