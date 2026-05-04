# AuctionLab – Backlog och Roadmap för Inlämningsuppgift 2

## 1. Vad uppgiften går ut på

Du ska bygga en fullstack auktionslösning med:

- **React frontend**
- **ASP.NET Core Web API backend**
- **SQL Server databas**
- **JWT-inloggning**
- **Auktioner, användare och bud**

Applikationen ska fungera som en enkel auktionssajt där användare kan registrera sig, logga in, skapa auktioner, söka auktioner och lägga bud.

För **VG** krävs dessutom tydligare behörighetskontroll, bättre struktur, responsiv design, adminfunktioner, uppdatering av auktioner, avslutade auktioner och möjlighet att ångra senaste bud.

---

## 2. Viktigaste helhetsbilden

Systemet kan delas upp i fyra huvudområden:

1. **Auth och användare**
   - Registrera användare
   - Logga in
   - JWT-token
   - Skydda endpoints
   - Uppdatera eget lösenord
   - Admin kan inaktivera användare

2. **Auktioner**
   - Skapa auktion
   - Lista/söka öppna auktioner
   - Visa detaljer för en auktion
   - Uppdatera auktion
   - Inaktivera auktion som admin
   - Visa avslutade auktioner enligt VG-krav

3. **Bud**
   - Visa budhistorik för öppna auktioner
   - Lägga bud om man inte äger auktionen
   - Bud måste vara högre än högsta budet
   - Ångra senaste bud om auktionen fortfarande är öppen
   - För avslutade auktioner visas endast vinnande bud

4. **Frontendstruktur och design**
   - React Router
   - Context API eller annat state-bibliotek
   - Responsiv design
   - Tydlig UI/UX
   - Bra felmeddelanden
   - Kodstruktur som visar att du tänkt som en utvecklare

---

## 3. Rekommenderad datamodell

### User

```csharp
public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "User";
    public bool IsActive { get; set; } = true;

    public List<Auction> Auctions { get; set; } = new();
    public List<Bid> Bids { get; set; } = new();
}
```

### Auction

```csharp
public class Auction
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal StartingPrice { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; } = true;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public List<Bid> Bids { get; set; } = new();
}
```

### Bid

```csharp
public class Bid
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public DateTime CreatedAt { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int AuctionId { get; set; }
    public Auction Auction { get; set; } = null!;
}
```

---

## 4. Backend-roadmap

### Steg 1 – Grundprojekt

- [x] Skapa ASP.NET Core Web API-projekt
- [x] Lägg till Entity Framework Core
- [x] Lägg till SQL Server connection string
- [x] Skapa `AppDbContext`
- [x] Skapa modeller: `User`, `Auction`, `Bid`
- [x] Skapa första migrationen
- [x] Kör `database update`
- [x] Kontrollera att tabeller skapas i databasen

### Steg 2 – Auth och JWT

- [x] Skapa register-endpoint
- [x] Hasha lösenord, spara aldrig plain text
- [x] Skapa login-endpoint
- [x] Validera email + lösenord
- [x] Skapa JWT-token vid lyckad login
- [x] Lägg in claims: userId, email, role
- [x] Konfigurera JWT Bearer i `Program.cs`
- [ ] Testa skyddad endpoint med `[Authorize]`

