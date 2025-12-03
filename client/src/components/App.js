import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect } from "react";
import TopNav from "./TopNav";
import BorrowBase from "./BorrowBase";
import Transactions from "./Transactions";
import Performance from "./Performance";
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
import UpdateBankMetrics from "./UpdateBankMetrics";
import Rollforward from "./Rollforward";
import Profile from "./Profile";
import Home from "./Home";
import { Route, Routes } from "react-router-dom";
import ReportingSubmenu from "./ReportingSubmenu";
import ProtectedRoute from "./ProtectedRoute";
import AssetBalanceReport from "./AssetBalanceReport";

function App() {
  const { getAccessTokenSilently } = useAuth0();
  const isProduction = process.env.REACT_APP_ENV === "production";

  useEffect(() => {
    // Only set up interceptor in production
    if (isProduction) {
      const requestInterceptor = axios.interceptors.request.use(
        async (config) => {
          try {
            const token = await getAccessTokenSilently();
            config.headers.Authorization = `Bearer ${token}`;
          } catch (error) {
            console.error("Error getting token:", error);
          }
          return config;
        },
        (error) => Promise.reject(error),
      );

      return () => {
        axios.interceptors.request.eject(requestInterceptor);
      };
    }
  }, [getAccessTokenSilently, isProduction]);

  return (
    <div className="page">
      <TopNav />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/borrowingbase/*"
            element={
              <ProtectedRoute>
                <BorrowBase />
              </ProtectedRoute>
            }
          >
            <Route path="borrowbaselineitemview" element={<BorrowBaseLineItemView />} />
            <Route path="borrowbasecovenantview" element={<BorrowBaseCovenantView />} />
            <Route path="borrowbasecalcview" element={<BorrowBaseCalcView />} />
          </Route>
          <Route
            path="/transactions/*"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          >
            <Route path="borrowertransactions/*" element={<BorrowerTransactions />}>
              <Route path="borrowercreate" element={<BorrowerCreate />} />
              <Route path="borrowermodify" element={<BorrowerModify />} />
              <Route path="borrowerdelete" element={<BorrowerDelete />} />
            </Route>
            <Route path="loanagreementtransactions/*" element={<LoanAgreementTransactions />}>
              <Route path="loanagreementcreate" element={<LoanAgreementCreate />} />
              <Route path="loanagreementmodify" element={<LoanAgreementModify />} />
              <Route path="loanagreementdelete" element={<LoanAgreementDelete />} />
            </Route>
            <Route path="loantranchetransactions/*" element={<LoanTrancheTransactions />}>
              <Route path="loantranchecreate" element={<LoanTrancheCreate />} />
              <Route path="loantranchemodify" element={<LoanTrancheModify />} />
              <Route path="loantranchedelete" element={<LoanTrancheDelete />} />
            </Route>

            <Route path="loanapprovaltransactions/*" element={<LoanApprovalTransactions />}>
              <Route path="loanapprovalcreate" element={<LoanApprovalCreate />} />
              <Route path="loanapprovalmodify" element={<LoanApprovalModify />} />
              <Route path="loanapprovaldelete" element={<LoanApprovalDelete />} />
            </Route>

            <Route path="collateralpledgetransactions/*" element={<CollateralPledgeTransactions />}>
              <Route path="collateralpledgeadd" element={<CollateralPledgeAdd />} />
              <Route path="collateralpledgeremove" element={<CollateralPledgeRemove />} />
            </Route>
            <Route path="paymentsreceived" element={<PaymentsReceived />}></Route>
          </Route>

          <Route
            path="/performance/*"
            element={
              <ProtectedRoute>
                <Performance />
              </ProtectedRoute>
            }
          >
            <Route path="updaterates/" element={<UpdateRates />}></Route>
            <Route path="updatemetrics/" element={<UpdateMetrics />}></Route>
            <Route path="updatebankmetrics/" element={<UpdateBankMetrics />}></Route>
          </Route>
          <Route
            path="/reporting/*"
            element={
              <ProtectedRoute>
                <ReportingSubmenu />
              </ProtectedRoute>
            }
          >
            <Route path="rollforward/" element={<Rollforward />}></Route>
            <Route path="assetbalancereport/" element={<AssetBalanceReport />}></Route>
          </Route>

          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/configuration/*"
            element={
              <ProtectedRoute>
                <Configuration />
              </ProtectedRoute>
            }
          >
            <Route path="configfacility/*" element={<ConfigFacility />}>
              <Route path="debtfacilitycreate" element={<DebtFacilityCreate />} />
              <Route path="debtfacilitymodify" element={<DebtFacilityModify />} />
              <Route path="debtfacilitydelete" element={<DebtFacilityDelete />} />
            </Route>
            <Route path="configbank/*" element={<ConfigBank />} />
            <Route path="configportfolio/*" element={<ConfigPortfolio />} />
          </Route>
          <Route path="profile" element={<Profile />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
