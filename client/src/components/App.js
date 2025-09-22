import "./App.css";
import TopNav from "./TopNav";
import BorrowBase from "./BorrowBase";
import Transactions from "./Transactions";
import Performance from "./Performance";
import Reporting from "./Reporting";
import Dashboard from "./Dashboard";
import Configuration from "./Configuration";
import ConfigFacility from "./ConfigFacility";
import ConfigBank from "./ConfigBank";
import ConfigPortfolio from "./ConfigPortfolio";
import DebtFacilityCreate from "./DebtFacilityCreate";
import DebtFacilityModify from "./DebtFacilityModify";
import DebtFacilityDelete from "./DebtFacilityDelete";
import Home from "./Home";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="page">
      <TopNav />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/borrowingbase/*" element={<BorrowBase />} />
          <Route path="/transactions/*" element={<Transactions />} />
          <Route path="/performance/*" element={<Performance />} />
          <Route path="/reporting/*" element={<Reporting />} />
          <Route path="/dashboard/*" element={<Dashboard />} />

          <Route path="/configuration/*" element={<Configuration />}>
            <Route path="configfacility/*" element={<ConfigFacility />}>
              <Route
                path="debtfacilitycreate"
                element={<DebtFacilityCreate />}
              />
              <Route
                path="debtfacilitymodify"
                element={<DebtFacilityModify />}
              />
              <Route
                path="debtfacilitydelete"
                element={<DebtFacilityDelete />}
              />
            </Route>
            <Route path="configbank/*" element={<ConfigBank />} />
            <Route path="configportfolio/*" element={<ConfigPortfolio />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
