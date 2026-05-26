import { useAuth } from "@/hooks/useAuth";
import { NavLink } from "react-router";

const Nav = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const navStyle = "flex items-center hover:bg-gray-100 px-4";
  const activeNavStyle = navStyle + " font-bold border-b-3 bg-gray-100";

  return (
    <nav className="text-xl flex items-stretch h-full text-center">
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
        <button onClick={logout} className={navStyle + " cursor-pointer"}>
          Logout
        </button>
      )}
    </nav>
  );
};

export default Nav;
