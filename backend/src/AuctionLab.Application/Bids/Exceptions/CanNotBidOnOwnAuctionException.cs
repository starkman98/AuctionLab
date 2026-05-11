namespace AuctionLab.Application.Bids.Exceptions;

public sealed class CanNotBidOnOwnAuctionException : Exception
{
    public CanNotBidOnOwnAuctionException()
        : base("Can not bid on your own auction.")
    {
    }
}
