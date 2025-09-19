import "./App.css";
import TopNav from "./TopNav";
import BorrowBase from "./BorrowBase";
import NewFacility from "./NewFacility";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";

function App() {
  return (
    <div className="App">
      {/* included as a test item and will be removed later */}
      <TopNav />
      {/* borrowing base page under development */}
      <BorrowBase />
      <NewFacility />
    </div>
  );
}

export default App;
