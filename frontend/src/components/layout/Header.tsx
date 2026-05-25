import Nav from "./Nav";

const Header = () => {
  return (
    <div className="flex items-center justify-between w-full px-4 py-4 text-center border-b border-gray-300">
      <h1 className="text-4xl font-bold">AuctionLab</h1>
      <div className="">
        <Nav />
      </div>
    </div>
  );
};

export default Header;
