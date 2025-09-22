import { Routes, Route, Link, NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function ConfigFacility() {
  return (
    <div>
      <nav className="config-facility-nav">
        <NavLink
          to="debtfacilitycreate"
          className={({ isActive }) =>
            isActive ? "config-nav-highlighted" : ""
          }
        >
          Create
        </NavLink>

        <NavLink
          to="debtfacilitymodify"
          className={({ isActive }) =>
            isActive ? "config-nav-highlighted" : ""
          }
        >
          Modify
        </NavLink>
        <NavLink
          to="debtfacilitydelete"
          className={({ isActive }) =>
            isActive ? "config-nav-highlighted" : ""
          }
        >
          Delete
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
