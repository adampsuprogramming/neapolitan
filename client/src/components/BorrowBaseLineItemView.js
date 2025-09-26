import { useEffect, useState } from "react";
import axios from "axios";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";

ModuleRegistry.registerModules([AllCommunityModule]);

function BorrowBaseLineItemView() {
  // useState hook to hold results of Facility query below
  const [facilityData, setFacilityData] = useState([]);
  const [uniqueNames, setUniqueNames] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [facilityNames, setFacilityNames] = useState([]);
  const [facilityNumber, setFacilityNumber] = useState(null);
  const [uniqueFacilityNames, setUniqueFacilityNames] = useState([]);
  const [asOfDate, setAsOfDate] = useState("");
  const todayDate = new Date();

  // useState hook to set the row data
  const [rowData, setRowData] = useState([]);

  // useState hook to set the column data --- this also renames the columns to appropriate names
  // valueFormatter calls arrow function to format cell data, as appropriate
  const [colDefs, setColDefs] = useState([
    { field: "collateral_id", headerName: "Collateral ID" },
    {
      field: "inclusion_date",
      headerName: "Inclusion Date",
      cellDataType: "dateString",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Date(params.value).toLocaleDateString("en-US");
      },
    },
    {
      field: "removed_date",
      headerName: "Removed Date",
      cellDataType: "dateString",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Date(params.value).toLocaleDateString("en-US");
      },
    },
    {
      field: "approval_date",
      headerName: "Approval Date",
      cellDataType: "dateString",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Date(params.value).toLocaleDateString("en-US");
      },
    },
    {
      field: "approved_ebitda",
      headerName: "Approved EBITDA",
      cellDataType: "number",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(params.value);
      },
    },
    {
      field: "approved_net_leverage",
      headerName: "Approved Net Leverage",
      valueFormatter: (params) => {
        if (!params.value) return "";

        return Number(params.value).toFixed(4);
      },
    },
    {
      field: "approved_int_coverage",
      headerName: "Interest Coverage",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return Number(params.value).toFixed(4);
      },
    },
    {
      field: "approved_advance_rate",
      headerName: "Approved Advance Rate",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Intl.NumberFormat("en-US", {
          style: "percent",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(params.value);
      },
    },
    {
      field: "approved_valuation",
      headerName: "Approved Valuation",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Intl.NumberFormat("en-US", {
          style: "percent",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(params.value);
      },
    },
    {
      field: "approved_leverage",
      headerName: "Approved Leverage",
      valueFormatter: (params) => {
        if (!params.value) return "";

        return Number(params.value).toFixed(4);
      },
    },
    {
      field: "approved_ebitda",
      headerName: "Approved EBITDA",
      cellDataType: "number",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(params.value);
      },
    },
    {
      field: "commitment_amount",
      headerName: "Commitment Amount",
      cellDataType: "number",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(params.value);
      },
    },
    {
      field: "outstanding_amount",
      headerName: "Outstanding Amount",
      cellDataType: "number",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(params.value);
      },
    },
    { field: "lien_type", headerName: "Lien Type" },
    {
      field: "maturity_date",
      headerName: "Maturity Date",
      cellDataType: "dateString",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Date(params.value).toLocaleDateString("en-US");
      },
    },
    { field: "tranche_type", headerName: "Tranche Type" },
    {
      field: "loan_agreement_date",
      headerName: "Loan Agreement Date",
      cellDataType: "dateString",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Date(params.value).toLocaleDateString("en-US");
      },
    },
    { field: "legal_name", headerName: "Legal Name" },
    { field: "short_name", headerName: "Short Name" },
    {
      field: "ebitda",
      headerName: "EBITDA",
      cellDataType: "number",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(params.value);
      },
    },
    {
      field: "loan_metrics_start_date",
      headerName: "Metric As of Date",
      cellDataType: "dateString",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Date(params.value).toLocaleDateString("en-US");
      },
    },

    {
      field: "int_coverage_ratio",
      headerName: "Coverage Ratio",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return Number(params.value).toFixed(4);
      },
    },

    { field: "is_cov_default", headerName: "Covenant Default?" },

    { field: "is_payment_default", headerName: "Payment Default?" },

    {
      field: "leverage_ratio",
      headerName: "Leverage Ratio",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return Number(params.value).toFixed(4);
      },
    },

    { field: "loan_metrics_id", headerName: "Loan Metrics ID" },

    {
      field: "net_leverage_ratio",
      headerName: "Net Leverage Ratio",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return Number(params.value).toFixed(4);
      },
    },

    {
      field: "rate_start_date",
      headerName: "Rate Info Start Date",
      cellDataType: "dateString",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Date(params.value).toLocaleDateString("en-US");
      },
    },
    {
      field: "end_date",
      headerName: "Rate Info End Date",
      cellDataType: "dateString",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Date(params.value).toLocaleDateString("en-US");
      },
    },
    {
      field: "fixed_rate",
      headerName: "Fixed Rate",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Intl.NumberFormat("en-US", {
          style: "percent",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(params.value);
      },
    },
    {
      field: "floor",
      headerName: "Floor",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Intl.NumberFormat("en-US", {
          style: "percent",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(params.value);
      },
    },
    { field: "has_floor", headerName: "Has a Floor?" },
    { field: "is_fixed", headerName: "Is Fixed?" },
    { field: "reference_rate", headerName: "Reference Rate" },
    {
      field: "spread",
      headerName: "Spread",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Intl.NumberFormat("en-US", {
          style: "percent",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(params.value);
      },
    },
  ]);

  const handlePortfolioChange = (e) => {
    const selectionValue = e.target.value;
    setSelectedPortfolio(selectionValue);
    const portfolioFacilities = facilityData.filter((item) =>
      item.portfolio_name.includes(selectionValue),
    );
    setFacilityNames(portfolioFacilities);
  };

  const handleFacilityChange = (e) => {
    const selectionValue = e.target.value;
    setFacilityName(selectionValue);
    const facility_record = facilityData.find(
      (f) => f.debt_facility_name === selectionValue,
    );
    const facility_numb = facility_record.debt_facility_id;
    setFacilityNumber(facility_numb);
    setAsOfDate(todayDate.toLocaleDateString("en-CA"));
  };

  const handleDateSelection = (e) => {
    const selectionValue = e.target.value;
    setAsOfDate(selectionValue);
  };

  useEffect(() => {
    if (facilityNames.length > 0) {
      const facilityNameSelection = facilityNames.map(
        (a) => a.debt_facility_name,
      );
      const uniqueDebtFacilityNamesArray = Array.from(
        new Set(facilityNameSelection),
      ).sort();
      setUniqueFacilityNames(uniqueDebtFacilityNamesArray);
    }
  }, [facilityNames]);

  // Facility Query: Create useEffect hook to access API that returns 1 portfolio name
  // 2 debt_facility_name 3 lender_name 4 outstanding_amount 5 overall_commitment_amount
  useEffect(() => {
    async function getFacilityData() {
      try {
        const fullInfoResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/facilities`,
        );
        setFacilityData(fullInfoResponse.data);
      } catch (error) {
        console.error("Error fetching");
      }
    }

    getFacilityData();
  }, []);

  // When facilityData changes, create an alphabetically sorted array of deduplicated (via Set)
  // Portfolio Names.  Need to use useEffect hook, because we want this to retrigger once
  // the facility data is populated from the API call.  Without the hook, it will populate before
  // and be blank

  useEffect(() => {
    if (facilityData.length > 0) {
      const porfolioName = facilityData.map((a) => a.portfolio_name);
      const uniqueNamesArray = Array.from(new Set(porfolioName)).sort();
      setUniqueNames(uniqueNamesArray);
    }
  }, [facilityData]);

  useEffect(() => {
    async function getBorrowBase() {
      try {
        const fullInfoResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/borrowbase`,
          {
            params: {
              as_of_date: asOfDate,
              facility_id: facilityNumber,
            },
          },
        );
        setRowData(fullInfoResponse.data);
      } catch (error) {
        console.error("Error fetching");
      }
    }
    if (asOfDate && facilityNumber) {
      getBorrowBase();
    }
  }, [asOfDate, facilityNumber]);

  return (
    <div>
      <div className="line_item_view_options">
        <div>
          <label htmlFor="portfolio_select">
            <b>Portfolio Name </b>
          </label>
          <select
            id="portfolio_select"
            value={selectedPortfolio}
            onChange={handlePortfolioChange}
          >
            <option value="">Choose a Portfolio</option>
            {uniqueNames.map((portfolio) => (
              <option key={portfolio} value={portfolio}>
                {portfolio}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="facility_select">
            <b>Facility Name </b>
          </label>
          <select
            id="facility_select"
            value={facilityName}
            onChange={handleFacilityChange}
          >
            <option value="">Choose a Facility</option>
            {uniqueFacilityNames.map((facility) => (
              <option key={facility} value={facility}>
                {facility}
              </option>
            ))}
          </select>
        </div>
        <div>
          <form id="date_select">
            <label htmlFor="asOfDate">
              <b>Select As Of Date: </b>
            </label>
            <input
              type="date"
              id="asOfDate"
              value={asOfDate}
              onChange={handleDateSelection}
            />
          </form>
        </div>
      </div>
      <div
        className="ag-theme-alpine"
        style={{
          width: "98%",
          height: "80vh",
          margin: "auto",
          "--ag-header-background-color": "#2F4858",
        }}
      >
        <AgGridReact rowData={rowData} columnDefs={colDefs} />
      </div>
    </div>
  );
}

export default BorrowBaseLineItemView;
