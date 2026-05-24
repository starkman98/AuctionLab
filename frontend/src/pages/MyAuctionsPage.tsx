import { getMyAuctions } from "@/api/auctionApi";
import AuctionListCard from "@/components/auction/AuctionListCard";
import { useAuth } from "@/hooks/useAuth";
import type { AuctionSummaryResponse } from "@/types/auction";
import { useEffect, useState } from "react";

const MyAuctionsPage = () => {
  const { user } = useAuth();
  const [myAuctions, setMyAuctions] = useState<AuctionSummaryResponse[]>([]);

  useEffect(() => {
    const fetchMyAuctions = async () => {
      setMyAuctions(await getMyAuctions());
    };
    fetchMyAuctions();
  }, []);
  return (
    <section className="text-lg">
      <h1>{user?.userName}:s Auctions</h1>
      <AuctionListCard auctions={myAuctions} />
    </section>
  );
};

export default MyAuctionsPage;
