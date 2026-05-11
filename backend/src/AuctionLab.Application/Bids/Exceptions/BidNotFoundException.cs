namespace AuctionLab.Application.Bids.Exceptions;

public sealed class BidNotFoundException : Exception
{
    public BidNotFoundException()
        : base("Bid not found.")
    {
    }
}
