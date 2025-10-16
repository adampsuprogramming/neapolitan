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

function LoanApprovalCreate() {
  const [loanAgreementData, setLoanAgreementData] = useState([]); // Hold results of getLoanAgreementData which includes borrower name and loan agreement info
  const [loanTrancheData, setLoanTrancheData] = useState([]); // Hold results of getLoanTrancheData
  const [lenderData, setLenderData] = useState([]); // Hold results of getLenderData
  const [lenderName, setLenderName] = useState(null); // Record the name of lender for createing approval name
  const [borrowerData, setBorrowerData] = useState([]); // Hold results of getBorrowerNames
  const [facilityData, setFacilityData] = useState([]); // Hold results of getFacilityData
  const [selectedBorrower, setSelectedBorrower] = useState(null); // Holds the borrower's name
  const [selectedLender, setSelectedLender] = useState(null); // Holds the lender's name
  const [selectedFacility, setSelectedFacility] = useState(null); // Holds the facility's name
  const [selectedLoanAgreement, setSelectedLoanAgreement] = useState(null); // Holds Loan Agreement Name
  const [facilityOptions, setFacilityOptions] = useState([]); // Filtered facility options based on lender's name
  const [loanAgreementOptions, setLoanAgreementOptions] = useState([]); // Filtered loan agreement options based on borrower name
  const [selectedLoanTranche, setSelectedLoanTranche] = useState([]); // Loan tranche object that was selected in dropdown
  const [loanTrancheOptions, setLoanTrancheOptions] = useState([]); // Filtered loan tranche options based on loan_agreement
  const [approvedAmount, setApprovedAmount] = useState(null); //After use enters approved amount, it is stored here
  const [approvedEbitda, setApprovedEbitda] = useState(null); //After use enters approved ebitda, it is stored here
  const [approvedLeverageRatio, setApprovedLeverageRatio] = useState(null); //After user enters leverage ratio, it is stored here
  const [approvedNetLeverageRatio, setApprovedNetLeverageRatio] =
    useState(null); //After use enters net leverage ratio, it is stored here
  const [approvedInterestCoverage, setApprovedInterestCoverage] =
    useState(null); //After use enters interest coverage ratio, it is stored here
  const [approvedAdvanceRate, setApprovedAdvanceRate] = useState(null); //After use enters approved amount, it is stored here
  const [approvedValue, setApprovedValue] = useState(null); //After use enters approved value (the value the bank assigned the loan), it is stored here
  const [selectedTrancheId, setSelectedTrancheId] = useState(null); // After user chooses loan tranche, related ID is set here
  const [selectedFacilityId, setSelectedFacilityId] = useState(null); // After user chooses loan facility, related ID is set here
  const [approvalDate, setApprovalDate] = useState(""); // After user chooses approval date, it is stored here
  const [approvalExpiration, setApprovalExpiration] = useState(""); // After user chooses approval expiration date, it is stored here
  const [message, setMessage] = useState("");

  // the following useEffects load up the following on page loan:
  // 1. Borrower Names 2. Loan Agreements 3. Loan Tranches 4. Lenders 5. Debt Facilities

  useEffect(() => {
    async function getBorrowerNames() {
      try {
        const fullInfoResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/borrowerquery`,
        );
        const data = fullInfoResponse.data;
        const dataWithoutNull = data.filter((borrower) => borrower.legal_name);
        const sortedBorrowers = dataWithoutNull.sort((first, second) => {
          return first.legal_name.localeCompare(second.legal_name);
        });

        setBorrowerData(sortedBorrowers);
      } catch (error) {
        setMessage("Error fetching data from server");
      }
    }

    getBorrowerNames();
  }, []);

  useEffect(() => {
    async function getLoanAgreementData() {
      try {
        const fullInfoResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/loanagreementquery`,
        );
        setLoanAgreementData(fullInfoResponse.data);
      } catch (error) {
        setMessage("Error fetching data from server");
      }
    }
    getLoanAgreementData();
  }, []);

  useEffect(() => {
    async function getLoanTrancheData() {
      try {
        const fullInfoResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/loantranchequery`,
        );
        setLoanTrancheData(fullInfoResponse.data);
      } catch (error) {
        setMessage("Error fetching data from server");
      }
    }
    getLoanTrancheData();
  }, []);

  useEffect(() => {
    async function getLenderData() {
      try {
        const fullInfoResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/lenderquery`,
        );
        const data = fullInfoResponse.data;
        const sortedLenders = data.sort((first, second) => {
          return first.lender_name.localeCompare(second.lender_name);
        });
        setLenderData(sortedLenders);
      } catch (error) {
        setMessage("Error fetching data from server");
      }
    }
    getLenderData();
  }, []);

  useEffect(() => {
    async function getFacilityData() {
      try {
        const fullInfoResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/facilities`,
        );
        setFacilityData(fullInfoResponse.data);
      } catch (error) {
        setMessage("Error fetching data from server");
      }
    }
    getFacilityData();
  }, []);

  // this useEffect gets the related tranche id number when the tranche record
  // is selected.  The tranche number is needed to send back to the server

  useEffect(() => {
    if (!selectedLoanTranche) return;
    setSelectedTrancheId(selectedLoanTranche.tranche_id);
  }, [selectedLoanTranche]);

  // this useEffect gets the related facility id number when the facility record
  // is selected.  The facility id number is needed to send back to the server

  useEffect(() => {
    if (!selectedFacility) return;
    setSelectedFacilityId(selectedFacility.debt_facility_id);
  }, [selectedFacility]);

  async function postApproval() {
    if (
      !selectedBorrower ||
      !selectedLoanAgreement ||
      !selectedLoanTranche ||
      !selectedLender ||
      !selectedFacility ||
      !approvalDate ||
      !approvalExpiration
    ) {
      setMessage(
        "Not Saved - Please fill out all required fields - denoted by *",
      );
      return;
    }
    // creates the loan approval name for access in the Collateral Pledge feature
    const approvalName = `${approvalDate} - ${lenderName} - ${selectedBorrower.legal_name}`;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/createloanapproval`,
        {
          approvalName,
          selectedTrancheId,
          selectedFacilityId,
          approvalDate,
          approvalExpiration,
          approvedAmount,
          approvedEbitda,
          approvedLeverageRatio,
          approvedInterestCoverage,
          approvedNetLeverageRatio,
          approvedAdvanceRate:
            approvedAdvanceRate != null
              ? Number((approvedAdvanceRate / 100).toFixed(6))
              : null,
          approvedValue:
            approvedValue != null
              ? Number((approvedValue / 100).toFixed(6))
              : null,
        },
      );
      if (response.status === 201) {
        clearData();
        setMessage("Loan Approval Created Successfully");
      }
    } catch (error) {
      setMessage("There was an error creating the loan approval.");
    }
  }

  function clearData() {
    setSelectedBorrower(null);
    setSelectedLoanTranche(null);
    setSelectedLoanAgreement(null);
    setSelectedLender(null);
    setSelectedFacility(null);
    setApprovalDate("");
    setApprovalExpiration("");
    setApprovedAmount("");
    setApprovedEbitda("");
    setApprovedLeverageRatio("");
    setApprovedInterestCoverage("");
    setApprovedNetLeverageRatio("");
    setApprovedAdvanceRate("");
    setApprovedValue("");
  }

  const handleBorrowerChange = (e, setValue) => {
    setLoanAgreementOptions([]);
    setSelectedLoanAgreement(null);
    setSelectedBorrower(setValue);
    if(!setValue) {  // If value in Borrower is null, set Loan Agreement Options and Loan Tranche Options to Null
      setLoanAgreementOptions([]);
      setLoanTrancheOptions([]);
      return;
    }
    const loanAgreements = loanAgreementData.filter((item) =>
      item.legal_name.includes(setValue.legal_name),
    );
    setLoanAgreementOptions(loanAgreements);
  };

  const handleLoanAgreementChange = (e, setValue) => {
    setLoanTrancheOptions([]);
    setSelectedLoanTranche(null);
    setSelectedLoanAgreement(setValue);
    if(!setValue) {  // If value in Loan Agreement is null, set Loan Tranche Options to Null
      setLoanTrancheOptions([]);
      return;
    }
    const loanTranches = loanTrancheData.filter(
      (item) => item.loan_agreement_id === setValue.loan_agreement_id,
    );
    setLoanTrancheOptions(loanTranches);
  };

  const handleLenderChange = (e, setValue) => {
    setFacilityOptions([]);
    setSelectedFacility(null);
    setSelectedLender(setValue);
    if(!setValue) {  // If value in Lender Name is null, set Loan Facilities Options to Null
      setFacilityOptions([]);
      return;
    }
    setLenderName(setValue.lender_name);

    const facilities = facilityData.filter(
      (item) => item.lender_id === setValue.lender_id,
    );

    const uniqueFacilities = [];
    const idsInFacilities = new Set();

    for (const facility of facilities) {
      if (!idsInFacilities.has(facility.facility_id)) {
        idsInFacilities.add(facility.facility_id);
        uniqueFacilities.push(facility);
      }
    }
    setFacilityOptions(uniqueFacilities);
  };

  return (
    <>
      <div
        className="loan-tranche-create"
        style={{
          fontSize: "18px",
          fontWeight: "600",
          fontFamily: "Inter",
          paddingLeft: "150px",
        }}
      >
        Create Loan Approval
      </div>
      <Box component="form" sx={{ paddingLeft: "115px", paddingTop: "50px" }}>
        <Box
          sx={{
            fontSize: "16px",
            fontWeight: "600",
            fontFamily: "Inter",
            paddingLeft: "35px",
          }}
        >
          Approval Information
        </Box>
        <Box
          sx={{
            border: "1px solid",
            borderRadius: 4,
            borderColor: "#c7c7c7ff",
            width: "150ch",
            marginTop: 1,
            marginLeft: 3,
            marginBottom: 3,
            padding: 2,
          }}
        >
          <div
            className="row-1-approval-information"
            style={{ display: "flex", gap: "25px" }}
          >
            <Autocomplete
              disablePortal
              id="autocomplete-borrower-name"
              required
              options={borrowerData}
              value={selectedBorrower}
              sx={{ m: 1, minWidth: "300px" }}
              onChange={handleBorrowerChange}
              getOptionLabel={(option) => option.legal_name || ""}
              renderInput={(params) => (
                <TextField {...params} label="Borrower Name" required />
              )}
            />

            <Autocomplete
              disablePortal
              id="autocomplete-loan-agreeements"
              options={loanAgreementOptions}
              value={selectedLoanAgreement}
              sx={{ m: 1, minWidth: "450px" }}
              onChange={handleLoanAgreementChange}
              getOptionLabel={(option) => option.loan_agreement_name || ""}
              disabled={!selectedBorrower}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={
                    selectedBorrower
                      ? "Loan Agreement"
                      : "Loan Agreement (Select Borrower First)"
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
              sx={{ m: 1, minWidth: "450px" }}
              onChange={(event, newValue) => setSelectedLoanTranche(newValue)}
              getOptionLabel={(option) => option.tranche_name || ""}
              disabled={!selectedLoanAgreement}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={
                    selectedLoanAgreement
                      ? "Loan Tranche"
                      : "Loan Tranche (Select Agreement First)"
                  }
                  required
                />
              )}
            />
          </div>

          <div
            className="row-2-approval-information"
            style={{ display: "flex", gap: "25px", marginTop: "2ch" }}
          >
            <Autocomplete
              disablePortal
              id="autocomplete-lender-name"
              options={lenderData}
              value={selectedLender}
              sx={{ m: 1, minWidth: "300px" }}
              onChange={handleLenderChange}
              getOptionLabel={(option) => option.lender_name || ""}
              renderInput={(params) => (
                <TextField {...params} label="Lender Name" required />
              )}
            />

            <Autocomplete
              disablePortal
              id="autocomplete-facilities"
              options={facilityOptions}
              value={selectedFacility}
              sx={{ m: 1, minWidth: "450px" }}
              onChange={(event, newValue) => setSelectedFacility(newValue)}
              getOptionLabel={(option) => option.debt_facility_name || ""}
              disabled={!selectedLender}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={
                    selectedLender
                      ? "Loan Facilities"
                      : "Loan Facilities (Select Lender First)"
                  }
                  required
                />
              )}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Approval Date"
                sx={{ m: 1, minWidth: "175px" }}
                value={approvalDate ? dayjs(approvalDate) : null} //
                onChange={(newDate) => {
                  setApprovalDate(newDate ? newDate.format("YYYY-MM-DD") : "");
                }}
                slotProps={{
                  textField: {
                    inputProps: {
                      "data-testid": "tranche-approval-date-picker",
                    },
                    helperText: "MM/DD/YYYY",
                    required: true,
                  },
                }}
              />
              <DatePicker
                label="Approval Expiration"
                sx={{ m: 1, minWidth: "175px" }}
                value={approvalExpiration ? dayjs(approvalExpiration) : null} //
                onChange={(newDate) => {
                  setApprovalExpiration(
                    newDate ? newDate.format("YYYY-MM-DD") : "",
                  );
                }}
                slotProps={{
                  textField: {
                    inputProps: {
                      "data-testid": "tranche-approval-expiration-picker",
                    },
                    helperText: "MM/DD/YYYY",
                    required: true,
                  },
                }}
              />
            </LocalizationProvider>
          </div>
        </Box>
        <Box
          sx={{
            fontSize: "16px",
            fontWeight: "600",
            fontFamily: "Inter",
            paddingLeft: "35px",
          }}
        >
          Approved Values at Inclusion in Facility
        </Box>
        <Box
          sx={{
            border: "1px solid",
            borderRadius: 4,
            borderColor: "#c7c7c7ff",
            width: "150ch",
            marginTop: 1,
            marginLeft: 3,
            marginBottom: 3,
            padding: 2,
          }}
        >
          <div className="row-1-approved-amounts" style={{ display: "flex" }}>
            <NumericFormat
              customInput={TextField}
              id="approved-amount-textfield"
              sx={{
                marginLeft: "1ch",
                marginTop: 1,
                marginBottom: 1,
                minWidth: "30ch",
              }}
              value={approvedAmount}
              onValueChange={(value) => setApprovedAmount(value.floatValue)}
              label="Approved Amount"
              thousandSeparator=","
              decimalScale={2}
              prefix="$"
              fixedDecimalScale
            />

            <NumericFormat
              customInput={TextField}
              id="approved-ebitda-textfield"
              sx={{
                marginLeft: "9ch",
                marginTop: 1,
                marginBottom: 1,
                minWidth: "30ch",
              }}
              value={approvedEbitda}
              onValueChange={(value) => setApprovedEbitda(value.floatValue)}
              label="Approved EBITDA"
              thousandSeparator=","
              decimalScale={2}
              prefix="$"
              fixedDecimalScale
            />

            <NumericFormat
              customInput={TextField}
              id="leverage-ratio-textfield"
              sx={{
                marginLeft: "9ch",
                marginTop: 1,
                marginBottom: 1,
                minWidth: "30ch",
              }}
              value={approvedLeverageRatio}
              onValueChange={(value) =>
                setApprovedLeverageRatio(value.floatValue)
              }
              label="Leverage Ratio"
              decimalScale={6}
              fixedDecimalScale
            />

            <NumericFormat
              customInput={TextField}
              id="interest-coverage-ratio-textfield"
              sx={{
                marginLeft: "9ch",
                marginTop: 1,
                marginBottom: 1,
                marginRight: "1ch",
                minWidth: "30ch",
              }}
              value={approvedInterestCoverage}
              onValueChange={(value) =>
                setApprovedInterestCoverage(value.floatValue)
              }
              label="Interest Coverage Ratio"
              decimalScale={6}
              fixedDecimalScale
            />
          </div>
          <div
            className="row-2-approved-amounts"
            style={{ display: "flex", marginTop: "25px" }}
          >
            <NumericFormat
              customInput={TextField}
              id="net-leverage-ratio-textfield"
              sx={{
                marginLeft: "1ch",
                marginTop: 1,
                marginBottom: 1,
                minWidth: "30ch",
              }}
              value={approvedNetLeverageRatio}
              onValueChange={(value) =>
                setApprovedNetLeverageRatio(value.floatValue)
              }
              label="Net Leverage Ratio"
              decimalScale={6}
              fixedDecimalScale
            />
            <NumericFormat
              customInput={TextField}
              id="approved-advance-rate-textfield"
              sx={{
                marginLeft: "9ch",
                marginTop: 1,
                marginBottom: 1,
                minWidth: "30ch",
              }}
              value={approvedAdvanceRate}
              onValueChange={(value) =>
                setApprovedAdvanceRate(value.floatValue)
              }
              label="Approved Advance Rate"
              decimalScale={6}
              suffix="%"
              fixedDecimalScale
            />

            <NumericFormat
              customInput={TextField}
              id="approved-value-textfield"
              sx={{
                marginLeft: "9ch",
                marginTop: 1,
                marginBottom: 1,
                marginRight: "1ch",
                minWidth: "30ch",
              }}
              value={approvedValue}
              onValueChange={(value) => setApprovedValue(value.floatValue)}
              label="Approved Value"
              thousandSeparator=","
              decimalScale={6}
              suffix="%"
              fixedDecimalScale
            />
          </div>
        </Box>
        <Box
          sx={{
            fontSize: "16px",
            fontWeight: "600",
            fontFamily: "Inter",
            paddingLeft: "35px",
          }}
        >
          <div style={{ marginTop: "40px" }}>
            <Button
              variant="contained"
              onClick={postApproval}
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

export default LoanApprovalCreate;
