import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function LoanTrancheTransactions() {
  return (
    <div>
      <nav className="loan-tranche-sub-nav">
        <NavLink
          to="loantranchecreate"
          className={({ isActive }) => (isActive ? "loan-tranche-sub-nav-highlighted" : "")}
        >
          Create
        </NavLink>

        <NavLink
          to="loantranchemodify"
          className={({ isActive }) => (isActive ? "loan-tranche-sub-nav-highlighted" : "")}
        >
          Modify
        </NavLink>
        <NavLink
          to="loantranchedelete"
          className={({ isActive }) => (isActive ? "loan-tranche-sub-nav-highlighted" : "")}
        >
          Delete
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
