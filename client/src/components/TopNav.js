import { Link, NavLink } from "react-router-dom";

const TopNav = () => {

  return (
    <nav className="navbar">
      <div className="nav-left-grouping">
        <div className="logo">
          <Link to="/">
            neapolitan &gt;
          </Link>
        </div>

        <div className="nav-mid">
          
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

            <NavLink
              to="/reporting"
              className={({ isActive }) =>
                isActive ? "nav-button highlighted" : "nav-button"
              }
            >
              reporting
            </NavLink>

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "nav-button highlighted" : "nav-button"
              }
            >
              dashboard
            </NavLink>

            
            <NavLink
              to="/configuration"
              className={({ isActive }) =>
                isActive ? "nav-button highlighted" : "nav-button"
              }
            >
              configuration
            </NavLink>
          
        </div>
      </div>
      <div className="nav-right">
        <div>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              isActive ? "nav-button highlighted" : "nav-button"
            }
          >
            users
          </NavLink>
      </div>
    </div>

    </nav>
  );
};

export default TopNav;
