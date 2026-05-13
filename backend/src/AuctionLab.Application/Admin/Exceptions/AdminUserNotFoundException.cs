namespace AuctionLab.Application.Admin.Exceptions;

public class AdminUserNotFoundException : Exception
{
    public AdminUserNotFoundException()
        : base("User not found.")
    {
    }
}
