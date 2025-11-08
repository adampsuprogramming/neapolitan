import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function Performance() {
  return (
    <div>
      <nav className="performance-nav">
        <NavLink
          to="updaterates"
          className={({ isActive }) => (isActive ? "performance-nav-highlighted" : "")}
        >
          Update Rates
        </NavLink>

        <NavLink
          to="updatemetrics"
          className={({ isActive }) => (isActive ? "performance-nav-highlighted" : "")}
        >
          Update Metrics
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
