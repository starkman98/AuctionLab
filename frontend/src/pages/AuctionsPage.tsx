import { getAuctions } from "@/api/auctionApi";
import AuctionListCard from "@/components/auction/AuctionListCard";
import type { AuctionSummaryResponse } from "@/types/auction";
import { useEffect, useState } from "react";

const AuctionsPage = () => {
  const [auctions, setAuctions] = useState<AuctionSummaryResponse[]>([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      setAuctions(await getAuctions());
    };
    fetchAuctions();
  }, []);
  return (
    <section>
      <h1>Auctions</h1>
      <AuctionListCard auctions={auctions} />
    </section>
  );
};

export default AuctionsPage;
