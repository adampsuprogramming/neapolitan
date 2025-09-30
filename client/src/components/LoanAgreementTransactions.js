import { Routes, Route, Link, NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function LoanAgreementTransactions() {
  return (
    <div>
      <nav className="loan-agreement-sub-nav">
        <NavLink
          to="loanagreementcreate"
          className={({ isActive }) =>
            isActive ? "loan-agreement-sub-nav-highlighted" : ""
          }
        >
          Create
        </NavLink>

        <NavLink
          to="loanagreementmodify"
          className={({ isActive }) =>
            isActive ? "loan-agreement-sub-nav-highlighted" : ""
          }
        >
          Modify
        </NavLink>
        <NavLink
          to="loanagreementdelete"
          className={({ isActive }) =>
            isActive ? "loan-agreement-sub-nav-highlighted" : ""
          }
        >
          Delete
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
