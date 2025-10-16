import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function BorrowerTransactions() {
  return (
    <div>
      <nav className="borrower-transactions-sub-nav">
        <NavLink
          to="borrowercreate"
          className={({ isActive }) =>
            isActive ? "borrower-transactions-sub-nav-highlighted" : ""
          }
        >
          Create
        </NavLink>

        <NavLink
          to="borrowermodify"
          className={({ isActive }) =>
            isActive ? "borrower-transactions-sub-nav-highlighted" : ""
          }
        >
          Modify
        </NavLink>
        <NavLink
          to="borrowerdelete"
          className={({ isActive }) =>
            isActive ? "borrower-transactions-sub-nav-highlighted" : ""
          }
        >
          Delete
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
