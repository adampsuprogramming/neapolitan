import { Routes, Route, Link, NavLink } from "react-router-dom";
import BorrowBaseLineItemView from "./BorrowBaseLineItemView";
import BorrowBaseCalcView from "./BorrowBaseCalcView";
import BorrowBaseCovenantView from "./BorrowBaseCovenantView";

export default function BorrowBase() {
  return (
    <div>
      <nav className="borrow-base-nav">
        <NavLink
          to="borrowbaselineitemview"
          className={({ isActive }) =>
            isActive ? "borrow-base-nav-highlighted" : ""
          }
        >
          Line Item View
        </NavLink>

        <NavLink
          to="borrowbasecalview"
          className={({ isActive }) =>
            isActive ? "borrow-base-nav-highlighted" : ""
          }
        >
          Calculation View
        </NavLink>
        <NavLink
          to="borrowbasecovenantview"
          className={({ isActive }) =>
            isActive ? "borrow-base-nav-highlighted" : ""
          }
        >
          Covenant View
        </NavLink>
      </nav>
      <Routes>
        <Route
          path="borrowbaselineitemview"
          element={<BorrowBaseLineItemView />}
        />
        <Route path="borrowbasecalview" element={<BorrowBaseCalcView />} />
        <Route
          path="borrowbasecovenantview"
          element={<BorrowBaseCovenantView />}
        />
      </Routes>
    </div>
  );
}