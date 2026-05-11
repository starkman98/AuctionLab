namespace AuctionLab.Application.Bids.Exceptions;

public sealed class BidTooLowException : Exception
{
    public BidTooLowException()
        : base("Bid must be higher than the current highest bid.")
    {
    }
}
