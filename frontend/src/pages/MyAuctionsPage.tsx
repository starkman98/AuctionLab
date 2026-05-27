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
    <section className="text-lg">
      <h1>{user?.userName}:s Auctions</h1>
      <div className="flex gap-x-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search auctions..."
          className="border px-3"
        />
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`capitalize px-4 py-1 rounded-full border text-sm font-medium transition-colors cursor-pointer 
              ${
                status === s
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 broder-gray-300 hover:border-gray-500 hover:underline"
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
