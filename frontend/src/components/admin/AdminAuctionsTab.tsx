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
    <section className="mx-auto max-w-4xl px-5">
      <div className="flex justify-between">
        <h2 className="text-2xl">Auctions</h2>
        <div className="flex gap-x-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="border px-3"
          />
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`capitalize px-4 py-1 rounded-full border text-sm font-medium transition-colors cursor-pointer 
              ${
                status === s
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 broder-gray-300 hover:border-gray-500 hover:underline"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="text-red-600 flex items-end">
          {statusError && <p>{statusError}</p>}
          {auctionsError && <p>{auctionsError}</p>}
        </div>
        {isLoading && <Spinner sizeClass="w-12 h-12" thickClass="border-4" />}
      </div>
      <table className="mt-4">
        <thead>
          <tr className="font-bold border-b border-gray-300">
            <td>Title</td>
            <td className="px-6">Owner</td>
            <td className="px-6">Bids</td>
            <td className="px-6">Status</td>
            <td className="pl-6">Actions</td>
          </tr>
        </thead>
        <tbody>
          {auctions.map((auction) => (
            <tr className="border-b border-gray-300">
              <td className="pr-6 py-4">
                <NavLink
                  className="hover:underline"
                  to={`/auctions/${auction.auctionId}`}
                >
                  {auction.title}
                </NavLink>
              </td>
              <td className="px-6">{auction.ownerUsername}</td>
              <td className="px-6">{auction.bidCount}</td>
              <td className="px-6 min-w-30">
                {auction.inactivatedAt === null
                  ? auction.isOpen
                    ? "Open"
                    : "Closed"
                  : "Inactivated"}
              </td>
              <td className="pl-6">
                {(auction.isOpen || auction.inactivatedAt !== null) && (
                  <button
                    className="px-2 py-0.5 border mr-4 min-w-30 hover:underline cursor-pointer"
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
    </section>
  );
};

export default AdminAuctionsTab;
