import { getMyBids } from "@/api/bidApi";
import MyBidListCard from "@/components/bid/MyBidListCard";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import type { MyBidResponse } from "@/types/bid";
import { useEffect, useState } from "react";

const MyBidsPage = () => {
  const { user } = useAuth();
  const [myBids, setMyBids] = useState<MyBidResponse[]>([]);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const fetchMyBids = async () => {
      setMyBids(await getMyBids(debouncedSearch));
    };
    fetchMyBids();
  }, [debouncedSearch]);

  return (
    <section className="text-lg">
      <h1>{user?.userName}:s Bids</h1>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search bid auctions..."
        className="border px-3"
      />
      <MyBidListCard myBids={myBids} />
    </section>
  );
};

export default MyBidsPage;
