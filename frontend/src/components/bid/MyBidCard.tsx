import type { MyBidResponse } from "@/types/bid";
import { formatDate } from "@/utils/dateUtils";
import { getImageUrl } from "@/utils/imageUtils";
import { Link } from "react-router";

const MyBidCard = ({ myBid }: { myBid: MyBidResponse }) => {
  return (
    <article className="bid-card">
      <img src={getImageUrl(myBid.imageUrl)} alt={myBid.auctionTitle} />
      <div className="app-card-body">
        <Link className="app-card-title" to={`/auctions/${myBid.auctionId}`}>
          {myBid.auctionTitle}
        </Link>
        <div>
          <p className="app-price">{myBid.myBidAmount} kr</p>
          <p className="app-muted">Your bid</p>
        </div>
        <p>Highest bid: {myBid.currentHighestBid} kr</p>
        <p className="font-bold">
          {myBid.isOpen
            ? myBid.isWinning
              ? "You are leading."
              : "You got outbid."
            : myBid.isWinning
              ? "Congratulations, you won."
              : "Unfortunately, you lost."}
        </p>
        <p className="app-muted">
          {myBid.isOpen ? `Ends: ${formatDate(myBid.endTime)}` : "Closed"}
        </p>
      </div>
    </article>
  );
};

export default MyBidCard;
