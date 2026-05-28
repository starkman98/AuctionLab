import { getAuction, updateAuction } from "@/api/auctionApi";
import { placeBid, retractBid } from "@/api/bidApi";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/types/apiError";
import type {
  AuctionDetailResponse,
  UpdateAuctionRequest,
} from "@/types/auction";
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
  const [showPlaceBidModal, setShowPlaceBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState<PlaceBidRequest>({ amount: 0 });
  const [placeBidError, setPlaceBidError] = useState<string>();
  const [retractBidError, setRetractBidError] = useState<string>();
  const [showBidsModal, setShowBidsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateError, setUpdateError] = useState<string>();
  const [updateFieldErrors, setUpdateFieldErrors] = useState<
    Record<string, string[]>
  >({});
  const [isUpdating, setIsUpdating] = useState(false);

  const userHasHighestBid = auction?.bids[0]?.bidderUsername === user?.userName;

  const [form, setForm] = useState<UpdateAuctionRequest>({
    title: "",
    description: "",
    imageUrl: undefined,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) =>
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value === "" ? undefined : e.target.value,
    }));

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
    setPlaceBidError("");
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
      setShowPlaceBidModal(false);
    } catch (error) {
      setPlaceBidError(
        error instanceof Error ? error.message : "Failed to place bid",
      );
    }
  };

  const handleRetractBid = async () => {
    if (!auction?.bids?.[0]?.bidId) return;

    setRetractBidError("");

    try {
      await retractBid(auction?.bids[0].bidId);

      setAuction(
        (prev) =>
          prev && {
            ...prev,
            currentHighestBid: prev.bids[1]?.amount ?? null,
            bids: prev.bids.slice(1),
          },
      );
    } catch (error) {
      setRetractBidError(
        error instanceof Error ? error.message : "Failed to retract bid",
      );
      window.alert(retractBidError);
    }
  };

  const handleUpdate = async () => {
    if (!auction?.auctionId) return;
    setUpdateError("");
    setUpdateFieldErrors({});
    setIsUpdating(true);
    try {
      const response = await updateAuction(auction?.auctionId, form);

      setAuction(response);

      setShowUpdateModal(false);
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        setUpdateFieldErrors(error.fieldErrors);
      } else {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to update the auction",
        );
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <p>Loading ...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!auction) return <p>404 Auction Not Found</p>;

  return (
    <section className="text-lg px-6 py-12 mx-auto max-w-3xl">
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
        <button
          className="px-12 py-2 bg-neutral-200 mt-4 cursor-pointer"
          onClick={() => {
            setShowUpdateModal(true);
            setUpdateError("");
            setUpdateFieldErrors({});
            setForm({
              title: auction.title,
              description: auction.description,
              imageUrl: auction.imageUrl ?? undefined,
            });
          }}
        >
          Update
        </button>
      )}
      {user?.userId !== auction.ownerId &&
        auction.isOpen &&
        isAuthenticated &&
        (userHasHighestBid ? (
          <button
            onClick={() => {
              const ok = window.confirm(
                "Are you sure that you want to retract your bid?",
              );
              if (ok) handleRetractBid();
            }}
            className="px-12 py-2 bg-green-900 text-neutral-50 mt-4 cursor-pointer"
          >
            Retract bid
          </button>
        ) : (
          <button
            onClick={() => {
              setBidAmount({
                amount:
                  auction.currentHighestBid !== null
                    ? auction.currentHighestBid + 50
                    : auction.startingPrice,
              });
              setShowPlaceBidModal(true);
            }}
            className="px-12 py-2 bg-green-900 text-neutral-50 mt-4 cursor-pointer"
          >
            Place bid
          </button>
        ))}
      {auction.bids.length > 0 && auction.isOpen && (
        <button
          className="underline cursor-pointer"
          onClick={() => setShowBidsModal(true)}
        >
          Show bids
        </button>
      )}
      {showPlaceBidModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowPlaceBidModal(false)}
        >
          <div
            className="bg-white text-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex items-center justify-center w-full border-b border-gray-300">
              <h2 className="text-center font-bold py-4">Place bid</h2>
              <button
                className="absolute right-4 text-2xl cursor-pointer"
                onClick={() => setShowPlaceBidModal(false)}
              >
                X
              </button>
            </div>
            {placeBidError && <p className="text-red-600">{placeBidError}</p>}
            <div className="p-4 border-b border-gray-300">
              <p>
                Leading bid:{" "}
                <span className="font-semibold">
                  {auction.currentHighestBid} kr
                </span>
              </p>
            </div>
            <div className="flex flex-col p-4">
              <label>Amount</label>
              <div className="relative w-full">
                <input
                  type="number"
                  value={bidAmount.amount}
                  onChange={(e) =>
                    setBidAmount({ amount: Number(e.target.value) })
                  }
                  placeholder="Your bid"
                  className="bg-neutral-200 pr-8 p-1 w-full"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  kr
                </span>
              </div>
            </div>
            <div className="p-4">
              <button
                onClick={handlePlaceBid}
                className="px-12 py-2 bg-green-900 text-neutral-50 mr-2 cursor-pointer"
              >
                Place bid
              </button>
              <button
                onClick={() => setShowPlaceBidModal(false)}
                className="px-12 py-2 bg-neutral-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showBidsModal && auction.isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowBidsModal(false)}
        >
          <div
            className="bg-white text-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex items-center justify-center w-full border-b border-gray-300">
              <h2 className="text-center font-bold py-4">Bid history</h2>
              <button
                className="absolute right-4 text-2xl cursor-pointer"
                onClick={() => setShowBidsModal(false)}
              >
                X
              </button>
            </div>
            <div className="overflow-y-auto max-h-[70vh] pb-4 px-4">
              <p className="py-4">
                {auction.bids.length} bids |{" "}
                {new Set(auction.bids.map((b) => b.bidderUsername)).size}{" "}
                bidders
              </p>
              {error && <p className="text-red-600">{error}</p>}

              <div>
                <table>
                  <thead className="font-bold border-b border-gray-300">
                    <tr>
                      <th className="text-left">Bidder</th>
                      <th className="text-center">Bid</th>
                      <th className="text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auction.bids.map((b) => (
                      <tr className="border-b border-gray-300 pt-4">
                        <td className="pr-8 py-4">{b.bidderUsername}</td>
                        <td className="px-8 font-semibold">{b.amount} kr</td>
                        <td className="pl-8">{formatDate(b.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4">
              <button
                onClick={() => setShowBidsModal(false)}
                className="w-full px-12 py-2 bg-neutral-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showUpdateModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowUpdateModal(false)}
        >
          <div className="bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="relative flex items-center justify-center w-full border-b border-gray-300">
              <h2 className="text-center font-bold py-4">Update auction</h2>
              <button
                className="absolute right-4 text-2xl cursor-pointer"
                onClick={() => setShowUpdateModal(false)}
              >
                X
              </button>
            </div>
            {updateError && <p className="text-red-600">{updateError}</p>}
            <form
              className="mx-auto max-w-2xl border border-neutral-800 p-8"
              onSubmit={(e) => {
                e.preventDefault();
                void handleUpdate();
              }}
            >
              <div className="flex flex-col mb-3">
                <label>Title</label>
                <input
                  className="bg-neutral-200"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Title"
                  type="text"
                  autoComplete="off"
                />
                {updateFieldErrors.Title?.map((msg) => (
                  <p key={msg} className="text-red-600">
                    {msg}
                  </p>
                ))}
              </div>
              <div className="flex flex-col mb-3">
                <label>Description</label>
                <textarea
                  className="bg-neutral-200 min-h-12 px-2 py-1"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description"
                  autoComplete="off"
                />
                {updateFieldErrors.Description?.map((msg) => (
                  <p key={msg} className="text-red-600">
                    {msg}
                  </p>
                ))}
              </div>
              <div className="flex flex-col mb-3">
                <label>Image URL</label>
                <input
                  className="bg-neutral-200"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="Image URL"
                  type="url"
                  autoComplete="off"
                />
                {updateFieldErrors.ImageUrl?.map((msg) => (
                  <p key={msg} className="text-red-600">
                    {msg}
                  </p>
                ))}
              </div>
              <button
                className="px-12 py-2 bg-green-900 text-neutral-50 mt-4 mr-2 cursor-pointer"
                type="submit"
                disabled={isUpdating}
              >
                {isUpdating ? "Updating auction..." : "Update"}
              </button>
              <button
                className="px-12 py-2 bg-neutral-200 cursor-pointer mt-4"
                onClick={() => setShowUpdateModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AuctionPage;
