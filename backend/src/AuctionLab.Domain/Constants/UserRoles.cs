namespace AuctionLab.Domain.Constants;

public static class UserRoles
{
    public const string Admin = nameof(Admin);
    public const string User = nameof(User);

    public static readonly IReadOnlySet<string> All = new HashSet<string>
    {
        Admin,
        User
    };

    public static bool IsValid(string role) => All.Contains(role);
}
