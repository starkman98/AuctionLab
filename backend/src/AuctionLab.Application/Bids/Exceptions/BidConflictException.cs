namespace AuctionLab.Application.Bids.Exceptions;

public class BidConflictException() : Exception("Another bid was placed at the same time. Please try again.");
