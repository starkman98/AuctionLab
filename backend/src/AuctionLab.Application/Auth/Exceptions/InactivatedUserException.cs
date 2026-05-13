namespace AuctionLab.Application.Auth.Exceptions;

public class InactivatedUserException : Exception
{
    public InactivatedUserException()
        : base("This user is inactivated.")
    {
    }
}
