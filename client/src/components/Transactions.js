import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function Transactions() {
  return (
    <div>
      <nav className="transactions-nav">
        <NavLink
          to="borrowertransactions"
          className={({ isActive }) => (isActive ? "transactions-nav-highlighted" : "")}
        >
          Borrower
        </NavLink>

        <NavLink
          to="loanagreementtransactions"
          className={({ isActive }) => (isActive ? "transactions-nav-highlighted" : "")}
        >
          Loan Agreement
        </NavLink>
        <NavLink
          to="loantranchetransactions"
          className={({ isActive }) => (isActive ? "transactions-nav-highlighted" : "")}
        >
          Loan Tranche
        </NavLink>

        <NavLink
          to="loanapprovaltransactions"
          className={({ isActive }) => (isActive ? "transactions-nav-highlighted" : "")}
        >
          Loan Approval
        </NavLink>

        <NavLink
          to="collateralpledgetransactions"
          className={({ isActive }) => (isActive ? "transactions-nav-highlighted" : "")}
        >
          Collateral Pledge
        </NavLink>

        <NavLink
          to="paymentsreceived"
          className={({ isActive }) => (isActive ? "transactions-nav-highlighted" : "")}
        >
          Payments Received
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
