import { getMyBids } from "@/api/bidApi";
import MyBidListCard from "@/components/bid/MyBidListCard";
import { useAuth } from "@/hooks/useAuth";
import type { MyBidResponse } from "@/types/bid";
import { useEffect, useState } from "react";

const MyBidsPage = () => {
  const { user } = useAuth();
  const [myBids, setMyBids] = useState<MyBidResponse[]>([]);

  useEffect(() => {
    const fetchMyBids = async () => {
      setMyBids(await getMyBids());
    };
    fetchMyBids();
  }, []);

  return (
    <section className="text-lg">
      <h1>{user?.userName}:s Bids</h1>
      <MyBidListCard myBids={myBids} />
    </section>
  );
};

export default MyBidsPage;
