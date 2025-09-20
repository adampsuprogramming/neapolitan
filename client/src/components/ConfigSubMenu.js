import { Link, NavLink } from "react-router-dom";

const ConfigSubMenu = () => {
  return (
    <nav className="navbar">
      <NavLink
        to="/borrowingbase"
        className={({ isActive }) =>
          isActive ? "nav-button highlighted" : "nav-button"
        }
      >
        borrowing base
      </NavLink>

      <NavLink
        to="/transactions"
        className={({ isActive }) =>
          isActive ? "nav-button highlighted" : "nav-button"
        }
      >
        transactions
      </NavLink>

      <NavLink
        to="/performance"
        className={({ isActive }) =>
          isActive ? "nav-button highlighted" : "nav-button"
        }
      >
        performance
      </NavLink>
    </nav>
  );
};

export default ConfigSubMenu;
