import { useEffect, useState } from "react";
import axios from "axios";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";

ModuleRegistry.registerModules([AllCommunityModule]);

function BorrowBase() {
  // useState hook to hold results of Facility query below
  const [facilityData, setFacilityData] = useState([]);
  const [uniqueNames, setUniqueNames] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState("");
  const [facilityNames, setFacilityNames] = useState([]);
  const [uniqueFacilityNames, setUniqueFacilityNames] = useState([]);
  const [asOfDate, setAsOfDate] = useState("");

  const handlePortfolioChange = (e) => {
    const selectionValue = e.target.value;
    console.log(selectionValue);
    setSelectedPortfolio(selectionValue);
    const portfolioFacilities = facilityData.filter((item) =>
      item.portfolio_name.includes(selectionValue),
    );
    setFacilityNames(portfolioFacilities);
    console.log(facilityNames);
  };

  const handleDateSelection = (e) => {
    const selectionValue = e.target.value;
    setAsOfDate(selectionValue);
    console.log(asOfDate);
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

  return (
    <div>
        <select value={selectedPortfolio} onChange={handlePortfolioChange}>
        <option value="">Choose a Portfolio</option>
        {uniqueNames.map((portfolio) => (
          <option key={portfolio} value={portfolio}>
            {portfolio}
          </option>
        ))}
      </select>

      <select>
        <option value="">Choose a Facility</option>
        {uniqueFacilityNames.map((facility) => (
          <option key={facility} value={facility}>
            {facility}
          </option>
        ))}
      </select>

      <form>
        <label form="asOfDate">Select As Of Date:</label>
        <input
          type="date"
          id="asOfDate"
          value={asOfDate}
          onChange={handleDateSelection}
        />
      </form>

      {asOfDate}



    </div>
    
  );
}

export default BorrowBase;
