import { NavLink } from "react-router";
import Nav from "./Nav";

const Header = () => {
  return (
    <div className="border-b border-black bg-white">
      <div className="app-header-inner flex flex-col md:min-h-20 md:flex-row md:items-stretch md:justify-between">
        <NavLink
          to="/"
          className="flex items-center border-b border-black px-4 py-4 md:border-b-0 md:px-0 md:py-0"
        >
          <h1 className="text-2xl font-black uppercase md:text-4xl">
            AuctionLab
          </h1>
        </NavLink>
        <div className="w-full md:w-auto">
          <Nav />
        </div>
      </div>
    </div>
  );
};

export default Header;
