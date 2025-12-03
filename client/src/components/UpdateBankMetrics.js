import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { NumericFormat } from "react-number-format";
import Button from "@mui/material/Button";

function UpdateMetrics() {
  const [loanAgreementData, setLoanAgreementData] = useState([]); // Hold results of getLoanAgreementData which includes borrower name and loan agreement info
  const [loanTrancheData, setLoanTrancheData] = useState([]); // Hold results of getLoanTrancheData
  const [borrowerData, setBorrowerData] = useState([]); // Hold results of getBorrowerNames
  const [selectedBorrower, setSelectedBorrower] = useState(null); // Holds the borrower's name
  const [selectedLoanAgreement, setSelectedLoanAgreement] = useState(null); // Holds Loan Agreement Name
  const [loanAgreementOptions, setLoanAgreementOptions] = useState([]); // Filtered loan agreement options based on borrower name
  const [selectedLoanTranche, setSelectedLoanTranche] = useState([]); // Loan tranche object that was selected in dropdown
  const [loanTrancheOptions, setLoanTrancheOptions] = useState([]); // Filtered loan tranche options based on loan_agreement
  const [selectedTrancheId, setSelectedTrancheId] = useState(null); // After user chooses loan tranche, related ID is set here
  const [changeDate, setChangeDate] = useState(""); // After user chooses change date, it is stored here
  const [message, setMessage] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [facilityData, setFacilityData] = useState([]);
  const [uniqueNames, setUniqueNames] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [facilityNames, setFacilityNames] = useState([]);
  const [facilityNumber, setFacilityNumber] = useState(null);
  const [uniqueFacilityNames, setUniqueFacilityNames] = useState([]);
  const [fullBorrowerData, setFullBorrowerData] = useState([]);
  const [advanceRate, setAdvanceRate] = useState("");
  const [valuation, setValuation] = useState("");
  const [collateralId, setCollateralId] = useState("");
  // the following useEffects load up the following on page loan:
  // 1. Borrower Names 2. Loan Agreements 3. Loan Tranches

  // function clearData() {
  //   setSelectedPortfolio("");
  //   setFacilityName("");
  //   setFacilityNames([]);
  //   setFacilityNumber(null);
  //   setUniqueFacilityNames([]);
  //   setStartDate("");
  //   setEndDate("");
  //   setRowData([]);
  //   setCurrentOutstandings("");
  //   setIntExpDue("");
  //   setIsFundsFlow(false);
  // }

  // On page load, get Portfolio Names and Lender Names
  useEffect(() => {
    async function getFacilityData() {
      try {
        const fullInfoResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/facilities`,
        );
        setFacilityData(fullInfoResponse.data);
      } catch {
        setMessage("Error fetching facility data");
      }
    }

    getFacilityData();
  }, []);

  // Once facility data is populated, extract portfolio names into new array and then
  // use Set to get only the unique names and sort the array.

  useEffect(() => {
    if (facilityData.length > 0) {
      const porfolioName = facilityData.map((a) => a.portfolio_name);
      const uniqueNamesArray = Array.from(new Set(porfolioName)).sort();
      setUniqueNames(uniqueNamesArray);
    }
  }, [facilityData]);

  // When the portfolio is selected, filter facilityData object
  // to get only those records that contain the facility.  Set
  // facilityNames equal to that record
  const handlePortfolioChange = (e, value) => {
    setSelectedPortfolio(value || "");
    const portfolioFacilities = facilityData.filter((item) =>
      item.portfolio_name.includes(value || ""),
    );
    setFacilityNames(portfolioFacilities);
    setMessage("");
  };

  // Once facilityNames is set to that value (from above) create an accray of just debt
  // facility names and then set an array equal to the results of the sorted set function
  // run on that array
  useEffect(() => {
    if (facilityNames.length > 0) {
      const facilityNameSelection = facilityNames.map((a) => a.debt_facility_name);
      const uniqueDebtFacilityNamesArray = Array.from(new Set(facilityNameSelection)).sort();
      setUniqueFacilityNames(uniqueDebtFacilityNamesArray);
    }
  }, [facilityNames]);

  // When the facility is chosen, search the facilityData object to find the
  // record with the facility name that matches the chosen value.
  // Set facility_numb equal to the debt_facility_id value of that record.
  const handleFacilityChange = (e, value) => {
    setFacilityName(value || "");
    const facility_record = facilityData.find((f) => f.debt_facility_name === value);

    const facility_numb = facility_record.debt_facility_id;
    setFacilityNumber(facility_numb);
  };

  // When facilityNumber is set, get borrowerquerybyfacility, which accepts
  // faclityNumber as a parameter and returns the borrowers are part of that
  // facility's collateral

  useEffect(() => {
    if (!facilityNumber) return;

    async function getBorrowerNames() {
      try {
        const fullInfoResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/borrowerquerybyfacility`,
          {
            params: {
              debtFacilityId: facilityNumber,
            },
          },
        );
        const data = fullInfoResponse.data;
        const dataWithoutNull = data.filter((borrower) => borrower.legal_name);
        const sortedBorrowers = dataWithoutNull.sort((first, second) => {
          return first.legal_name.localeCompare(second.legal_name);
        });
        setFullBorrowerData(data);
        setBorrowerData(sortedBorrowers);
      } catch {
        setMessage("Error fetching data from server");
      }
    }

    getBorrowerNames();
  }, [facilityNumber]);

  // Gets all loan agreement  data at page load
  useEffect(() => {
    async function getLoanAgreementData() {
      try {
        const fullInfoResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/loanagreementquery`,
        );
        setLoanAgreementData(fullInfoResponse.data);
      } catch {
        setMessage("Error fetching data from server");
      }
    }
    getLoanAgreementData();
  }, []);

  // When the borrower is chosen, filter the loan agreement data for only the loan
  // agreements that are related to that specific borrower and
  // set loanAgreementOptions equal to those loan agreements

  const handleBorrowerChange = (e, setValue) => {
    setLoanAgreementOptions([]);
    setSelectedLoanAgreement(null);
    setSelectedBorrower(setValue);
    const loanAgreements = loanAgreementData.filter((item) =>
      item.legal_name.includes(setValue.legal_name),
    );
    setLoanAgreementOptions(loanAgreements);
  };

  // Gets all loan tranche data at page load
  useEffect(() => {
    async function getLoanTrancheData() {
      try {
        const fullInfoResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/loantranchequery`,
        );
        setLoanTrancheData(fullInfoResponse.data);
      } catch {
        setMessage("Error fetching data from server");
      }
    }
    getLoanTrancheData();
  }, []);

  // When the loan agreement is chosen, filter the loan tranche data
  // for only the loan tranches that are related to that loan agreements
  // set loanTrancheOptions equal to those loan agreements

  const handleLoanAgreementChange = (e, setValue) => {
    setLoanTrancheOptions([]);
    setSelectedLoanTranche(null);
    setSelectedLoanAgreement(setValue);
    const loanTranches = loanTrancheData.filter(
      (item) => item.loan_agreement_id === setValue.loan_agreement_id,
    );
    setLoanTrancheOptions(loanTranches);
  };

  useEffect(() => {
    if (!facilityName) {
      const porfolioName = facilityData.map((a) => a.portfolio_name);
      const uniqueNamesArray = Array.from(new Set(porfolioName)).sort();
      setUniqueNames(uniqueNamesArray);
    }
  }, [facilityName]);

  const getCollateralId = (trancheId, facilityId) => {
    const collateral = fullBorrowerData.filter(
      (item) => item.tranche_id === trancheId && item.debt_facility_id === facilityId,
    );
    return collateral[0]?.collateral_id;
  };

  // Upon choosing a loan tranche, metrics are retrieved from server

  useEffect(() => {
    const collateralId = getCollateralId(selectedTrancheId, facilityNumber);
    setCollateralId(collateralId);
    async function getBankMetrics() {
      try {
        const fullInfoResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/bankMetricsQuery`,
          {
            params: {
              collateral_id: collateralId,
            },
          },
        );

        setMetrics(fullInfoResponse.data);
      } catch {
        setMessage("Error fetching data from server");
      }
    }

    getBankMetrics();
  }, [selectedTrancheId]);

  // Upon choosing a loan tranche, the loan tranche's id is saved

  useEffect(() => {
    if (!selectedLoanTranche) return;
    setSelectedTrancheId(selectedLoanTranche.tranche_id);
  }, [selectedLoanTranche]);

  // Posts rate update

  async function postMetricsUpdate() {
    try {
      if (
        !selectedPortfolio ||
        !facilityName ||
        !selectedLoanTranche ||
        !selectedBorrower ||
        !selectedLoanAgreement ||
        !changeDate
      ) {
        setMessage("Please input all required fields (denoted by *)");
        return;
      }
      if (changeDate<=metrics[0].start_date) {
        setMessage("Date must be after previous bank metric date.")
        return;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/createBankMetricsChange`,
        {
          collateralId: collateralId,
          advanceRate:
            advanceRate != null && advanceRate != ""
              ? Number((advanceRate / 100).toFixed(6))
              : null,
          valuation:
            valuation != null && valuation != "" ? Number((valuation / 100).toFixed(6)) : null,
          changeDate: changeDate,
        },
      );
      if (response.status === 201) {
        clearData();
        setMessage("Bank Metric Update Successful");
      }
    } catch {
      setMessage("There was an error updating the bank metrics.");
    }
  }

  function clearData() {
    setSelectedPortfolio(null);
    setFacilityName(null);
    setSelectedBorrower(null);
    setSelectedLoanTranche(null);
    setSelectedLoanAgreement(null);
    setSelectedTrancheId(null);
    setChangeDate("");
    setValuation("");
    setAdvanceRate("");
  }

  return (
    <>
      <div
        className="update-rate-data"
        style={{
          fontSize: "18px",
          fontFamily: "Inter",
          paddingLeft: "180px",
          paddingBottom: 20,
        }}
      >
        Update Bank Metrics
      </div>
      <Box component="form" sx={{ paddingLeft: "115px", paddingTop: "5px" }}>
        <Box
          sx={{
            border: 1,
            borderRadius: 4,
            borderColor: "#c7c7c7ff",
            width: "165ch",
            marginTop: 0,
            marginLeft: 6,
            marginBottom: 3,
            padding: 2,
          }}
        >
          <div className="row-1-tranche-selection" style={{ display: "flex", gap: "25px" }}>
            <Autocomplete
              disablePortal
              id="autocomplete-portfolio-name"
              required
              options={uniqueNames}
              value={selectedPortfolio}
              sx={{ m: 1, width: "50ch" }}
              onChange={handlePortfolioChange}
              getOptionLabel={(option) => option}
              renderInput={(params) => <TextField {...params} label="Portfolio Name" required />}
            />

            <Autocomplete
              disablePortal
              id="autocomplete-facility-name"
              options={uniqueFacilityNames}
              value={facilityName}
              sx={{ m: 1, width: "50ch" }}
              onChange={handleFacilityChange}
              getOptionLabel={(option) => option}
              disabled={!selectedPortfolio}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={
                    selectedPortfolio ? "Facility Name" : "Facility Name (Select Portfolio First)"
                  }
                  required
                />
              )}
            />
            <Autocomplete
              disablePortal
              id="autocomplete-borrower-name"
              options={borrowerData}
              value={selectedBorrower}
              sx={{ m: 1, width: "50ch" }}
              onChange={handleBorrowerChange}
              getOptionLabel={(option) => option.legal_name || ""}
              disabled={!facilityName}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={facilityName ? "Borrower Name" : "Borrower Name (Select Facility First)"}
                  required
                />
              )}
            />
          </div>
          <div className="row-1-tranche-selection" style={{ display: "flex", gap: "25px" }}>
            <Autocomplete
              disablePortal
              id="autocomplete-loan-agreeements"
              options={loanAgreementOptions}
              value={selectedLoanAgreement}
              sx={{ m: 1, width: "50ch" }}
              onChange={handleLoanAgreementChange}
              getOptionLabel={(option) => option.loan_agreement_name || ""}
              disabled={!selectedBorrower}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={
                    selectedBorrower ? "Loan Agreement" : "Loan Agreement (Select Borrower First)"
                  }
                  required
                />
              )}
            />
            <Autocomplete
              disablePortal
              id="autocomplete-loan-tranches"
              options={loanTrancheOptions}
              value={selectedLoanTranche}
              sx={{ m: 1, width: "50ch" }}
              onChange={(event, newValue) => setSelectedLoanTranche(newValue)}
              getOptionLabel={(option) => option.tranche_name || ""}
              disabled={!selectedLoanAgreement}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={
                    selectedLoanAgreement ? "Loan Tranche" : "Loan Tranche (Select Agreement First)"
                  }
                  required
                />
              )}
            />
          </div>
        </Box>
        <Box>
          <Box sx={{ paddingLeft: "20px", display: "flex" }}>
            <Box
              sx={{
                border: "1px solid",
                borderRadius: 4,
                borderColor: "#c7c7c7ff",
                width: "40ch",
                m: 3,
                padding: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: "25px",
                }}
              >
                Enter New Metrics
              </div>
              <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Change Date"
                    id="change-date-picker"
                    sx={{ m: 1, width: "25ch", marginTop: 1 }}
                    value={changeDate ? dayjs(changeDate) : null}
                    onChange={(newDate) => {
                      setChangeDate(newDate ? newDate.format("YYYY-MM-DD") : "");
                    }}
                    slotProps={{
                      textField: {
                        required: true,
                        inputProps: {
                          "data-testid": "change-date-picker",
                        },
                        helperText: "MM/DD/YYYY",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>

              <Box>
                <NumericFormat
                  customInput={TextField}
                  id="advance-rate"
                  sx={{ m: 1, width: "25ch", marginTop: 2 }}
                  value={advanceRate}
                  onValueChange={(value) => setAdvanceRate(value.floatValue)}
                  label="Advance Rate"
                  thousandSeparator=","
                  suffix="%"
                  decimalScale={6}
                  fixedDecimalScale
                />
              </Box>
              <Box>
                <NumericFormat
                  customInput={TextField}
                  id="valuation"
                  sx={{ m: 1, width: "25ch", marginTop: 2 }}
                  value={valuation}
                  onValueChange={(value) => setValuation(value.floatValue)}
                  label="Valuation"
                  thousandSeparator=","
                  suffix="%"
                  decimalScale={6}
                  fixedDecimalScale
                />
              </Box>
            </Box>
            <Box
              sx={{
                border: "1px solid",
                borderRadius: 4,
                borderColor: "#c7c7c7ff",
                width: "50ch",
                m: 3,
                padding: 2,
                bgcolor: "#e4e4e4ff",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: "25px",
                }}
              >
                Current Metrics
              </div>

              <Box
                sx={{
                  width: "70ch",
                  m: 0,
                  padding: 2,
                  display: "grid",
                  paddingTop: 3,
                  rowGap: 5,
                  columnGap: 8,
                  gridTemplateColumns: "auto 1fr",
                }}
              >
                <Box sx={{ fontWeight: "bold", fontSize: "18px" }}>As of Date: </Box>
                <Box sx={{ fontSize: "18px" }}>
                  {metrics[0]?.start_date
                    ? new Date(
                        new Date(metrics[0].start_date).toISOString().split("T")[0] + "T12:00:00",
                      ).toLocaleDateString("en-US")
                    : ""}
                </Box>

                <Box
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    paddingTop: "3.5ch",
                  }}
                >
                  Advance Rate:
                </Box>
                <Box sx={{ fontSize: "18px", paddingTop: "3.7ch" }}>
                  {metrics[0]?.advance_rate
                    ? new Intl.NumberFormat("en-US", {
                        style: "percent",
                        minimumFractionDigits: 6,
                        maximumFractionDigits: 6,
                      }).format(metrics[0]?.advance_rate)
                    : ""}
                </Box>

                <Box
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    paddingTop: "1.5ch",
                  }}
                >
                  Valuation:
                </Box>
                <Box sx={{ fontSize: "18px", paddingTop: "1.7ch" }}>
                  {metrics[0]?.start_date
                    ? new Intl.NumberFormat("en-US", {
                        style: "percent",
                        minimumFractionDigits: 6,
                        maximumFractionDigits: 6,
                      }).format(metrics[0]?.valuation)
                    : ""}
                </Box>
              </Box>
            </Box>
          </Box>
          <div style={{ marginTop: "40px" }}>
            <Button
              variant="contained"
              onClick={postMetricsUpdate}
              sx={{
                marginLeft: "25px",
                minWidth: "225px",
                minHeight: "50px",
                borderRadius: 2,
                backgroundColor: "#F6AE2D",
                color: "#000000",
                textTransform: "none",
                fontSize: "20px",
              }}
            >
              Save
            </Button>

            <Button
              variant="contained"
              onClick={clearData}
              sx={{
                marginLeft: "25px",
                minWidth: "225px",
                minHeight: "50px",
                borderRadius: 2,
                backgroundColor: "#d4d4d4ff",
                color: "#000000",
                textTransform: "none",
                fontSize: "20px",
              }}
            >
              Cancel
            </Button>
          </div>
        </Box>

        {/* Displays message below in a success or failure situation */}
        {message && <div className="alertMessage">{message}</div>}
      </Box>
    </>
  );
}

export default UpdateMetrics;
