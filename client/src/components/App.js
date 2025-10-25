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
import BorrowBaseLineItemView from "./BorrowBaseLineItemView";
import BorrowBaseCovenantView from "./BorrowBaseCovenantView";
import BorrowBaseCalcView from "./BorrowBaseCalcView";
import BorrowerCreate from "./BorrowerCreate";
import BorrowerDelete from "./BorrowerDelete";
import BorrowerModify from "./BorrowerModify";
import BorrowerTransactions from "./BorrowerTransactions";
import CollateralPledgeTransactions from "./CollateralPledgeTransactions";
import CollateralPledgeAdd from "./CollateralPledgeAdd";
import CollateralPledgeRemove from "./CollateralPledgeRemove";
import LoanAgreementTransactions from "./LoanAgreementTransactions";
import LoanAgreementCreate from "./LoanAgreementCreate";
import LoanAgreementModify from "./LoanAgreementModify";
import LoanAgreementDelete from "./LoanAgreementDelete";
import LoanApprovalTransactions from "./LoanApprovalTransactions";
import LoanApprovalCreate from "./LoanApprovalCreate";
import LoanApprovalModify from "./LoanApprovalModify";
import LoanApprovalDelete from "./LoanApprovalDelete";
import LoanTrancheTransactions from "./LoanTrancheTransactions";
import LoanTrancheCreate from "./LoanTrancheCreate";
import LoanTrancheModify from "./LoanTrancheModify";
import LoanTrancheDelete from "./LoanTrancheDelete";
import PaymentsReceived from "./PaymentsReceived";
import UpdateRates from "./UpdateRates";
import UpdateMetrics from "./UpdateMetrics";
import Home from "./Home";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="page">
      <TopNav />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/borrowingbase/*" element={<BorrowBase />}>
            <Route
              path="borrowbaselineitemview"
              element={<BorrowBaseLineItemView />}
            />
            <Route
              path="borrowbasecovenantview"
              element={<BorrowBaseCovenantView />}
            />
            <Route path="borrowbasecalcview" element={<BorrowBaseCalcView />} />
          </Route>
          <Route path="/transactions/*" element={<Transactions />}>
            <Route
              path="borrowertransactions/*"
              element={<BorrowerTransactions />}
            >
              <Route path="borrowercreate" element={<BorrowerCreate />} />
              <Route path="borrowermodify" element={<BorrowerModify />} />
              <Route path="borrowerdelete" element={<BorrowerDelete />} />
            </Route>
            <Route
              path="loanagreementtransactions/*"
              element={<LoanAgreementTransactions />}
            >
              <Route
                path="loanagreementcreate"
                element={<LoanAgreementCreate />}
              />
              <Route
                path="loanagreementmodify"
                element={<LoanAgreementModify />}
              />
              <Route
                path="loanagreementdelete"
                element={<LoanAgreementDelete />}
              />
            </Route>
            <Route
              path="loantranchetransactions/*"
              element={<LoanTrancheTransactions />}
            >
              <Route path="loantranchecreate" element={<LoanTrancheCreate />} />
              <Route path="loantranchemodify" element={<LoanTrancheModify />} />
              <Route path="loantranchedelete" element={<LoanTrancheDelete />} />
            </Route>

            <Route
              path="loanapprovaltransactions/*"
              element={<LoanApprovalTransactions />}
            >
              <Route
                path="loanapprovalcreate"
                element={<LoanApprovalCreate />}
              />
              <Route
                path="loanapprovalmodify"
                element={<LoanApprovalModify />}
              />
              <Route
                path="loanapprovaldelete"
                element={<LoanApprovalDelete />}
              />
            </Route>

            <Route
              path="collateralpledgetransactions/*"
              element={<CollateralPledgeTransactions />}
            >
              <Route
                path="collateralpledgeadd"
                element={<CollateralPledgeAdd />}
              />
              <Route
                path="collateralpledgeremove"
                element={<CollateralPledgeRemove />}
              />
            </Route>
            <Route
              path="paymentsreceived"
              element={<PaymentsReceived />}
            ></Route>
          </Route>

          <Route path="/performance/*" element={<Performance />}>
            <Route path="updaterates/" element={<UpdateRates />}></Route>
            <Route path="updatemetrics/" element={<UpdateMetrics />}></Route>
          </Route>
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
