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
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
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
  const [isCovDefault, setIsCovDefault] = useState(false); // Hold results for whether loan is in covenant default, as chosen in toggle
  const [isPaymentDefault, setIsPaymentDefault] = useState(false); // Hold results for whether loan is in payment default, as chosen in toggle
  const [leverageRatio, setLeverageRatio] = useState(""); //After user enters leverage ratio, it is stored here
  const [netLeverageRatio, setNetLeverageRatio] = useState(""); //After user enters net leverage ratio, it is stored here
  const [intCoverageRatio, setIntCoverageRatio] = useState(""); //After user enters interest coverage ratio, it is stored here
  const [message, setMessage] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [ebitda, setEbitda] = useState(""); //After user enters EBITDA, it is stored here

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
    async function getMetrics() {
      try {
        const fullInfoResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/metricsQuery`,
          {
            params: {
              tranche_id: selectedTrancheId,
            },
          },
        );

        setMetrics(fullInfoResponse.data);
      } catch {
        setMessage("Error fetching data from server");
      }
    }

    getMetrics();
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
        !changeDate
      ) {
        setMessage("Please input all required fields (denoted by *)");
        return;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/createMetricsChange`,
        {
          trancheId: selectedTrancheId,
          changeDate: changeDate,
          isCovDefault,
          isPaymentDefault,
          leverageRatio,
          netLeverageRatio,
          intCoverageRatio,
          ebitda,
        },
      );
      if (response.status === 201) {
        clearData();
        setMessage("Metric Update Successful");
      }
    } catch {
      setMessage("There was an error updating the loan metrics.");
    }
  }

  function clearData() {
    setSelectedBorrower(null);
    setSelectedLoanTranche(null);
    setSelectedLoanAgreement(null);
    setSelectedTrancheId(null);
    setChangeDate("");
    setIsCovDefault(false);
    setIsPaymentDefault(false);
    setLeverageRatio("");
    setNetLeverageRatio("");
    setIntCoverageRatio("");
    setEbitda("");
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
        Update Metrics
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
          <div
            className="row-1-tranche-selection"
            style={{ display: "flex", gap: "25px" }}
          >
            <Autocomplete
              disablePortal
              id="autocomplete-borrower-name"
              required
              options={borrowerData}
              value={selectedBorrower}
              sx={{ m: 1, minWidth: "450px" }}
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
          </div>
          <div
            className="row-1-tranche-selection"
            style={{ display: "flex", gap: "25px" }}
          >
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
                      setChangeDate(
                        newDate ? newDate.format("YYYY-MM-DD") : "",
                      );
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
                  id="leverage-ratio"
                  sx={{ m: 1, width: "25ch", marginTop: 2 }}
                  value={leverageRatio}
                  onValueChange={(value) => setLeverageRatio(value.floatValue)}
                  label="Leverage Ratio"
                  thousandSeparator=","
                  decimalScale={6}
                  fixedDecimalScale
                />
              </Box>
              <Box>
                <NumericFormat
                  customInput={TextField}
                  id="net-leverage-ratio"
                  sx={{ m: 1, width: "25ch", marginTop: 2 }}
                  value={netLeverageRatio}
                  onValueChange={(value) =>
                    setNetLeverageRatio(value.floatValue)
                  }
                  label="Net Leverage Ratio"
                  thousandSeparator=","
                  decimalScale={6}
                  fixedDecimalScale
                />
              </Box>
              <Box>
                <NumericFormat
                  customInput={TextField}
                  id="int-coverage-ratio"
                  sx={{ m: 1, width: "25ch", marginTop: 2 }}
                  value={intCoverageRatio}
                  onValueChange={(value) =>
                    setIntCoverageRatio(value.floatValue)
                  }
                  label="Interest Coverage Ratio"
                  thousandSeparator=","
                  decimalScale={6}
                  fixedDecimalScale
                />
              </Box>
              <Box>
                <NumericFormat
                  customInput={TextField}
                  id="ebitda"
                  sx={{ m: 1, width: "25ch", marginTop: 2 }}
                  value={ebitda}
                  onValueChange={(value) => setEbitda(value.floatValue)}
                  label="EBITDA"
                  thousandSeparator=","
                  prefix="$"
                  decimalScale={2}
                  fixedDecimalScale
                />
              </Box>
              <Box sx={{ marginTop: "2.4ch" }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isCovDefault}
                      id="is-cov-default"
                      onChange={(e) => setIsCovDefault(e.target.checked)}
                    />
                  }
                  labelPlacement="start"
                  label="Covenant Default"
                />
              </Box>
              <Box sx={{ marginTop: "4.7ch" }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isPaymentDefault}
                      id="is-payment-default"
                      onChange={(e) => setIsPaymentDefault(e.target.checked)}
                    />
                  }
                  labelPlacement="start"
                  label="Payment Default"
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
                Current Rate Data
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
                <Box sx={{ fontWeight: "bold", fontSize: "18px" }}>
                  As of Date:{" "}
                </Box>
                <Box sx={{ fontSize: "18px" }}>
                  {metrics[0]?.start_date
                    ? new Date(metrics[0].start_date).toLocaleDateString(
                        "en-US",
                      )
                    : ""}
                </Box>

                <Box
                  sx={{
                    fontWeight: "bold",
                    paddingTop: "4ch",
                    fontSize: "18px",
                  }}
                >
                  Leverage Ratio:
                </Box>
                <Box sx={{ fontSize: "18px", paddingTop: "4ch" }}>
                  {metrics[0]?.start_date
                    ? new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 6,
                        maximumFractionDigits: 6,
                      }).format(metrics[0]?.leverage_ratio)
                    : ""}
                </Box>

                <Box
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    paddingTop: "1.1ch",
                  }}
                >
                  Net Leverage Ratio:
                </Box>
                <Box sx={{ fontSize: "18px", paddingTop: "1.1ch" }}>
                  {metrics[0]?.start_date
                    ? new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 6,
                        maximumFractionDigits: 6,
                      }).format(metrics[0]?.net_leverage_ratio)
                    : ""}
                </Box>

                <Box
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    paddingTop: "1.5ch",
                  }}
                >
                  Interest Coverage Ratio:
                </Box>
                <Box sx={{ fontSize: "18px", paddingTop: "1.5ch" }}>
                  {metrics[0]?.start_date
                    ? new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 6,
                        maximumFractionDigits: 6,
                      }).format(metrics[0]?.int_coverage_ratio)
                    : ""}
                </Box>

                <Box
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    paddingTop: "1.8ch",
                  }}
                >
                  EBITDA:
                </Box>
                <Box sx={{ fontSize: "18px", paddingTop: "1.8ch" }}>
                  {metrics[0]?.start_date
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(metrics[0]?.ebitda)
                    : ""}
                </Box>

                <Box
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    marginTop: "1.2ch",
                  }}
                >
                  Is Cov Default:
                </Box>
                <Box sx={{ fontSize: "18px", marginTop: "1.2ch" }}>
                  {metrics[0]?.start_date
                    ? metrics[0]?.is_cov_default
                      ? "Yes"
                      : "No"
                    : ""}
                </Box>

                <Box
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    marginTop: "1.2ch",
                  }}
                >
                  Is Payment Default:
                </Box>
                <Box sx={{ fontSize: "18px", marginTop: "1.2ch" }}>
                  {metrics[0]?.start_date
                    ? metrics[0]?.is_payment_default
                      ? "Yes"
                      : "No"
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

export default UpdateMetrics;
