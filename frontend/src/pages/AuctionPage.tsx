import { getAuction } from "@/api/auctionApi";
import { placeBid } from "@/api/bidApi";
import { useAuth } from "@/hooks/useAuth";
import type { AuctionDetailResponse } from "@/types/auction";
import type { PlaceBidRequest } from "@/types/bid";
import { formatDate } from "@/utils/dateUtils";
import { getImageUrl } from "@/utils/imageUtils";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const AuctionPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [auction, setAuction] = useState<AuctionDetailResponse>();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState<PlaceBidRequest>({ amount: 0 });
  const [bidError, setBidError] = useState<string>();

  useEffect(() => {
    if (!id) return;
    const fetchAuction = async () => {
      setError("");
      setIsLoading(true);
      try {
        const response = await getAuction(id);
        setAuction(response);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load auction",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuction();
  }, [id]);

  const handlePlaceBid = async () => {
    if (!auction?.auctionId) return;
    setBidError("");
    try {
      const response = await placeBid(auction?.auctionId, bidAmount);

      setAuction(
        (prev) =>
          prev && {
            ...prev,
            currentHighestBid: response.amount,
            bids: [response, ...prev.bids],
          },
      );
      setBidAmount({ amount: 0 });
      setShowBidModal(false);
    } catch (error) {
      setBidError(
        error instanceof Error ? error.message : "Failed to place bid",
      );
    }
  };

  if (isLoading) return <p>Loading ...</p>;
  if (error) return <p>{error}</p>;
  if (!auction) return <p>Something went wrong...</p>;

  return (
    <section className="px-6 py-12 mx-auto max-w-3xl">
      <img src={getImageUrl(auction.imageUrl)} alt={auction?.title} />
      <h2 className="text-xl">Seller: {auction.ownerUsername}</h2>
      <h1 className="font-semibold text-xl">{auction.title}</h1>
      <p>
        {auction.bids.length > 0
          ? "Current bid: " + auction.currentHighestBid
          : "Staring price: " + auction.startingPrice}
      </p>
      <p>
        {auction.isOpen ? "Ends: " : "Ended: "} {formatDate(auction.endTime)}
      </p>
      <h2 className="font-bold text-xl">Description</h2>
      <p>{auction.description}</p>
      {user?.userId === auction.ownerId && auction.isOpen && (
        <button className="px-12 py-2 bg-neutral-200 mt-4">Update</button>
      )}
      {user?.userId !== auction.ownerId &&
        auction.isOpen &&
        isAuthenticated && (
          <button
            onClick={() => {
              setBidAmount({
                amount:
                  auction.currentHighestBid !== null
                    ? auction.currentHighestBid + 50
                    : auction.startingPrice,
              });
              setShowBidModal(true);
            }}
            className="px-12 py-2 bg-green-900 text-neutral-50 mt-4"
          >
            Place bid
          </button>
        )}
      {auction.bids.length > 0 && (
        <button className="underline">Show bids</button>
      )}
      {showBidModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowBidModal(false)}
        >
          <div className="bg-white" onClick={(e) => e.stopPropagation()}>
            <h2>Place bid</h2>
            {bidError && <p>{bidError}</p>}
            <input
              type="number"
              value={bidAmount.amount}
              onChange={(e) => setBidAmount({ amount: Number(e.target.value) })}
              placeholder="Your bid"
            />
            <button
              onClick={handlePlaceBid}
              className="px-12 py-2 bg-green-900 text-neutral-50 mt-4"
            >
              Place bid
            </button>
            <button
              onClick={() => setShowBidModal(false)}
              className="px-12 py-2 bg-neutral-200 mt-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AuctionPage;
