namespace AuctionLab.Application.Bids.Exceptions;

public sealed class NotLatestBidException : Exception
{
    public NotLatestBidException()
        : base("Not latest bid.")
    {
    }
}
