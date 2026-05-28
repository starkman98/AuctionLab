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
      const message =
        error instanceof Error ? error.message : "Failed to retract bid";
      setRetractBidError(message);
      window.alert(message);
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
        setUpdateError(
          error instanceof Error
            ? error.message
            : "Failed to update the auction",
        );
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <p className="app-page">Loading ...</p>;
  if (error) return <p className="app-page app-error">{error}</p>;
  if (!auction) return <p className="app-page">404 Auction Not Found</p>;

  return (
    <section className="app-page">
      <div className="app-detail">
        <img
          className="app-detail-image"
          src={getImageUrl(auction.imageUrl)}
          alt={auction?.title}
        />
        <div>
          <p className="app-kicker">Seller: {auction.ownerUsername}</p>
          <h1 className="app-title">{auction.title}</h1>
          <div className="my-6">
            <div className="app-stat">
              <span className="app-muted">
                {auction.bids.length > 0 ? "Current bid" : "Starting price"}
              </span>
              <strong>
                {auction.currentHighestBid ?? auction.startingPrice} kr
              </strong>
            </div>
            <div className="app-stat">
              <span className="app-muted">{auction.isOpen ? "Ends" : "Ended"}</span>
              <strong>{formatDate(auction.endTime)}</strong>
            </div>
            <div className="app-stat">
              <span className="app-muted">Bids</span>
              <strong>{auction.bids.length}</strong>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {user?.userId === auction.ownerId && auction.isOpen && (
              <button
                className="app-button"
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
                  className="app-button app-button-primary"
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
                  className="app-button app-button-primary"
                >
                  Place bid
                </button>
              ))}
            {auction.bids.length > 0 && auction.isOpen && (
              <button className="app-button" onClick={() => setShowBidsModal(true)}>
                Show bids
              </button>
            )}
          </div>
          {retractBidError && <p className="app-error">{retractBidError}</p>}
        </div>
      </div>

      <div className="mt-12 border-t border-black pt-8">
        <h2 className="app-subtitle mb-4">Description</h2>
        <p className="max-w-3xl text-lg leading-8">{auction.description}</p>
      </div>

      {showPlaceBidModal && (
        <div
          className="app-modal-backdrop"
          onClick={() => setShowPlaceBidModal(false)}
        >
          <div className="app-modal" onClick={(e) => e.stopPropagation()}>
            <div className="app-modal-head">
              <h2 className="app-subtitle text-xl">Place bid</h2>
              <button className="app-button" onClick={() => setShowPlaceBidModal(false)}>
                X
              </button>
            </div>
            <div className="p-5">
              {placeBidError && <p className="app-error">{placeBidError}</p>}
              <div className="app-stat">
                <span className="app-muted">Leading bid</span>
                <strong>{auction.currentHighestBid ?? 0} kr</strong>
              </div>
              <div className="app-field mt-5">
                <label className="app-label" htmlFor="bidAmount">
                  Amount
                </label>
                <input
                  id="bidAmount"
                  type="number"
                  value={bidAmount.amount}
                  onChange={(e) =>
                    setBidAmount({ amount: Number(e.target.value) })
                  }
                  placeholder="Your bid"
                  className="app-input"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={handlePlaceBid} className="app-button app-button-primary">
                  Place bid
                </button>
                <button onClick={() => setShowPlaceBidModal(false)} className="app-button">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBidsModal && auction.isOpen && (
        <div className="app-modal-backdrop" onClick={() => setShowBidsModal(false)}>
          <div className="app-modal" onClick={(e) => e.stopPropagation()}>
            <div className="app-modal-head">
              <h2 className="app-subtitle text-xl">Bid history</h2>
              <button className="app-button" onClick={() => setShowBidsModal(false)}>
                X
              </button>
            </div>
            <div className="p-5">
              <p className="mb-4 font-bold">
                {auction.bids.length} bids |{" "}
                {new Set(auction.bids.map((b) => b.bidderUsername)).size} bidders
              </p>
              <div className="app-table-wrap">
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>Bidder</th>
                      <th>Bid</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auction.bids.map((b) => (
                      <tr key={b.bidId}>
                        <td>{b.bidderUsername}</td>
                        <td className="font-semibold">{b.amount} kr</td>
                        <td>{formatDate(b.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={() => setShowBidsModal(false)} className="app-button mt-5 w-full">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div
          className="app-modal-backdrop"
          onClick={() => setShowUpdateModal(false)}
        >
          <div className="app-modal" onClick={(e) => e.stopPropagation()}>
            <div className="app-modal-head">
              <h2 className="app-subtitle text-xl">Update auction</h2>
              <button className="app-button" onClick={() => setShowUpdateModal(false)}>
                X
              </button>
            </div>
            <form
              className="p-5"
              onSubmit={(e) => {
                e.preventDefault();
                void handleUpdate();
              }}
            >
              {updateError && <p className="app-error">{updateError}</p>}
              <div className="app-field">
                <label className="app-label" htmlFor="updateTitle">
                  Title
                </label>
                <input
                  id="updateTitle"
                  className="app-input"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Title"
                  type="text"
                  autoComplete="off"
                />
                {updateFieldErrors.Title?.map((msg) => (
                  <p key={msg} className="app-error">
                    {msg}
                  </p>
                ))}
              </div>
              <div className="app-field">
                <label className="app-label" htmlFor="updateDescription">
                  Description
                </label>
                <textarea
                  id="updateDescription"
                  className="app-textarea"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description"
                  autoComplete="off"
                />
                {updateFieldErrors.Description?.map((msg) => (
                  <p key={msg} className="app-error">
                    {msg}
                  </p>
                ))}
              </div>
              <div className="app-field">
                <label className="app-label" htmlFor="updateImageUrl">
                  Image URL
                </label>
                <input
                  id="updateImageUrl"
                  className="app-input"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="Image URL"
                  type="url"
                  autoComplete="off"
                />
                {updateFieldErrors.ImageUrl?.map((msg) => (
                  <p key={msg} className="app-error">
                    {msg}
                  </p>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  className="app-button app-button-primary"
                  type="submit"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating auction..." : "Update"}
                </button>
                <button
                  className="app-button"
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AuctionPage;
