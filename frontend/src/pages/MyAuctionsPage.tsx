import { getMyAuctions } from "@/api/auctionApi";
import AuctionListCard from "@/components/auction/AuctionListCard";
import Spinner from "@/components/spinner/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import type { AuctionSummaryResponse } from "@/types/auction";
import { useEffect, useState } from "react";

const MyAuctionsPage = () => {
  const { user } = useAuth();
  const [myAuctions, setMyAuctions] = useState<AuctionSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [status, setStatus] = useState<"all" | "open" | "closed">("all");
  const statuses = ["all", "open", "closed"] as const;

  useEffect(() => {
    const fetchMyAuctions = async () => {
      setIsLoading(true);
      setError("");
      try {
        setMyAuctions(await getMyAuctions(status, debouncedSearch));
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load auctions",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyAuctions();
  }, [debouncedSearch, status]);

  return (
    <section className="app-page">
      <p className="app-kicker">{user?.userName}'s listings</p>
      <h1 className="app-title">My Auctions</h1>
      <div className="app-toolbar">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search auctions..."
          className="app-input max-w-md"
        />
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`app-button app-filter capitalize ${
              status === s ? "app-filter-active" : ""
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      {isLoading && (
        <div className="app-loading">
          <Spinner sizeClass="h-8 w-8" thickClass="border-4" />
          <span>Loading auctions</span>
        </div>
      )}
      {error && <p className="app-error">{error}</p>}
      {!isLoading && !error && <AuctionListCard auctions={myAuctions} />}
    </section>
  );
};

export default MyAuctionsPage;
