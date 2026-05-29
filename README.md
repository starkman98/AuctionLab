# AuctionLab

AuctionLab is a school assignment for the Web Development course at
IT-Högskolan. The project is a full-stack auction application where users can
register, sign in, create auctions, browse open and closed auctions, and place
bids.

The application is split into a .NET backend API and a React frontend.

## Project Structure

```text
AuctionLab/
|-- backend/
|   |-- src/
|   |   |-- AuctionLab.Api/              # ASP.NET Core Web API, controllers, startup
|   |   |-- AuctionLab.Application/      # Services, DTOs, repository interfaces
|   |   |-- AuctionLab.Domain/           # Domain entities, enums, constants
|   |   `-- AuctionLab.Infrastructure/   # EF Core, repositories, auth, seeders
|   `-- tests/                           # Backend unit tests
|-- frontend/
|   |-- public/
|   `-- src/                             # React/Vite frontend source
|-- docs/
`-- AuctionLab.sln
```

## Tech Stack

- Backend: ASP.NET Core, Entity Framework Core, SQL Server, JWT authentication
- Frontend: React, TypeScript, Vite, Tailwind CSS
- Tests: .NET test projects for domain and application logic

## Prerequisites

- .NET SDK 10
- Node.js and npm
- SQL Server or SQL Server Express LocalDB

## Backend Setup

The API project is located in `backend/src/AuctionLab.Api`.

Set the required local configuration before running the API:

```powershell
cd backend/src/AuctionLab.Api
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=(localdb)\MSSQLLocalDB;Database=AuctionLab;Trusted_Connection=True;TrustServerCertificate=True"
dotnet user-secrets set "JwtSettings:SecretKey" "replace-this-with-a-long-local-development-secret"
dotnet user-secrets set "AdminSeed:Password" "Password123!"
```

Run the API:

```powershell
dotnet run
```

By default, the API runs on:

- `https://localhost:7243`
- `http://localhost:5217`

Swagger is available when the API is running:

- `https://localhost:7243/swagger`

EF Core migrations are applied automatically on startup by the existing admin
seeding flow.

## Development Seed Data

When the API runs in `Development`, it seeds demo data after the admin account:

- 20 demo users: `demo.user01` through `demo.user20`
- Shared demo password: `Password123!`
- 60 auctions total
- 30 auctions that have already ended
- 30 auctions that are currently live

Auction dates are generated relative to the time the seed runs. The seeders are
idempotent, so restarting the API should not duplicate the seeded demo users or
auctions.

## Frontend Setup

The frontend project is located in `frontend`.

Install dependencies:

```powershell
cd frontend
npm install
```

Run the frontend dev server:

```powershell
npm run dev
```

The Vite dev server normally runs on:

- `http://localhost:5173`

The backend CORS policy is configured to allow requests from
`http://localhost:5173`.

## Useful Commands

From the repository root:

```powershell
dotnet build AuctionLab.sln
dotnet test AuctionLab.sln
```

From `frontend`:

```powershell
npm run build
npm run lint
```

## Notes

This project is intended for learning and local development as part of the
course assignment. Production concerns such as deployment configuration,
secret management, observability, and hardened security settings are outside the
current assignment scope.
