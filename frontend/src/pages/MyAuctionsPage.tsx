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

  useEffect(() => {
    const fetchMyAuctions = async () => {
      setMyAuctions(await getMyAuctions(debouncedSearch));
    };
    fetchMyAuctions();
  }, [debouncedSearch]);
  return (
    <section className="text-lg">
      <h1>{user?.userName}:s Auctions</h1>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search auctions..."
        className="border px-3"
      />
      <AuctionListCard auctions={myAuctions} />
    </section>
  );
};

export default MyAuctionsPage;
