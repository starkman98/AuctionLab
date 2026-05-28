import type { MyBidResponse } from "@/types/bid";
import MyBidCard from "./MyBidCard";

const MyBidListCard = ({ myBids }: { myBids: MyBidResponse[] }) => {
  return (
    <ul className="app-card-grid">
      {myBids.map((bid) => (
        <li key={bid.auctionId}>
          <MyBidCard myBid={bid} />
        </li>
      ))}
    </ul>
  );
};

export default MyBidListCard;
