import { useAuth } from "@/hooks/useAuth";
import { NavLink } from "react-router";

const Nav = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const navStyle =
    "flex min-h-11 flex-1 items-center justify-center whitespace-nowrap border-b border-r border-black px-3 text-xs font-bold uppercase hover:bg-black hover:text-white md:min-h-0 md:flex-none md:border-b-0 md:border-l md:border-r-0 md:text-sm md:px-4";
  const activeNavStyle = navStyle + " bg-black text-white";

  return (
    <nav className="grid grid-cols-3 text-center sm:grid-cols-4 md:flex md:h-full md:items-stretch">
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? activeNavStyle : navStyle)}
      >
        Auctions
      </NavLink>
      {!isAuthenticated && (
        <NavLink
          to="/login"
          className={({ isActive }) => (isActive ? activeNavStyle : navStyle)}
        >
          Login
        </NavLink>
      )}
      {!isAuthenticated && (
        <NavLink
          to="/register"
          className={({ isActive }) => (isActive ? activeNavStyle : navStyle)}
        >
          Register
        </NavLink>
      )}
      {isAuthenticated && (
        <NavLink
          to="/my-auctions"
          className={({ isActive }) => (isActive ? activeNavStyle : navStyle)}
        >
          My Auctions
        </NavLink>
      )}
      {isAuthenticated && (
        <NavLink
          to="/my-bids"
          className={({ isActive }) => (isActive ? activeNavStyle : navStyle)}
        >
          My Bids
        </NavLink>
      )}
      {isAuthenticated && (
        <NavLink
          to="/new-auction"
          className={({ isActive }) => (isActive ? activeNavStyle : navStyle)}
        >
          New Auction
        </NavLink>
      )}
      {isAuthenticated && user?.role === "Admin" && (
        <NavLink
          to="/admin?tab=users"
          className={({ isActive }) => (isActive ? activeNavStyle : navStyle)}
        >
          Admin
        </NavLink>
      )}
      {isAuthenticated && (
        <NavLink
          to="/profile"
          className={({ isActive }) => (isActive ? activeNavStyle : navStyle)}
        >
          Profile
        </NavLink>
      )}
      {isAuthenticated && (
        <button onClick={logout} className={navStyle}>
          Logout
        </button>
      )}
    </nav>
  );
};

export default Nav;
