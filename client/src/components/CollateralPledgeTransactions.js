import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function CollateralPledgeTransactions() {
  return (
    <div>
      <nav className="collateral-transactions-sub-nav">
        <NavLink
          to="collateralpledgeadd"
          className={({ isActive }) =>
            isActive ? "collateral-transactions-sub-nav-highlighted" : ""
          }
        >
          Create
        </NavLink>

        <NavLink
          to="collateralpledgeremove"
          className={({ isActive }) =>
            isActive ? "collateral-transactions-sub-nav-highlighted" : ""
          }
        >
          Remove
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
