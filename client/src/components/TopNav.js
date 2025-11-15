import { Link, NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";

const TopNav = () => {
  const { user, isAuthenticated } = useAuth0();
  return (
    <nav className="navbar">
      <div className="nav-left-grouping">
        <div className="logo">
          <Link to="/">
            neapolitan <span className="arrow">&gt;</span>
          </Link>
        </div>

        <div className="nav-mid">
          <NavLink
            to="/borrowingbase/"
            className={({ isActive }) => (isActive ? "navbar-highlighted" : "")}
          >
            borrowing base
          </NavLink>

          <NavLink
            to="/transactions/"
            className={({ isActive }) => (isActive ? "navbar-highlighted" : "")}
          >
            transactions
          </NavLink>

          <NavLink
            to="/performance/"
            className={({ isActive }) => (isActive ? "navbar-highlighted" : "")}
          >
            performance
          </NavLink>

          <NavLink
            to="/reporting/"
            className={({ isActive }) => (isActive ? "navbar-highlighted" : "")}
          >
            reporting
          </NavLink>

          <NavLink
            to="/dashboard/"
            className={({ isActive }) => (isActive ? "navbar-highlighted" : "")}
          >
            dashboard
          </NavLink>

          <NavLink
            to="/configuration/"
            className={({ isActive }) => (isActive ? "navbar-highlighted" : "")}
          >
            configuration
          </NavLink>
        </div>
      </div>
      <div className="nav-right">
        {isAuthenticated && user ? (
          <>
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? "nav-button highlighted" : "nav-button")}
            >
              {user?.name}
            </NavLink>

            <LogoutButton />
          </>
        ) : (
          <LoginButton />
        )}
      </div>
    </nav>
  );
};

export default TopNav;
