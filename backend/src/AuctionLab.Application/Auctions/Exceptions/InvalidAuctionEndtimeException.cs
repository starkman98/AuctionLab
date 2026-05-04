namespace AuctionLab.Application.Auctions.Exceptions;

public sealed class InvalidAuctionEndtimeException : Exception
{
    public InvalidAuctionEndtimeException()
        : base("Auction must end at least 1 hour from now.")
    {
    }
}
