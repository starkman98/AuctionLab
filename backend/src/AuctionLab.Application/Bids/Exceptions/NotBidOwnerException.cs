namespace AuctionLab.Application.Bids.Exceptions;

public sealed class NotBidOwnerException : Exception
{
    public NotBidOwnerException()
        : base("Not bid owner.")
    {
    }
}
