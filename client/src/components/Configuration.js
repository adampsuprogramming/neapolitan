import { Routes, Route, Link, NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function Configuration() {
  return (
    <div>
      <nav className="config-nav">
        <NavLink
          to="configfacility"
          className={({ isActive }) =>
            isActive ? "config-nav-highlighted" : ""
          }
        >
          Debt Facility
        </NavLink>

        <NavLink
          to="configbank"
          className={({ isActive }) =>
            isActive ? "config-nav-highlighted" : ""
          }
        >
          Bank
        </NavLink>
        <NavLink
          to="configportfolio"
          className={({ isActive }) =>
            isActive ? "config-nav-highlighted" : ""
          }
        >
          Portfolio
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
