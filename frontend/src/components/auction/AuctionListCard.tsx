import type { AuctionSummaryResponse } from "@/types/auction";
import AuctionCard from "./AuctionCard";

const AuctionListCard = ({
  auctions,
}: {
  auctions: AuctionSummaryResponse[];
}) => {
  return (
    <ul className="app-card-grid">
      {auctions.map((auction) => (
        <li key={auction.auctionId}>
          <AuctionCard auction={auction} />
        </li>
      ))}
    </ul>
  );
};

export default AuctionListCard;
