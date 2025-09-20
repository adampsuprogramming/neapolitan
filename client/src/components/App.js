import "./App.css";
import TopNav from "./TopNav";
import BorrowBase from "./BorrowBase";
import Transactions from "./Transactions";
import Performance from "./Performance";
import Reporting from "./Reporting";
import Dashboard from "./Dashboard";
import Configuration from "./Configuration";
import ConfigBank from "./ConfigBank";
import ConfigFacility from "./ConfigFacility";
import ConfigPortfolio from "./ConfigPortfolio";

import Home from "./Home";
import NewFacility from "./NewFacility";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="page">
      <TopNav />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/borrowingbase/*" element={<BorrowBase />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/reporting" element={<Reporting />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/configuration" element={<Configuration />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
