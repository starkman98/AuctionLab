import type { AuctionSummaryResponse } from "@/types/auction";
import { formatDate } from "@/utils/dateUtils";
import { getImageUrl } from "@/utils/imageUtils";
import { Link } from "react-router";

const AuctionCard = ({ auction }: { auction: AuctionSummaryResponse }) => {
  return (
    <article>
      <img src={getImageUrl(auction.imageUrl)} alt={auction.title} />
      <h2>{auction.title}</h2>
      <p>Seller: {auction.ownerUsername}</p>
      <p>
        Current bid: {auction.currentHighestBid ?? auction.startingPrice} kr
      </p>
      <p>Ends: {formatDate(auction.endTime)}</p>
      <Link to={`/auctions/${auction.auctionId}`}>View auction</Link>
    </article>
  );
};

export default AuctionCard;
