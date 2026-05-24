import type { MyBidResponse } from "@/types/bid";
import { formatDate } from "@/utils/dateUtils";
import { getImageUrl } from "@/utils/imageUtils";
import { Link } from "react-router";

const MyBidCard = ({ myBid }: { myBid: MyBidResponse }) => {
  return (
    <article>
      <img src={getImageUrl(myBid.imageUrl)} alt={myBid.auctionTitle} />
      <Link to={`/auctions/${myBid.auctionId}`}>{myBid.auctionTitle}</Link>
      <p>Your bid: {myBid.myBidAmount}</p>
      <p>Highest bid: {myBid.currentHighestBid}</p>
      <p>{myBid.isWinning ? "You are winning" : "You lost"}</p>
      <p>{myBid.isOpen ? `Ends: ${formatDate(myBid.endTime)}` : "Closed"}</p>
    </article>
  );
};

export default MyBidCard;