Rekommenderade endpoints:

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PUT  /api/users/me/password
```

### Steg 3 – Auktioner

- [x] Skapa endpoint för att skapa auktion
- [x] Bara inloggad användare får skapa auktion
- [x] Koppla auktionen till inloggad användares id från JWT
- [x] Skapa endpoint för att söka/lista öppna auktioner
- [x] Bara auktioner där `EndDate > DateTime.UtcNow` ska räknas som öppna
- [x] Auktioner med `IsActive == false` ska inte visas i sökningar
- [x] Skapa endpoint för auktiondetaljer

Rekommenderade endpoints:

```http
GET  /api/auctions?search=cykel
GET  /api/auctions/{id}
POST /api/auctions
PUT  /api/auctions/{id}
```

### Steg 4 – Bud

- [ ] Skapa endpoint för att lägga bud
- [ ] Kontrollera att användaren är inloggad
- [ ] Kontrollera att auktionen är öppen
- [ ] Kontrollera att auktionen är aktiv
- [ ] Kontrollera att användaren inte äger auktionen
- [ ] Kontrollera att budet är högre än nuvarande högsta bud
- [ ] Spara bud med datum och användare
- [ ] Returnera tydligt felmeddelande om budet är för lågt

Rekommenderade endpoints:

```http
GET    /api/auctions/{auctionId}/bids
POST   /api/auctions/{auctionId}/bids
DELETE /api/bids/{bidId}
```

### Steg 5 – VG: avslutade auktioner

- [ ] Skapa stöd för att söka avslutade auktioner
- [ ] Skilj på öppna och avslutade auktioner via query-param
- [ ] För avslutad auktion: visa bara auktionsinfo och högsta vinnande bud
- [ ] Visa inte full budhistorik på avslutade auktioner
- [ ] Tillåt inte bud på avslutad auktion

Exempel:

```http
GET /api/auctions?search=cykel&status=open
GET /api/auctions?search=cykel&status=closed
```

### Steg 6 – VG: uppdatera auktion

- [ ] Endast ägaren får uppdatera sin auktion
- [ ] Admin kan eventuellt få större rättigheter, men håll det tydligt
- [ ] Om auktionen redan har bud får priset inte ändras
- [ ] Titel, beskrivning och datum kan uppdateras enligt rimliga regler
- [ ] Returnera felmeddelande om användaren försöker ändra pris när bud finns

### Steg 7 – VG: ångra bud

- [ ] Användaren får bara ta bort sitt eget bud
- [ ] Budet får bara tas bort om auktionen fortfarande är öppen
- [ ] Budet får bara tas bort om det är senaste/högsta budet
- [ ] Returnera tydligt fel om det inte går

### Steg 8 – VG: admin

- [ ] Skapa adminroll
- [ ] Seed:a gärna en adminanvändare
- [ ] Admin kan inaktivera auktion
- [ ] Inaktiverad auktion ska inte synas i sökningar
- [ ] Admin kan inaktivera användarkonto
- [ ] Inaktiverad användare ska inte kunna logga in

Rekommenderade endpoints:

```http
PUT /api/admin/auctions/{id}/deactivate
PUT /api/admin/users/{id}/deactivate
```

---

## 5. Frontend-roadmap

### Steg 1 – Grundstruktur

- [ ] Skapa React + TypeScript + Vite-projekt
- [ ] Installera React Router
- [ ] Skapa grundlayout med header/nav/footer
- [ ] Skapa sidor:
  - Home
  - Login
  - Register
  - AuctionList
  - AuctionDetails
  - CreateAuction
  - MyAuctions
  - Admin

### Steg 2 – Auth i frontend

- [ ] Skapa `AuthContext`
- [ ] Spara token efter login
- [ ] Spara användarinfo, exempelvis id, email, role
- [ ] Skapa loginformulär
- [ ] Skapa registerformulär
- [ ] Skapa logout
- [ ] Skapa protected routes
- [ ] Visa olika menyval beroende på om användaren är inloggad

Exempel på route-tänk:

```tsx
<Route path="/login" element={<LoginPage />} />
<Route path="/register" element={<RegisterPage />} />
<Route path="/auctions" element={<AuctionListPage />} />
<Route path="/auctions/:id" element={<AuctionDetailsPage />} />
<Route path="/create-auction" element={<ProtectedRoute><CreateAuctionPage /></ProtectedRoute>} />
<Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
```

### Steg 3 – Auktioner i frontend

- [ ] Lista öppna auktioner
- [ ] Sök auktioner via titel
- [ ] Visa auktionens titel, beskrivning, pris, slutdatum och skapare
- [ ] Klicka in på en auktion
- [ ] Visa detaljer
- [ ] Skapa auktion som inloggad användare
- [ ] Uppdatera egen auktion

### Steg 4 – Bud i frontend

- [ ] Visa budhistorik för öppen auktion
- [ ] Visa budformulär om användaren är inloggad
- [ ] Dölj budformulär om användaren äger auktionen
- [ ] Dölj budformulär om auktionen är avslutad
- [ ] Visa felmeddelande om budet är för lågt
- [ ] Uppdatera budlistan efter lyckat bud
- [ ] Lägg till knapp för att ångra senaste egna bud när reglerna tillåter det

### Steg 5 – VG: avslutade auktioner i frontend

- [ ] Lägg till filter: öppna / avslutade auktioner
- [ ] För avslutade auktioner: visa bara vinnande bud
- [ ] Visa inte budhistorik
- [ ] Visa inte budformulär

### Steg 6 – VG: adminvy

- [ ] Skapa admin-dashboard
- [ ] Lista användare
- [ ] Lista auktioner
- [ ] Lägg till knapp för att inaktivera användare
- [ ] Lägg till knapp för att inaktivera auktion
- [ ] Visa tydliga bekräftelser och felmeddelanden

### Steg 7 – Responsiv design

- [ ] Mobile-first layout
- [ ] Kortbaserad auktionslista
- [ ] Tydlig navigation på mobil
- [ ] Formulär som fungerar på små skärmar
- [ ] Tillräckliga marginaler och spacing
- [ ] Testa i browser devtools för mobilstorlek

---

## 6. Rekommenderad ordning för implementation

### Fas 1 – G-nivå fungerar end-to-end

Målet är att snabbt få en enkel version där frontend och backend pratar med varandra.

- [ ] Backend: datamodell och databas
- [ ] Backend: register/login/JWT
- [ ] Backend: skapa/lista/söka auktioner
- [ ] Backend: lägga bud
- [ ] Frontend: login/register
- [ ] Frontend: lista auktioner
- [ ] Frontend: detaljer och bud
- [ ] Frontend: skapa auktion

När detta fungerar har du grunden för godkänt.

### Fas 2 – VG-funktionalitet

- [ ] Skydda alla write-actions med JWT
- [ ] Uppdatera eget lösenord
- [ ] Söka avslutade auktioner
- [ ] Visa bara vinnande bud på avslutade auktioner
- [ ] Uppdatera auktion
- [ ] Hindra prisändring om bud finns
- [ ] Ångra senaste bud
- [ ] Adminroll
- [ ] Inaktivera auktion
- [ ] Inaktivera användare

### Fas 3 – Kodkvalitet och polish

- [ ] Rensa controllers från för mycket logik
- [ ] Flytta affärslogik till services
- [ ] Använd DTOs för request/response
- [ ] Lägg till tydliga felmeddelanden
- [ ] Lägg till loading states i frontend
- [ ] Lägg till tomma states, exempelvis “Inga auktioner hittades”
- [ ] Lägg till responsiv design
- [ ] Testa hela flödet från start till slut

---

## 7. Förslag på backendstruktur

```text
Backend/
├── Controllers/
│   ├── AuthController.cs
│   ├── AuctionsController.cs
│   ├── BidsController.cs
│   └── AdminController.cs
├── Data/
│   └── AppDbContext.cs
├── DTOs/
│   ├── Auth/
│   ├── Auctions/
│   └── Bids/
├── Models/
│   ├── User.cs
│   ├── Auction.cs
│   └── Bid.cs
├── Services/
│   ├── AuthService.cs
│   ├── AuctionService.cs
│   └── BidService.cs
├── Helpers/
│   └── JwtTokenGenerator.cs
└── Program.cs
```

---

## 8. Förslag på frontendstruktur

```text
Frontend/src/
├── api/
│   ├── authApi.ts
│   ├── auctionApi.ts
│   └── bidApi.ts
├── components/
│   ├── Layout/
│   ├── AuctionCard.tsx
│   ├── BidList.tsx
│   └── ProtectedRoute.tsx
├── context/
│   └── AuthContext.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── AuctionListPage.tsx
│   ├── AuctionDetailsPage.tsx
│   ├── CreateAuctionPage.tsx
│   ├── MyAuctionsPage.tsx
│   └── AdminPage.tsx
├── types/
│   ├── auction.ts
│   ├── bid.ts
│   └── user.ts
└── App.tsx
```

---

## 9. Viktiga regler att bygga in

### Auktion är öppen om:

```csharp
auction.EndDate > DateTime.UtcNow && auction.IsActive
```

### En användare får lägga bud om:

- Användaren är inloggad
- Auktionen är öppen
- Auktionen är aktiv
- Användaren är inte skaparen av auktionen
- Budet är högre än högsta befintliga bud

### En användare får ångra bud om:

- Användaren äger budet
- Auktionen är fortfarande öppen
- Budet är det senaste/högsta budet

### En auktion får uppdateras om:

- Användaren äger auktionen
- Auktionen inte är inaktiverad
- Priset ändras inte om det redan finns bud

### Admin får:

- Inaktivera auktioner
- Inaktivera användare

---

## 10. Saker som kan imponera för VG

- Använd DTOs istället för att skicka EF models direkt
- Lägg affärslogik i services, inte direkt i controllers
- Ha tydliga statuskoder:
  - `400 BadRequest` vid felaktig input
  - `401 Unauthorized` om användaren inte är inloggad
  - `403 Forbidden` om användaren saknar rättighet
  - `404 NotFound` om resursen saknas
- Visa tydliga felmeddelanden i frontend
- Ha loading states
- Ha responsiv design
- Ha konsekvent namngivning
- Ha rimlig validering både frontend och backend
- Använd React Router på ett tydligt sätt
- Använd Context API för auth-state
- Lägg adminfunktioner bakom både frontendskydd och backendskydd
- Se till att backend alltid är källan till sanningen

---

## 11. Minimum för att inte fastna

Bygg inte allt på en gång. Följ denna minsta fungerande kedja först:

1. Register user
2. Login user
3. Få JWT-token
4. Skapa auktion med token
5. Lista auktioner
6. Öppna auktionsdetalj
7. Lägg bud med annan användare
8. Visa budhistorik

När den kedjan fungerar kan du börja lägga på VG-kraven.

---

## 12. Definition of Done

En feature är klar när:

- [ ] Backend-endpoint fungerar i Swagger/Postman
- [ ] Felhantering finns i backend
- [ ] Frontend kan använda endpointen
- [ ] UI visar loading/error/success där det behövs
- [ ] Funktionen fungerar även efter refresh
- [ ] Rollen/behörigheten kontrolleras i backend
- [ ] Koden är rimligt strukturerad
- [ ] Du har testat både lyckade och misslyckade fall

---

## 13. Rekommenderade testscenarion

### Auth

- [ ] Registrera ny användare
- [ ] Logga in med rätt lösenord
- [ ] Logga in med fel lösenord
- [ ] Inaktiverad användare kan inte logga in
- [ ] Inloggad användare kan byta lösenord

### Auktion

- [ ] Inloggad användare kan skapa auktion
- [ ] Ej inloggad användare kan inte skapa auktion
- [ ] Öppna auktioner syns i sökning
- [ ] Avslutade auktioner syns endast när man söker på avslutade
- [ ] Inaktiverad auktion syns inte i sökningar
- [ ] Ägare kan uppdatera sin auktion
- [ ] Ägare kan inte ändra pris om bud finns

### Bud

- [ ] Inloggad användare kan lägga bud
- [ ] Ej inloggad användare kan inte lägga bud
- [ ] Ägare kan inte lägga bud på egen auktion
- [ ] För lågt bud nekas
- [ ] Högre bud accepteras
- [ ] Bud kan inte läggas på avslutad auktion
- [ ] Senaste egna bud kan ångras om auktionen är öppen
- [ ] Äldre bud kan inte ångras

### Admin

- [ ] Admin kan inaktivera auktion
- [ ] Admin kan inaktivera användare
- [ ] Vanlig användare kan inte använda admin-endpoints

---

## 14. Förslag på sprintar

### Sprint 1 – Projektgrund

- Backendprojekt
- Frontendprojekt
- Databas
- Modeller
- Migrationer
- Grundläggande layout

### Sprint 2 – Auth

- Register
- Login
- JWT
- AuthContext
- Protected routes

### Sprint 3 – Auktioner

- Skapa auktion
- Lista auktioner
- Söka auktioner
- Detaljsida

### Sprint 4 – Bud

- Visa bud
- Lägg bud
- Validera budregler
- Felmeddelanden i UI

### Sprint 5 – VG-funktioner

- Avslutade auktioner
- Vinnande bud
- Uppdatera auktion
- Ångra bud
- Byta lösenord

### Sprint 6 – Admin och polish

- Adminvy
- Inaktivera auktion
- Inaktivera användare
- Responsiv design
- Kodstädning
- Sluttest

---

## 15. Personlig strategi för VG

För att maximera chansen till VG bör du prioritera detta:

1. **Backendreglerna måste vara korrekta.** Frontend får gärna dölja knappar, men backend måste alltid stoppa otillåtna actions.
2. **Bygg med DTOs och services.** Det visar bättre kodstruktur.
3. **Gör auth ordentligt.** JWT, roller och skyddade endpoints är centralt.
4. **Gör UI:t tydligt.** Det behöver inte vara avancerat, men det ska kännas genomarbetat.
5. **Testa edge cases.** För lågt bud, egen auktion, avslutad auktion, inaktiverad användare, adminrättigheter.
6. **Skriv gärna en README.** Beskriv hur man kör projektet, vilka konton som finns och vilka VG-krav som är implementerade.
