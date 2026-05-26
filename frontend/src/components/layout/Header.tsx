import { NavLink } from "react-router";
import Nav from "./Nav";

const Header = () => {
  return (
    <div className="flex items-stretch justify-between w-full px-10 h-20 text-center border-b border-gray-300">
      <NavLink to="/" className="flex items-center">
        <h1 className="text-4xl font-bold">AuctionLab</h1>
      </NavLink>
      <div className="">
        <Nav />
      </div>
    </div>
  );
};

export default Header;
