import { getAuctions } from "@/api/auctionApi";
import AuctionListCard from "@/components/auction/AuctionListCard";
import { useDebounce } from "@/hooks/useDebounce";
import type { AuctionSummaryResponse } from "@/types/auction";
import { useEffect, useState } from "react";

const AuctionsPage = () => {
  const [auctions, setAuctions] = useState<AuctionSummaryResponse[]>([]);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const fetchAuctions = async () => {
      setAuctions(await getAuctions(debouncedSearch));
    };
    fetchAuctions();
  }, [debouncedSearch]);
  return (
    <section className="text-lg">
      <h1>Auctions</h1>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search auctions..."
        className="border px-3"
      />
      <AuctionListCard auctions={auctions} />
    </section>
  );
};

export default AuctionsPage;
