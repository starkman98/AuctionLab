namespace AuctionLab.Application.Auctions.Exceptions;

public class AuctionNotFoundException : Exception
{
    public AuctionNotFoundException()
        : base("Auction not found.")
    {
    }
}
