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
          to="otherreporting"
          className={({ isActive }) => (isActive ? "reporting-nav-highlighted" : "")}
        >
          Other Reporting
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
