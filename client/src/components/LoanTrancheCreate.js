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

function LoanTrancheCreate() {
  const [loanAgreementData, setLoanAgreementData] = useState([]); // Hold results of getLoanAgreementData which includes borrower name and loan agreement info
  const [borrowerData, setBorrowerData] = useState([]); // Hold results of getBorrowerData which includes borrower name and loan agreement info
  const [trancheName, setTrancheName] = useState([]); // Hold the results of Loan Tranche Name textbox
  const [selectedBorrower, setSelectedBorrower] = useState(null); // Holds the borrower's name
  const [selectedLoanAgreement, setSelectedLoanAgreement] = useState(null); // Holds Loan Agreement Name
  const [loanAgreementOptions, setLoanAgreementOptions] = useState([]); // Filtered loan agreement options based on borrower name
  const [trancheType, setTrancheType] = useState(null); // Hold results for tranche type, as selected in autocomplete
  const [lienType, setLienType] = useState(null); // Hold results for lien type, as selected in autocomplete
  const [ebitda, setEbitda] = useState(null); //After use enters EBTIDA (LTM), it is stored here
  const [leverageRatio, setLeverageRatio] = useState(null); //After use enters leverage ratio, it is stored here
  const [netLeverageRatio, setNetLeverageRatio] = useState(null); //After use enters net leverage ratio, it is stored here
  const [interestCoverage, setInterestCoverage] = useState(null); //After use enters net leverage ratio, it is stored here
  const [internalVal, setInternalVal] = useState(null); //After user internal value, it is stored here
  const [rateType, setRateType] = useState(null); // Hold results for rate type, as selected in autocomplete
  const [fixedRate, setFixedRate] = useState(null); //After use enters leverage ratio, it is stored here
  const [spread, setSpread] = useState(null); //After use enters spread, it is stored here
  const [floor, setFloor] = useState(null); //After use enters spread, it is stored here
  const [refRate, setRefRate] = useState(null); // Hold results for reference rate, as selected in autocomplete
  const [selectedAgreementId, setSelectedAgreementId] = useState(null); // After user chooses loan agreement, related ID is set here
  const [trancheStart, setTrancheStart] = useState(""); // After user chooses tranche start date, it is stored here
  const [trancheMaturity, setTrancheMaturity] = useState(""); // After user chooses tranche maturity date, it is stored here
  const [message, setMessage] = useState("");

  // this useEffect loads up the loan agreement and borrower name data to populate the dropdown
  // on page load

  useEffect(() => {
    async function getLoanAgreementData() {
      try {
        const fullInfoResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/loanagreementquery`,
        );
        setLoanAgreementData(fullInfoResponse.data);
      } catch (error) {
        console.error("Error fetching: ", error);
      }
    }
    getLoanAgreementData();
  }, []);

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
        console.error("Error fetching: ", error);
      }
    }

    getBorrowerNames();
  }, []);

  // this useEffect gets the related lender id number when the lender record
  // is selected.  The lender number is needed to send back to the server

  useEffect(() => {
    if (!selectedLoanAgreement) return;
    setSelectedAgreementId(selectedLoanAgreement.loan_agreement_id);
  }, [selectedLoanAgreement]);

  // Clear floating rate values if changed to Fixed Rate and vice versa

  useEffect(() => {
    if (!rateType) return;
    if (rateType === "Fixed Rate") {
      setSpread("");
      setFloor("");
      setRefRate("");
    }
    if (rateType === "Floating Rate") {
      setFixedRate("");
    }
  }, [rateType]);

  async function postFacility() {
    if (
      !trancheName ||
      !selectedBorrower ||
      !selectedLoanAgreement ||
      !trancheType ||
      !lienType ||
      !trancheStart ||
      !trancheMaturity ||
      (rateType === "Floating Rate" && (!spread || !refRate)) ||
      (rateType === "Fixed Rate" && !fixedRate)
    ) {
      setMessage("Please input all required fields (denoted by *)");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/createloantranche`,
        {
          loanTrancheName: trancheName,
          loanAgreementId: selectedAgreementId,
          trancheType: trancheType,
          lienType: lienType,
          trancheStart: trancheStart,
          trancheMaturity: trancheMaturity,
          ebitda: ebitda,
          leverageRatio: leverageRatio,
          netLeverageRatio: netLeverageRatio,
          interestCoverage: interestCoverage,
          rateType: rateType,
          fixedRate:
            fixedRate !== null && fixedRate !== "" ? Number((fixedRate / 100).toFixed(6)) : null,
          spread: spread !== null && spread !== "" ? Number((spread / 100).toFixed(6)) : null,
          floor: floor !== null && floor !== "" ? Number((floor / 100).toFixed(6)) : null,
          refRate: refRate !== "" ? refRate : null,
          internalVal:
            internalVal !== null && internalVal !== ""
              ? Number((internalVal / 100).toFixed(6))
              : null,
        },
      );
      if (response.status === 201) {
        clearData();
        setMessage("Loan Tranche Created Successfully");
      }
    } catch {
      setMessage("There was an error creating the loan agreement.");
    }
  }

  function clearData() {
    setTrancheName("");
    setSelectedLoanAgreement(null);
    setSelectedBorrower(null);
    setTrancheType("");
    setLienType("");
    setTrancheStart("");
    setTrancheMaturity("");
    setEbitda("");
    setLeverageRatio("");
    setNetLeverageRatio("");
    setInterestCoverage("");
    setRateType("");
    setFixedRate("");
    setSpread("");
    setFloor("");
    setRefRate("");
    setInternalVal("");
  }

  const handleBorrowerChange = (e, setValue) => {
    setLoanAgreementOptions([]);
    setSelectedLoanAgreement(null);
    setSelectedBorrower(setValue);
    if (!setValue) {
      // If value in Borrower is null, set Loan Agreement Options to Null
      setLoanAgreementOptions([]);
      return;
    }
    const loanAgreements = loanAgreementData.filter((item) =>
      item.legal_name.includes(setValue.legal_name),
    );
    setLoanAgreementOptions(loanAgreements);
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
        Create Loan Tranche
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
          Tranche Information
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
          <div className="row-1-tranche-information" style={{ display: "flex", gap: "50px" }}>
            <TextField
              required
              value={trancheName}
              onChange={(event) => setTrancheName(event.target.value)}
              id="tranche-name-input"
              label="Loan Tranche Name"
              sx={{ m: 1, width: "350px" }}
            />

            <Autocomplete
              disablePortal
              id="autocomplete-borrower-name"
              options={borrowerData}
              value={selectedBorrower}
              sx={{ m: 1, width: "350px" }}
              onChange={handleBorrowerChange}
              getOptionLabel={(option) => option.legal_name || ""}
              renderInput={(params) => <TextField {...params} label="Borrower Name" required />}
            />

            <Autocomplete
              disablePortal
              id="autocomplete-loan-agreeements"
              options={loanAgreementOptions}
              value={selectedLoanAgreement}
              disabled={!selectedBorrower}
              sx={{ m: 1, width: "450px" }}
              onChange={(event, newValue) => setSelectedLoanAgreement(newValue)}
              getOptionLabel={(option) => option.loan_agreement_name || ""}
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
          </div>

          <div className="row-2-tranche-information" style={{ display: "flex", gap: "50px" }}>
            <Autocomplete
              disablePortal
              id="autocomplete-tranche-type"
              options={["Term", "Delayed Draw", "Revolver"]}
              value={trancheType}
              sx={{ m: 1, width: "350px", marginTop: 4 }}
              onChange={(event, newValue) => setTrancheType(newValue)}
              renderInput={(params) => <TextField {...params} label="Tranche Type" required />}
            />

            <Autocomplete
              disablePortal
              id="autocomplete-lien-type"
              options={["First Lien", "Second Lien", "Unsecured"]}
              value={lienType}
              sx={{ m: 1, width: "350px", marginTop: 4 }}
              onChange={(event, newValue) => setLienType(newValue)}
              renderInput={(params) => <TextField {...params} label="Lien Type" required />}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Tranche Start Date"
                sx={{ m: 1, width: "35ch", marginTop: 4 }}
                value={trancheStart ? dayjs(trancheStart) : null} //
                onChange={(newDate) => {
                  setTrancheStart(newDate ? newDate.format("YYYY-MM-DD") : "");
                }}
                slotProps={{
                  textField: {
                    inputProps: { "data-testid": "tranche-start-date-picker" },
                    helperText: "MM/DD/YYYY",
                    required: true,
                  },
                }}
              />
              <DatePicker
                label="Tranche Maturity Date"
                sx={{ m: 1, width: "35ch", marginTop: 4 }}
                value={trancheMaturity ? dayjs(trancheMaturity) : null} //
                onChange={(newDate) => {
                  setTrancheMaturity(newDate ? newDate.format("YYYY-MM-DD") : "");
                }}
                slotProps={{
                  textField: {
                    inputProps: {
                      "data-testid": "tranche-maturity-date-picker",
                    },
                    required: true,
                    helperText: "MM/DD/YYYY",
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
          Loan Metrics at Closing
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
            display: "flex",
          }}
        >
          <NumericFormat
            customInput={TextField}
            id="ebitda-ltm-textfield"
            sx={{ marginLeft: "1ch", marginTop: 1, marginBottom: 1 }}
            value={ebitda}
            onValueChange={(value) => setEbitda(value.floatValue)}
            label="EBITDA (LTM)"
            thousandSeparator=","
            decimalScale={2}
            prefix="$"
            fixedDecimalScale
          />

          <NumericFormat
            customInput={TextField}
            id="leverage-ratio-textfield"
            sx={{ marginLeft: "7ch", marginTop: 1, marginBottom: 1 }}
            value={leverageRatio}
            onValueChange={(value) => setLeverageRatio(value.floatValue)}
            label="Leverage Ratio"
            decimalScale={6}
            fixedDecimalScale
          />

          <NumericFormat
            customInput={TextField}
            id="net-leverage-ratio-textfield"
            sx={{ marginLeft: "7ch", marginTop: 1, marginBottom: 1 }}
            value={netLeverageRatio}
            onValueChange={(value) => setNetLeverageRatio(value.floatValue)}
            label="Net Leverage Ratio"
            decimalScale={6}
            fixedDecimalScale
          />

          <NumericFormat
            customInput={TextField}
            id="interest-coverage-ratio-textfield"
            sx={{ marginLeft: "7ch", marginTop: 1, marginBottom: 1 }}
            value={interestCoverage}
            onValueChange={(value) => setInterestCoverage(value.floatValue)}
            label="Interest Coverage Ratio"
            decimalScale={6}
            fixedDecimalScale
          />

          <NumericFormat
            customInput={TextField}
            id="internal-valuation"
            sx={{ marginLeft: "7ch", marginTop: 1, marginBottom: 1 }}
            value={internalVal}
            onValueChange={(value) => setInternalVal(value.floatValue)}
            label="Initial Internal Valuation"
            thousandSeparator=","
            decimalScale={6}
            suffix="%"
            fixedDecimalScale
          />
        </Box>
        <Box
          sx={{
            fontSize: "16px",
            fontWeight: "600",
            fontFamily: "Inter",
            paddingLeft: "35px",
          }}
        >
          Rate Info at Closing
        </Box>
        <Box
          sx={{
            border: "1px solid",
            borderRadius: 4,
            borderColor: "#c7c7c7ff",
            width: "150ch",
            marginTop: 1,
            marginLeft: 3,
            padding: 2,
            display: "flex",
          }}
        >
          <Autocomplete
            disablePortal
            id="autocomplete-rate-type"
            required
            options={["Fixed Rate", "Floating Rate"]}
            value={rateType}
            sx={{ m: 1, width: "200px", marginTop: 1 }}
            onChange={(event, newValue) => setRateType(newValue)}
            renderInput={(params) => <TextField {...params} label="Rate Type" />}
          />
          <NumericFormat
            customInput={TextField}
            id="fixed-rate-textfield"
            sx={{ m: 1, width: "20ch", marginTop: 1, marginLeft: 9 }}
            disabled={!rateType || rateType === "Floating Rate"}
            required={rateType === "Fixed Rate"}
            value={fixedRate}
            onValueChange={(value) => setFixedRate(value.floatValue)}
            label="Fixed Coupon"
            thousandSeparator=","
            decimalScale={6}
            suffix="%"
            fixedDecimalScale
          />
          <NumericFormat
            customInput={TextField}
            id="spread-textfield"
            required={rateType === "Floating Rate"}
            sx={{ m: 1, width: "20ch", marginTop: 1, marginLeft: 9 }}
            disabled={!rateType || rateType === "Fixed Rate"}
            value={spread}
            onValueChange={(value) => setSpread(value.floatValue)}
            label="Spread"
            thousandSeparator=","
            decimalScale={6}
            suffix="%"
            fixedDecimalScale
          />
          <NumericFormat
            customInput={TextField}
            id="floor-textfield"
            sx={{ m: 1, width: "20ch", marginTop: 1, marginLeft: 9 }}
            disabled={!rateType || rateType === "Fixed Rate"}
            value={floor}
            onValueChange={(value) => setFloor(value.floatValue)}
            label="Floor"
            thousandSeparator=","
            decimalScale={6}
            suffix="%"
            fixedDecimalScale
          />
          <Autocomplete
            disablePortal
            id="autocomplete-ref-rate-type"
            disabled={!rateType || rateType === "Fixed Rate"}
            options={["LIBOR", "PRIME"]}
            value={refRate}
            sx={{ m: 1, width: "200px", marginTop: 1, marginLeft: 9 }}
            onChange={(event, newValue) => setRefRate(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Reference Rate"
                required={rateType === "Floating Rate"}
              />
            )}
          />
        </Box>
        <div style={{ marginTop: "40px" }}>
          <Button
            variant="contained"
            onClick={postFacility}
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

        {/* Displays message below in a success or failure situation */}
        {message && <div className="alertMessage">{message}</div>}
      </Box>
    </>
  );
}

export default LoanTrancheCreate;
