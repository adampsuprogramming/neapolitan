import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function BorrowBase() {
  return (
    <div>
      <nav className="borrow-base-nav">
        <NavLink
          to="borrowbaselineitemview"
          className={({ isActive }) =>
            isActive ? "borrow-base-nav-highlighted" : ""
          }
        >
          Line Item View
        </NavLink>

        <NavLink
          to="borrowbasecalcview"
          className={({ isActive }) =>
            isActive ? "borrow-base-nav-highlighted" : ""
          }
        >
          Calculation View
        </NavLink>
        <NavLink
          to="borrowbasecovenantview"
          className={({ isActive }) =>
            isActive ? "borrow-base-nav-highlighted" : ""
          }
        >
          Covenant View
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
