import { useEffect, useState } from "react";
import Spinner from "../spinner/Spinner";
import { type AdminAuctionResponse } from "@/types/admin";
import {
  getAuctions,
  inactivateAuction,
  reactivateAuction,
} from "@/api/adminAuctionApi";
import { useDebounce } from "@/hooks/useDebounce";
import { NavLink } from "react-router";

const AdminAuctionsTab = () => {
  const [auctions, setAuctions] = useState<AdminAuctionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [auctionsError, setAuctionsError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [isLoadingStatusId, setIsLoadingStatusId] = useState<number | null>(
    null,
  );

  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 300);

  const [status, setStatus] = useState<"all" | "open" | "closed">("all");
  const statuses = ["all", "open", "closed"] as const;

  useEffect(() => {
    const fetchAuctions = async () => {
      setIsLoading(true);
      setAuctionsError("");
      setStatusError("");
      try {
        const response = await getAuctions(status, 1, 20, debounceSearch);

        setAuctions(response);
      } catch (error) {
        setAuctionsError(
          error instanceof Error ? error.message : "Failed to load auctions",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuctions();
  }, [debounceSearch, status]);

  const handleStatus = async (auction: AdminAuctionResponse) => {
    setIsLoadingStatusId(auction.auctionId);
    setAuctionsError("");
    setStatusError("");

    try {
      const updated =
        auction.inactivatedAt === null
          ? await inactivateAuction(auction.auctionId)
          : await reactivateAuction(auction.auctionId);

      setAuctions((prev) =>
        prev.map((a) => (a.auctionId === updated.auctionId ? updated : a)),
      );
    } catch (error) {
      setStatusError(
        error instanceof Error ? error.message : "Failed to change status",
      );
    } finally {
      setIsLoadingStatusId(null);
    }
  };

  return (
    <section>
      <div className="app-toolbar justify-between">
        <h2 className="app-subtitle">Auctions</h2>
        <div className="grid w-full gap-3 md:w-auto">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search auctions..."
            className="app-input max-w-sm"
          />
          <div className="grid grid-cols-3 gap-3">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`app-button app-filter capitalize ${
                  status === s ? "app-filter-active" : ""
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        {isLoading && <Spinner sizeClass="h-8 w-8" thickClass="border-4" />}
      </div>
      {(statusError || auctionsError) && (
        <div className="app-error">
          {statusError && <p>{statusError}</p>}
          {auctionsError && <p>{auctionsError}</p>}
        </div>
      )}
      <div className="app-mobile-list">
        {auctions.map((auction) => (
          <article className="app-mobile-row" key={auction.auctionId}>
            <NavLink
              className="app-mobile-row-title underline"
              to={`/auctions/${auction.auctionId}`}
            >
              {auction.title}
            </NavLink>
            <div className="mt-3">
              <div className="app-mobile-row-line">
                <span className="app-mobile-row-label">Owner</span>
                <span className="app-mobile-row-value">
                  {auction.ownerUsername}
                </span>
              </div>
              <div className="app-mobile-row-line">
                <span className="app-mobile-row-label">Bids</span>
                <span className="app-mobile-row-value">{auction.bidCount}</span>
              </div>
              <div className="app-mobile-row-line">
                <span className="app-mobile-row-label">Status</span>
                <span className="app-mobile-row-value">
                  {auction.inactivatedAt === null
                    ? auction.isOpen
                      ? "Open"
                      : "Closed"
                    : "Inactivated"}
                </span>
              </div>
            </div>
            {(auction.isOpen || auction.inactivatedAt !== null) && (
              <div className="app-mobile-row-actions">
                <button
                  className="app-button"
                  onClick={() => handleStatus(auction)}
                >
                  {isLoadingStatusId === auction.auctionId ? (
                    <Spinner />
                  ) : auction.isActive ? (
                    "Inactivate"
                  ) : (
                    "Activate"
                  )}
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
      <div className="app-table-wrap app-admin-table">
        <table className="app-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Owner</th>
              <th>Bids</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {auctions.map((auction) => (
              <tr key={auction.auctionId}>
                <td>
                  <NavLink
                    className="font-bold underline"
                    to={`/auctions/${auction.auctionId}`}
                  >
                    {auction.title}
                  </NavLink>
                </td>
                <td>{auction.ownerUsername}</td>
                <td>{auction.bidCount}</td>
                <td>
                  {auction.inactivatedAt === null
                    ? auction.isOpen
                      ? "Open"
                      : "Closed"
                    : "Inactivated"}
                </td>
                <td>
                  {(auction.isOpen || auction.inactivatedAt !== null) && (
                    <button
                      className="app-button"
                      onClick={() => handleStatus(auction)}
                    >
                      {isLoadingStatusId === auction.auctionId ? (
                        <Spinner />
                      ) : auction.isActive ? (
                        "Inactivate"
                      ) : (
                        "Activate"
                      )}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminAuctionsTab;
