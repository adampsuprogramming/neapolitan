import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function LoanApprovalTransactions() {
  return (
    <div>
      <nav className="loan-approval-sub-nav">
        <NavLink
          to="loanapprovalcreate"
          className={({ isActive }) =>
            isActive ? "loan-approval-sub-nav-highlighted" : ""
          }
        >
          Create
        </NavLink>

        <NavLink
          to="loanapprovalmodify"
          className={({ isActive }) =>
            isActive ? "loan-approval-sub-nav-highlighted" : ""
          }
        >
          Modify
        </NavLink>
        <NavLink
          to="loanapprovaldelete"
          className={({ isActive }) =>
            isActive ? "loan-approval-sub-nav-highlighted" : ""
          }
        >
          Delete
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
