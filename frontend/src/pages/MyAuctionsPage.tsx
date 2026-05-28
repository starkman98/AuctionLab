import { getMyAuctions } from "@/api/auctionApi";
import AuctionListCard from "@/components/auction/AuctionListCard";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import type { AuctionSummaryResponse } from "@/types/auction";
import { useEffect, useState } from "react";

const MyAuctionsPage = () => {
  const { user } = useAuth();
  const [myAuctions, setMyAuctions] = useState<AuctionSummaryResponse[]>([]);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [status, setStatus] = useState<"all" | "open" | "closed">("all");
  const statuses = ["all", "open", "closed"] as const;

  useEffect(() => {
    const fetchMyAuctions = async () => {
      setMyAuctions(await getMyAuctions(status, debouncedSearch));
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
      <AuctionListCard auctions={myAuctions} />
    </section>
  );
};

export default MyAuctionsPage;
