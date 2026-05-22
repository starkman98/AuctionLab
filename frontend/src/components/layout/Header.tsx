import Nav from "./Nav";

const Header = () => {
  return (
    <header className="mx-auto px-4 py-4 text-center">
      <h1 className="text-4xl font-bold">AuctionLab</h1>
      <Nav />
    </header>
  );
};

export default Header;
