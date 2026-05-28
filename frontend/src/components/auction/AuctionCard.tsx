import type { AuctionSummaryResponse } from "@/types/auction";
import { formatDate } from "@/utils/dateUtils";
import { getImageUrl } from "@/utils/imageUtils";
import { Link } from "react-router";

const AuctionCard = ({ auction }: { auction: AuctionSummaryResponse }) => {
  return (
    <article className="auction-card">
      <img src={getImageUrl(auction.imageUrl)} alt={auction.title} />
      <div className="app-card-body">
        <div>
          <p className="app-muted">Seller: {auction.ownerUsername}</p>
          <h2 className="app-card-title">{auction.title}</h2>
        </div>
        <div>
          <p className="app-price">
            {auction.currentHighestBid ?? auction.startingPrice} kr
          </p>
          <p className="app-muted">
            {auction.bidCount > 0 ? "Current bid" : "Starting price"}
          </p>
        </div>
        <p className="app-muted">
          {auction.isOpen ? "Ends: " : "Ended: "} {formatDate(auction.endTime)}
        </p>
        <Link
          className="app-button app-button-primary mt-auto"
          to={`/auctions/${auction.auctionId}`}
        >
          View auction
        </Link>
      </div>
    </article>
  );
};

export default AuctionCard;
