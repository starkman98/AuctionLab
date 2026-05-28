import { getMyBids } from "@/api/bidApi";
import MyBidListCard from "@/components/bid/MyBidListCard";
import Spinner from "@/components/spinner/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import type { MyBidResponse } from "@/types/bid";
import { useEffect, useState } from "react";

const MyBidsPage = () => {
  const { user } = useAuth();
  const [myBids, setMyBids] = useState<MyBidResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const fetchMyBids = async () => {
      setIsLoading(true);
      setError("");
      try {
        setMyBids(await getMyBids(debouncedSearch));
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load bids");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyBids();
  }, [debouncedSearch]);

  return (
    <section className="app-page">
      <p className="app-kicker">{user?.userName}'s bidding</p>
      <h1 className="app-title">My Bids</h1>
      <div className="app-toolbar">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bid auctions..."
          className="app-input max-w-md"
        />
      </div>
      {isLoading && (
        <div className="app-loading">
          <Spinner sizeClass="h-8 w-8" thickClass="border-4" />
          <span>Loading bids</span>
        </div>
      )}
      {error && <p className="app-error">{error}</p>}
      {!isLoading && !error && <MyBidListCard myBids={myBids} />}
    </section>
  );
};

export default MyBidsPage;
