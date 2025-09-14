import logo from "./logo.svg";
import "./App.css";
import TopNav from "./TopNav";
import BorrowBase from "./BorrowBase";

function App() {
  return (
    <div className="App">
      {/* included as a test item and will be removed later */}
      <TopNav /> 
      {/* borrowing base page under development */}
      <BorrowBase />
    </div>
  );
}

export default App;
