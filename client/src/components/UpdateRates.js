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

function UpdateRates() {
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
  const [rateType, setRateType] = useState(null); // Hold results for rate type, as selected in autocomplete
  const [fixedRate, setFixedRate] = useState(null); //After use enters fixed rate, it is stored here
  const [spread, setSpread] = useState(null); //After use enters spread, it is stored here
  const [floor, setFloor] = useState(null); //After use enters floor, it is stored here
  const [refRate, setRefRate] = useState(null); // Hold results for reference rate, as selected in autocomplete
  const [rateData, setRateData] = useState([]);
  const [message, setMessage] = useState("");

  // the following useEffects load up the following on page loan:
  // 1. Borrower Names 2. Loan Agreements 3. Loan Tranches

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
      } catch {
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
      } catch {
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
      } catch {
        setMessage("Error fetching data from server");
      }
    }
    getLoanTrancheData();
  }, []);

  // Upon choosing a loan tranche, rate data is retrieved from server

  useEffect(() => {
    async function getRateData() {
      try {
        const fullInfoResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/rateDataQuery`,
          {
            params: {
              tranche_id: selectedTrancheId,
            },
          },
        );

        setRateData(fullInfoResponse.data);
      } catch {
        setMessage("Error fetching data from server");
      }
    }

    getRateData();
  }, [selectedTrancheId]);

  // Upon choosing a loan tranche, the loan tranche's id is saved

  useEffect(() => {
    if (!selectedLoanTranche) return;
    setSelectedTrancheId(selectedLoanTranche.tranche_id);
  }, [selectedLoanTranche]);

  // Posts rate update

  async function postRateUpdate() {
    try {
      if (
        !selectedLoanTranche ||
        !selectedBorrower ||
        !selectedLoanAgreement ||
        !changeDate ||
        !rateType
      ) {
        setMessage("Please input all required fields (denoted by *)");
        return;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/createratechange`,
        {
          trancheId: selectedTrancheId,
          changeDate: changeDate,
          rateType: rateType,
          fixedCoupon:
            fixedRate != null && fixedRate != "" ? Number((fixedRate / 100).toFixed(6)) : null,
          spread: spread != null && spread != "" ? Number((spread / 100).toFixed(6)) : null,
          floor: floor != null && floor != "" ? Number((floor / 100).toFixed(6)) : null,
          refRate: refRate != "" ? refRate : null,
        },
      );
      if (response.status === 201) {
        clearData();
        setMessage("Coupon Update Successful");
      }
    } catch {
      setMessage("There was an error updating the coupon.");
    }
  }

  function clearData() {
    setSelectedBorrower(null);
    setSelectedLoanTranche(null);
    setSelectedLoanAgreement(null);
    setSelectedTrancheId(null);
    setChangeDate("");
    setRateType("");
    setFixedRate("");
    setSpread("");
    setFloor("");
    setRefRate("");
    setRateData([]);
  }

  const handleBorrowerChange = (e, setValue) => {
    setMessage("");
    clearData();
    setLoanAgreementOptions([]);
    setSelectedLoanAgreement(null);
    setSelectedBorrower(setValue);
    const loanAgreements = loanAgreementData.filter((item) =>
      item.legal_name.includes(setValue.legal_name),
    );
    setLoanAgreementOptions(loanAgreements);
  };

  const handleLoanAgreementChange = (e, setValue) => {
    setLoanTrancheOptions([]);
    setSelectedLoanTranche(null);
    setSelectedLoanAgreement(setValue);
    const loanTranches = loanTrancheData.filter(
      (item) => item.loan_agreement_id === setValue.loan_agreement_id,
    );
    setLoanTrancheOptions(loanTranches);
  };

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
        Update Rate Data
      </div>
      <Box component="form" sx={{ paddingLeft: "115px", paddingTop: "5px" }}>
        <Box
          sx={{
            border: 1,
            borderRadius: 4,
            borderColor: "#c7c7c7ff",
            width: "112ch",
            marginTop: 0,
            marginLeft: 6,
            marginBottom: 3,
            padding: 2,
          }}
        >
          <div className="row-1-tranche-selection" style={{ display: "flex", gap: "25px" }}>
            <Autocomplete
              disablePortal
              id="autocomplete-borrower-name"
              required
              options={borrowerData}
              value={selectedBorrower}
              sx={{ m: 1, minWidth: "450px" }}
              onChange={handleBorrowerChange}
              getOptionLabel={(option) => option.legal_name || ""}
              renderInput={(params) => <TextField {...params} label="Borrower Name" required />}
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
                    selectedBorrower ? "Loan Agreement" : "Loan Agreement (Select Borrower First)"
                  }
                  required
                />
              )}
            />
          </div>
          <div className="row-1-tranche-selection" style={{ display: "flex", gap: "25px" }}>
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
                Enter New Rate Data
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
                <Autocomplete
                  disablePortal
                  id="autocomplete-rate-type"
                  required
                  options={["Fixed Rate", "Floating Rate"]}
                  value={rateType}
                  sx={{ m: 1, width: "25ch", marginTop: 1 }}
                  onChange={(event, newValue) => setRateType(newValue)}
                  renderInput={(params) => <TextField {...params} label="Rate Type" required />}
                />
              </Box>
              <Box>
                <NumericFormat
                  customInput={TextField}
                  id="fixed-rate-textfield"
                  sx={{ m: 1, width: "25ch", marginTop: 2 }}
                  disabled={!rateType || rateType === "Floating Rate"}
                  value={fixedRate}
                  required={rateType === "Fixed Rate"}
                  onValueChange={(value) => setFixedRate(value.floatValue)}
                  label="Fixed Coupon"
                  thousandSeparator=","
                  decimalScale={6}
                  suffix="%"
                  fixedDecimalScale
                />
              </Box>
              <Box>
                <NumericFormat
                  customInput={TextField}
                  id="spread-textfield"
                  sx={{ m: 1, width: "25ch", marginTop: 2, marginLeft: 1 }}
                  disabled={!rateType || rateType === "Fixed Rate"}
                  value={spread}
                  required={rateType === "Floating Rate"}
                  onValueChange={(value) => setSpread(value.floatValue)}
                  label="Spread"
                  thousandSeparator=","
                  decimalScale={6}
                  suffix="%"
                  fixedDecimalScale
                />
              </Box>
              <Box>
                <NumericFormat
                  customInput={TextField}
                  id="floor-textfield"
                  sx={{ m: 1, width: "25ch", marginTop: 2 }}
                  disabled={!rateType || rateType === "Fixed Rate"}
                  value={floor}
                  onValueChange={(value) => setFloor(value.floatValue)}
                  label="Floor"
                  thousandSeparator=","
                  decimalScale={6}
                  suffix="%"
                  fixedDecimalScale
                />
              </Box>
              <Box>
                <Autocomplete
                  disablePortal
                  id="autocomplete-ref-rate-type"
                  disabled={!rateType || rateType === "Fixed Rate"}
                  options={["LIBOR", "PRIME"]}
                  value={refRate}
                  sx={{ m: 1, width: "25ch", marginTop: 2 }}
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
            </Box>
            <Box
              sx={{
                border: "1px solid",
                borderRadius: 4,
                borderColor: "#c7c7c7ff",
                width: "40ch",
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
                Current Rate Data
              </div>

              <Box
                sx={{
                  width: "70ch",
                  m: 0,
                  padding: 2,
                  display: "grid",
                  rowGap: 7.4,
                  columnGap: 8,
                  gridTemplateColumns: "auto 1fr",
                }}
              >
                <Box sx={{ fontWeight: "bold", fontSize: "18px" }}>As of Date: </Box>
                <Box sx={{ fontSize: "18px" }}>
                  {rateData[0]?.start_date
                    ? new Date(
                        new Date(rateData[0].start_date).toISOString().split("T")[0] + "T12:00:00",
                      ).toLocaleDateString("en-US")
                    : ""}
                </Box>
                <Box
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    marginTop: "1.2ch",
                  }}
                >
                  Rate Type:
                </Box>
                <Box sx={{ fontSize: "18px", marginTop: "1.2ch" }}>
                  {rateData[0]?.start_date ? (rateData[0]?.is_fixed ? "Fixed" : "Floating") : ""}
                </Box>
                <Box sx={{ fontWeight: "bold", fontSize: "18px" }}>Fixed Rate:</Box>
                <Box sx={{ fontSize: "18px" }}>
                  {rateData[0]?.start_date
                    ? rateData[0]?.is_fixed
                      ? `${(rateData[0]?.fixed_rate * 100).toFixed(6)}%`
                      : "N/A"
                    : ""}
                </Box>
                <Box sx={{ fontWeight: "bold", fontSize: "18px" }}>Spread:</Box>
                <Box sx={{ fontSize: "18px" }}>
                  {" "}
                  {rateData[0]?.start_date
                    ? rateData[0]?.is_fixed
                      ? "N/A"
                      : `${(rateData[0]?.spread * 100).toFixed(6)}%`
                    : ""}
                </Box>
                <Box sx={{ fontWeight: "bold", fontSize: "18px" }}>Floor:</Box>
                <Box sx={{ fontSize: "18px" }}>
                  {rateData[0]?.start_date
                    ? rateData[0]?.is_fixed
                      ? "N/A"
                      : `${(rateData[0]?.floor * 100).toFixed(6)}%`
                    : ""}
                </Box>
                <Box sx={{ fontWeight: "bold", fontSize: "18px" }}>Reference Rate:</Box>
                <Box sx={{ fontSize: "18px" }}>
                  {rateData[0]?.start_date
                    ? rateData[0]?.is_fixed
                      ? "N/A"
                      : rateData[0].reference_rate
                    : ""}
                </Box>
              </Box>
            </Box>
          </Box>
          <div style={{ marginTop: "40px" }}>
            <Button
              variant="contained"
              onClick={postRateUpdate}
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

export default UpdateRates;
