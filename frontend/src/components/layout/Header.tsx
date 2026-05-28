import { NavLink } from "react-router";
import Nav from "./Nav";

const Header = () => {
  return (
    <div className="flex min-h-20 w-full items-stretch justify-between border-b border-black bg-white px-4 md:px-10">
      <NavLink to="/" className="flex items-center">
        <h1 className="text-2xl font-black uppercase md:text-4xl">
          AuctionLab
        </h1>
      </NavLink>
      <div className="overflow-x-auto">
        <Nav />
      </div>
    </div>
  );
};

export default Header;
