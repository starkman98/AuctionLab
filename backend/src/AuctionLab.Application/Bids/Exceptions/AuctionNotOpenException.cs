namespace AuctionLab.Application.Bids.Exceptions;

public sealed class AuctionNotOpenException : Exception
{
    public AuctionNotOpenException()
        : base("Can not bid on a closed auction.")
    {
    }
}
