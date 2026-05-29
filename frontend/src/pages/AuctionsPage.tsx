import { getAuctions } from "@/api/auctionApi";
import AuctionListCard from "@/components/auction/AuctionListCard";
import Spinner from "@/components/spinner/Spinner";
import { useDebounce } from "@/hooks/useDebounce";
import type { AuctionSummaryResponse } from "@/types/auction";
import { useEffect, useState } from "react";

const AuctionsPage = () => {
  const [auctions, setAuctions] = useState<AuctionSummaryResponse[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [status, setStatus] = useState<"all" | "open" | "closed">("all");
  const statuses = ["all", "open", "closed"] as const;

  const [page, setPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    const fetchAuctions = async () => {
      setIsLoading(true);
      setError("");
      setTotalPages(1);

      try {
        const data = await getAuctions(debouncedSearch, status, page, pageSize);
        setAuctions(data.items);
        setTotalPages(data.totalPages);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load auctions",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuctions();
  }, [debouncedSearch, status, page, pageSize]);

  return (
    <section className="app-page">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="app-kicker">Browse lots</p>
          <h1 className="app-title">Auctions</h1>
        </div>
        {isLoading && <Spinner sizeClass="h-8 w-8" thickClass="border-4" />}
      </div>

      <div className="app-toolbar">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search auctions..."
          className="app-input max-w-md"
        />
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatus(s);
              setPage(1);
            }}
            className={`app-button app-filter capitalize ${
              status === s ? "app-filter-active" : ""
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {error && <p className="app-error">{error}</p>}
      <AuctionListCard auctions={auctions} />

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            className="app-button"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>
          <p className="font-black uppercase">
            Page {page} of {totalPages}
          </p>
          <button
            className="app-button"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default AuctionsPage;
