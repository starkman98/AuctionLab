import { getAuctions } from "@/api/auctionApi";
import AuctionListCard from "@/components/auction/AuctionListCard";
import { useDebounce } from "@/hooks/useDebounce";
import type { AuctionSummaryResponse } from "@/types/auction";
import { useEffect, useState } from "react";

const AuctionsPage = () => {
  const [auctions, setAuctions] = useState<AuctionSummaryResponse[]>([]);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [status, setStatus] = useState<"all" | "open" | "closed">("open");
  const statuses = ["all", "open", "closed"] as const;

  useEffect(() => {
    const fetchAuctions = async () => {
      setAuctions(await getAuctions(debouncedSearch, status));
    };
    fetchAuctions();
  }, [debouncedSearch, status]);
  return (
    <section className="text-lg">
      <h1>Auctions</h1>
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
      <AuctionListCard auctions={auctions} />
    </section>
  );
};

export default AuctionsPage;
