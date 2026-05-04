namespace AuctionLab.Application.Auctions.Exceptions;

public class ForbiddenException : Exception
{
    public ForbiddenException()
        : base("Forbidden action")
    {
    }
}
