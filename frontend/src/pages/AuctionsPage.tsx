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
  const pageSize = 5;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, setPage]);

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
    <section className="text-lg">
      <h1>Auctions</h1>
      <div className="flex gap-x-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search auctions..."
          className="border px-3"
        />
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatus(s);
              setPage(1);
            }}
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
      {isLoading && <Spinner />}
      {error && <p>{error}</p>}
      <AuctionListCard auctions={auctions} />
      <div className="flex justify-center gap-x-4">
        <button
          className="px-4 border cursor-pointer hover:underline disabled:opacity-40 disabled:hover:no-underline"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          ← Prev
        </button>
        <p>{page}</p>
        <button
          className="px-4 border cursor-pointer hover:underline disabled:opacity-40 disabled:hover:no-underline"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next →
        </button>
      </div>
    </section>
  );
};

export default AuctionsPage;
