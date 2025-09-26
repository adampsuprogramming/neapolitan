import { Link, NavLink } from "react-router-dom";

const TopNav = () => {
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
        <NavLink
          to="/users"
          className={({ isActive }) =>
            isActive ? "nav-button highlighted" : "nav-button"
          }
        >
          user
        </NavLink>

        <NavLink
          to="/logout"
          className={({ isActive }) =>
            isActive ? "nav-button highlighted" : "nav-button"
          }
        >
          logout
        </NavLink>
      </div>
    </nav>
  );
};

export default TopNav;
