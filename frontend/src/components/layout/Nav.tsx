import { useAuth } from "@/hooks/useAuth";
import { NavLink } from "react-router";

const Nav = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="text-xl flex items-center gap-x-4">
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? "font-bold underline" : "")}
      >
        Auctions
      </NavLink>
      {!isAuthenticated && (
        <NavLink
          to="/login"
          className={({ isActive }) => (isActive ? "font-bold underline" : "")}
        >
          Login
        </NavLink>
      )}
      {!isAuthenticated && (
        <NavLink
          to="/register"
          className={({ isActive }) => (isActive ? "font-bold underline" : "")}
        >
          Register
        </NavLink>
      )}
      {isAuthenticated && (
        <NavLink
          to="/my-auctions"
          className={({ isActive }) => (isActive ? "font-bold underline" : "")}
        >
          My Auctions
        </NavLink>
      )}
      {isAuthenticated && (
        <NavLink
          to="/my-bids"
          className={({ isActive }) => (isActive ? "font-bold underline" : "")}
        >
          My Bids
        </NavLink>
      )}
      {isAuthenticated && (
        <NavLink
          to="/new-auction"
          className={({ isActive }) => (isActive ? "font-bold underline" : "")}
        >
          New Auction
        </NavLink>
      )}
      {isAuthenticated && (
        <NavLink
          to="/profile"
          className={({ isActive }) => (isActive ? "font-bold underline" : "")}
        >
          Profile
        </NavLink>
      )}
      {isAuthenticated && user?.role === "Admin" && (
        <NavLink
          to="/admin"
          className={({ isActive }) => (isActive ? "font-bold underline" : "")}
        >
          Admin
        </NavLink>
      )}
      {isAuthenticated && <button onClick={logout}>Logout</button>}
    </nav>
  );
};

export default Nav;
