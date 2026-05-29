using AuctionLab.Application.Auth;
using AuctionLab.Domain.Constants;
using AuctionLab.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuctionLab.Infrastructure.Persistence.Seeders;

public static class DevelopmentDataSeeder
{
    private const string DemoPassword = "Password123!";
    private const string DemoUserNamePrefix = "demo.user";
    private const string DemoEmailDomain = "auctionlab.dev";
    private const string SeededAuctionTitlePrefix = "[Seed]";

    public static async Task SeedAsync(
        AppDbContext db,
        IPasswordHasher hasher,
        CancellationToken cancellationToken = default)
    {
        await SeedUsersAsync(db, hasher, cancellationToken);
        await SeedAuctionsAsync(db, cancellationToken);
    }

    private static async Task SeedUsersAsync(
        AppDbContext db,
        IPasswordHasher hasher,
        CancellationToken cancellationToken)
    {
        var existingUsernames = await db.Users
            .IgnoreQueryFilters()
            .Where(u => u.UserName.StartsWith(DemoUserNamePrefix))
            .Select(u => u.UserName)
            .ToListAsync(cancellationToken);

        var existing = existingUsernames.ToHashSet(StringComparer.OrdinalIgnoreCase);
        var users = new List<User>();

        for (var i = 1; i <= 20; i++)
        {
            var suffix = i.ToString("D2");
            var username = $"{DemoUserNamePrefix}{suffix}";

            if (existing.Contains(username))
                continue;

            users.Add(new User
            {
                FirstName = DemoFirstNames[i - 1],
                LastName = DemoLastNames[i - 1],
                UserName = username,
                Email = $"{username}@{DemoEmailDomain}",
                PasswordHash = hasher.Hash(DemoPassword),
                Role = UserRoles.User,
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-30 + i)
            });
        }

        if (users.Count == 0)
            return;

