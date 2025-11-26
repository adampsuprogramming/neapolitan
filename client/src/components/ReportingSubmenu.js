import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function ReportingSubmenu() {
  return (
    <div>
      <nav className="reporting-nav">
        <NavLink
          to="rollforward"
          className={({ isActive }) => (isActive ? "reporting-nav-highlighted" : "")}
        >
          Periodic Rollforward
        </NavLink>

        <NavLink
          to="assetbalancereport"
          className={({ isActive }) => (isActive ? "reporting-nav-highlighted" : "")}
        >
          Asset Balance Report
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
