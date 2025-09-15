import { useEffect, useState } from "react";
import axios from "axios";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";


ModuleRegistry.registerModules([AllCommunityModule]);

function BorrowBase() {
  // use effect to get borrowing base data when the page loads. Additional criteria will be included in dependency
  // array.  For example, re-rerunning query when 'as of date' changes.
  useEffect(() => {
    async function getBorrowBase() {
      try {
        const fullInfoResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/borrowbase`,
        );
      setRowData(fullInfoResponse.data);
      } catch (error) {
        console.error("Error fetching");
      }
    }
    getBorrowBase();
  }, []);

  // useState hook to set the row data
  const [rowData, setRowData] = useState([]);

  // useState hook to set the column data --- this also renames the columns to appropriate names
  const [colDefs, setColDefs] = useState([
    { field: "collateral_id", headerName: "Collateral ID" },
    { field: "inclusion_date", headerName: "Inclusion Date" },
    { field: "removed_date", headerName: "Removed Date" },
    { field: "approval_date", headerName: "Approval Date" },
    { field: "approved_ebitda", headerName: "EBITDA" },
    { field: "approved_net_leverage", headerName: "Approved Net Leverage" },
    { field: "approved_int_coverage", headerName: "Interest Coverage" },
    { field: "approved_advance_rate", headerName: "Approved Advance Rate" },
    { field: "approved_valuation", headerName: "Approved Valuation" },
    { field: "approved_leverage", headerName: "Approved Leverage" },
    { field: "approved_ebitda", headerName: "Approved EBITDA" },
    { field: "commitment_amount", headerName: "Commitment Amount" },
    { field: "outstanding_amount", headerName: "Outstanding Amount" },
    { field: "lien_type", headerName: "Lien Type" },
    { field: "maturity_date", headerName: "Maturity Date" },
    { field: "tranche_type", headerName: "Tranche Type" },
    { field: "loan_agreement_date", headerName: "Loan Agreement Date" },
    { field: "legal_name", headerName: "Legal Name" },
    { field: "short_name", headerName: "Short Name" },
    { field: "ebitda", headerName: "EBTIDA" },
    { field: "start_date", headerName: "Metric As of Date" },
    { field: "int_coverage_ratio", headerName: "Coverage Ratio" },
    { field: "is_cov_default", headerName: "Covenant Default?" },
    { field: "is_payment_default", headerName: "Payment Default?" },
    { field: "leverage_ratio", headerName: "Leverage Ratio" },
    { field: "loan_metrics_id", headerName: "Loan Metrics ID" },
    { field: "net_leverage_ratio", headerName: "Net Leverage Ratio" },
    { field: "start_date", headerName: "Rate Info Start Date" },
    { field: "end_date", headerName: "Rate Info End Date" },
    { field: "fixed_rate", headerName: "Fixed Rate" },
    { field: "floor", headerName: "Floor" },
    { field: "has_floor", headerName: "Has a Floor?" },
    { field: "is_fixed", headerName: "Is Fixed?" },
    { field: "reference_rate", headerName: "Reference Rate" },
    { field: "spread", headerName: "Spread" },
  ]);

  // returns a very basic AGGrid table, which will be elaborated on in the coming weeks.
  return (
    <div className="ag-theme-alpine" style={{ width: "100%", height: "500px" }}>
      <AgGridReact rowData={rowData} columnDefs={colDefs} />
    </div>
  );
}


export default BorrowBase;