        db.Users.AddRange(users);
        await db.SaveChangesAsync(cancellationToken);
    }

    private static async Task SeedAuctionsAsync(
        AppDbContext db,
        CancellationToken cancellationToken)
    {
        var users = await db.Users
            .Where(u => u.UserName.StartsWith(DemoUserNamePrefix))
            .OrderBy(u => u.UserName)
            .ToListAsync(cancellationToken);

        if (users.Count == 0)
            return;

        var existingTitles = await db.Auctions
            .IgnoreQueryFilters()
            .Where(a => a.Title.StartsWith(SeededAuctionTitlePrefix))
            .Select(a => a.Title)
            .ToListAsync(cancellationToken);

        var existing = existingTitles.ToHashSet(StringComparer.OrdinalIgnoreCase);
        var now = DateTimeOffset.UtcNow;
        var auctions = new List<Auction>();

        for (var i = 1; i <= 60; i++)
        {
            var title = $"{SeededAuctionTitlePrefix} {AuctionItems[i - 1].Title}";

            if (existing.Contains(title))
                continue;

            var isEnded = i <= 30;
            var startTime = isEnded
                ? now.AddDays(-45 + i).AddHours(-(i % 6))
                : now.AddDays(-(i % 14 + 1)).AddHours(-(i % 8));

            var endTime = isEnded
                ? now.AddDays(-30 + i).AddHours(-(i % 5 + 1))
                : now.AddDays(i % 21 + 1).AddHours(i % 10 + 1);

            var startingPrice = 100m + (i * 37 % 900);
            decimal? reservationPrice = i % 3 == 0
                ? startingPrice + 150m + (i * 11 % 500)
                : null;

            auctions.Add(new Auction
            {
                Title = title,
                Description = AuctionItems[i - 1].Description,
                StartingPrice = startingPrice,
                ReservationPrice = reservationPrice,
                StartTime = startTime,
                EndTime = endTime,
                UserId = users[(i - 1) % users.Count].UserId,
                ImageUrl = AuctionItems[i - 1].ImageUrl
            });
        }

        if (auctions.Count == 0)
            return;

        db.Auctions.AddRange(auctions);
        await db.SaveChangesAsync(cancellationToken);
    }

    private static readonly string[] DemoFirstNames =
    [
        "Alex", "Sam", "Jamie", "Taylor", "Morgan",
        "Casey", "Jordan", "Riley", "Avery", "Quinn",
        "Robin", "Charlie", "Drew", "Elliot", "Harper",
        "Jules", "Kai", "Logan", "Parker", "Reese"
    ];

    private static readonly string[] DemoLastNames =
    [
        "Andersson", "Berg", "Carlsson", "Dahl", "Ek",
        "Fors", "Gran", "Hedlund", "Ivarsson", "Jonsson",
        "Karlsson", "Lind", "Molin", "Nord", "Olsen",
        "Persson", "Qvist", "Rosen", "Sund", "Vik"
    ];

    private static readonly (string Title, string Description, string ImageUrl)[] AuctionItems =
    [
        ("Vintage Walnut Writing Desk", "A compact walnut desk with brass handles, light surface wear, and two smooth drawers.", "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80"),
        ("Mid-Century Lounge Chair", "Low-profile lounge chair with original wood frame and newly cleaned fabric cushions.", "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=1200&q=80"),
        ("Mechanical Wristwatch", "Hand-wound wristwatch with stainless case, leather strap, and visible patina on the dial.", "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1200&q=80"),
        ("Studio Pottery Vase", "Signed stoneware vase with matte glaze, ideal for a shelf or dining table centerpiece.", "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=80"),
        ("Leather Travel Satchel", "Full-grain leather satchel with shoulder strap, brass hardware, and a roomy interior.", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80"),
        ("Pair Of Brass Table Lamps", "Matching brass lamps with warm finish and simple linen shades.", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80"),
        ("Original Landscape Painting", "Framed oil landscape with soft colors and visible brush texture.", "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80"),
        ("Restored Road Bicycle", "Lightweight road bike with fresh tires, tuned gears, and classic drop bars.", "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80"),
        ("Ceramic Dinner Set", "Twelve-piece ceramic dinner set in neutral tones with small handmade variations.", "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=80"),
        ("Oak Bookshelf", "Tall oak bookshelf with adjustable shelves and a clean natural finish.", "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80"),
        ("Analog Film Camera", "35mm film camera with lens, strap, and working shutter.", "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&w=1200&q=80"),
        ("Handwoven Wool Rug", "Textured wool rug with geometric pattern and muted colors.", "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=1200&q=80"),
        ("Cast Iron Cookware Set", "Three seasoned cast iron pans in practical everyday sizes.", "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80"),
        ("Vintage Record Player", "Belt-drive record player with dust cover and recently replaced stylus.", "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1200&q=80"),
        ("Scandinavian Coffee Table", "Minimal coffee table in light wood with rounded corners and lower shelf.", "https://images.unsplash.com/photo-1532372320572-cda25653a694?auto=format&fit=crop&w=1200&q=80"),
        ("Silver Fountain Pen", "Refillable fountain pen with fine nib and polished silver-tone body.", "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=1200&q=80"),
        ("Acoustic Guitar", "Steel-string acoustic guitar with warm tone and minor cosmetic marks.", "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1200&q=80"),
        ("Antique Wall Mirror", "Decorative framed mirror with aged glass and carved wooden frame.", "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80"),
        ("Espresso Machine", "Compact espresso machine with portafilter, tamper, and milk wand.", "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=1200&q=80"),
        ("Designer Floor Lamp", "Adjustable floor lamp with slim black frame and focused reading light.", "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80"),
        ("Signed Art Print", "Limited art print in a simple black frame, numbered and signed.", "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1200&q=80"),
        ("Japanese Tea Set", "Porcelain tea set with teapot, cups, and subtle blue pattern.", "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80"),
        ("Walnut Bedside Tables", "Pair of compact bedside tables with drawer storage and tapered legs.", "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"),
        ("Bluetooth Speaker", "Portable speaker with fabric cover, strong battery, and clean sound.", "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1200&q=80"),
        ("Kitchen Knife Set", "Five-piece kitchen knife set with wooden block and sharpened edges.", "https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=1200&q=80"),
        ("Minimalist Office Chair", "Ergonomic office chair with adjustable height, armrests, and lumbar support.", "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=1200&q=80"),
        ("Collector Chess Set", "Weighted wooden chess pieces with folding board and storage slots.", "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80"),
        ("Handmade Leather Boots", "Brown leather boots with stitched soles and gently worn finish.", "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=80"),
        ("Marble Side Table", "Small marble-topped side table with metal base and clean proportions.", "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=1200&q=80"),
        ("Vintage Typewriter", "Manual typewriter with carrying case, working keys, and ribbon installed.", "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?auto=format&fit=crop&w=1200&q=80"),
        ("Modern Pendant Light", "Matte pendant light suitable for dining areas or kitchen islands.", "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80"),
        ("Nordic Dining Chairs", "Set of four dining chairs with molded seats and wooden legs.", "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=1200&q=80"),
        ("Premium Coffee Grinder", "Burr grinder with adjustable settings and stainless accents.", "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=1200&q=80"),
        ("Canvas Weekender Bag", "Durable canvas bag with leather details and removable shoulder strap.", "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1200&q=80"),
        ("Framed Botanical Prints", "Set of three framed botanical prints with matching oak frames.", "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80"),
        ("Turned Wooden Bowl", "Large handmade wooden bowl with smooth finish and natural grain.", "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=80"),
        ("Compact Desk Organizer", "Wood and metal organizer with trays for stationery, notes, and small tools.", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"),
        ("Classic Trench Coat", "Double-breasted trench coat in beige cotton blend with belt.", "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80"),
        ("Porcelain Serving Platter", "Large porcelain serving platter with simple rim detail.", "https://images.unsplash.com/photo-1513267048331-5611cad62e41?auto=format&fit=crop&w=1200&q=80"),
        ("Smart Home Starter Kit", "Starter kit with hub, sensors, and two smart plugs.", "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80"),
        ("Handcrafted Jewelry Box", "Small wooden jewelry box with velvet lining and divided compartments.", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80"),
        ("Retro Desk Fan", "Metal desk fan with protective cage and two speed settings.", "https://images.unsplash.com/photo-1585157603988-5e2b3f5220ef?auto=format&fit=crop&w=1200&q=80"),
        ("Framed City Photograph", "Black and white city photograph printed on archival paper.", "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80"),
        ("Solid Pine Storage Bench", "Pine bench with lift-up storage and a simple natural finish.", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80"),
        ("Ceramic Pendant Necklace", "Handmade ceramic pendant on adjustable cord with glazed finish.", "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1200&q=80"),
        ("Professional Tripod", "Aluminum tripod with quick-release plate and carrying bag.", "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=1200&q=80"),
        ("Enamel Dutch Oven", "Heavy enamel-coated Dutch oven suitable for soups, stews, and bread.", "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1200&q=80"),
        ("Minimal Wall Clock", "Quiet wall clock with white face, black markers, and wood frame.", "https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=1200&q=80"),
        ("Linen Bedding Set", "Washed linen bedding set with duvet cover and two pillowcases.", "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"),
        ("Compact Sewing Machine", "Portable sewing machine with foot pedal and accessory kit.", "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80"),
        ("Wireless Headphones", "Over-ear wireless headphones with case and active noise cancellation.", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"),
        ("Handmade Cutting Board", "End-grain cutting board with juice groove and oiled finish.", "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"),
        ("Vintage Suitcase", "Hard-shell suitcase with working latches and travel stickers.", "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80"),
        ("Ceramic Plant Pots", "Set of five ceramic plant pots in mixed sizes and neutral glazes.", "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=80"),
        ("Classic Board Game Bundle", "Bundle of strategy and family board games, all with complete pieces.", "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=1200&q=80"),
        ("Polished Steel Toaster", "Two-slot toaster with polished finish and removable crumb tray.", "https://images.unsplash.com/photo-1585238342028-4bbc9dbb4018?auto=format&fit=crop&w=1200&q=80"),
        ("Wool Winter Coat", "Tailored wool coat with lining, inside pocket, and classic lapels.", "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1200&q=80"),
        ("Compact Books Collection", "Curated collection of modern novels and design books in good condition.", "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80"),
        ("Handblown Glass Bowl", "Transparent handblown glass bowl with subtle blue tint.", "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80"),
        ("Outdoor Folding Chairs", "Pair of folding outdoor chairs with metal frames and woven seats.", "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80")
    ];
}
