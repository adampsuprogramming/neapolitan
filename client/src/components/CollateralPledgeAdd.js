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

function CollateralPledgeAdd() {
  const [loanApprovalData, setLoanApprovalData] = useState([]);
  const [selectedApproval, setSelectedApproval] = useState(null); // After user chooses approval, it is stored here
  const [inclusionDate, setInclusionDate] = useState(""); // After user chooses inclusion date, it is stored here
  const [outstandingAmount, setOutstandingAmount] = useState(null); // After user chooses oustanding amount, it is stored here
  const [commitmentAmount, setCommitmentAmount] = useState(null); // After user chooses commitment amount, it is stored here
  const [loanApprovalId, setLoanApprovalId] = useState(null); // Gets loan approval id when user selects loan approval name
  const [debtFacilityId, setDebtFacilityId] = useState(null); // Gets debt facility id when user loan approval name
  const [trancheId, setTrancheId] = useState(null); // Gets tranche id when use selects tranche id
  const [borrowerName, setBorrowerName] = useState(""); // Holds borrower name for reporting box on screen
  const [agreementName, setAgreementName] = useState(""); // Holds agreement name for reporting box on screen
  const [trancheName, setTrancheName] = useState(""); // Holds tranche name for reporting box on screen
  const [maxApproved, setMaxApproved] = useState(""); // Holds max approval for reporting box on screen
  const [expiration, setExpiration] = useState(""); // Holds expiration date for reporting box on screen
  const [bankName, setBankName] = useState(""); // Holds expiration date for reporting box on screen
  const [facilityName, setFacilityName] = useState(""); // Holds facility name for reporting box on screen
  const [message, setMessage] = useState("");

  // this useEffect populates loan approval info on page load

  useEffect(() => {
    async function getLoanApprovalData() {
      try {
        const fullInfoResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/loanapprovalquery`,
        );
        setLoanApprovalData(fullInfoResponse.data);
      } catch (error) {
        setMessage("Error fetching data: ", error);
      }
    }

    getLoanApprovalData();
  }, []);

  useEffect(() => {
    if (!selectedApproval) return;
    setLoanApprovalId(selectedApproval.loan_approval_id);
    setDebtFacilityId(selectedApproval.debt_facility_id);
    setTrancheId(selectedApproval.tranche_id);
    setBorrowerName(selectedApproval.legal_name);
    setAgreementName(selectedApproval.loan_agreement_name);
    setTrancheName(selectedApproval.tranche_name);
    setMaxApproved(selectedApproval.approved_amount);
    setExpiration(selectedApproval.approval_expiration);
    setBankName(selectedApproval.lender_name);
    setFacilityName(selectedApproval.debt_facility_name);
  }, [selectedApproval]);

  async function createCollateral() {
    try {
      if (inclusionDate >= expiration) {
        setMessage("Inclusion Date Must Be Prior to Expiration Date");
        return;
      }
      if (outstandingAmount > commitmentAmount) {
        setMessage("Outstanding Amount Must Be Less Than Or Equal To Commitment Amount");
        return;
      }
      if (outstandingAmount > maxApproved) {
        setMessage("Outstanding Amount Must Be Less Than Or Equal To Maximum Approved");
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/createcollateral`,
        {
          loanApprovalId,
          debtFacilityId,
          trancheId,
          inclusionDate,
          outstandingAmount,
          commitmentAmount,
        },
      );
      if (response.status === 201) {
        clearData();
        setMessage("Collateral Pledge Created Successfully");
      }
    } catch {
      setMessage("There was an error creating the collateral pledge.");
    }
  }

  function clearData() {
    setSelectedApproval(null);
    setInclusionDate("");
    setOutstandingAmount("");
    setCommitmentAmount("");
    setLoanApprovalId("");
    setDebtFacilityId("");
    setTrancheId("");
    setBorrowerName("");
    setAgreementName("");
    setTrancheName("");
    setMaxApproved("");
    setExpiration("");
    setBankName("");
    setFacilityName("");
  }

  return (
    <>
      <div style={{ display: "flex" }} className="debt-facility-create">
        Pledge Collateral to Facility
      </div>
      <Box component="form" sx={{ paddingLeft: "115px", display: "flex" }}>
        <Box
          sx={{
            border: "1px solid",
            borderRadius: 4,
            borderColor: "#c7c7c7ff",
            width: "90ch",
            m: 3,
            padding: 2,
          }}
        >
          <Autocomplete
            disablePortal
            id="autocomplete-loan-approval-name"
            required
            options={loanApprovalData}
            value={selectedApproval}
            sx={{ m: 1, marginTop: 3, width: "80ch" }}
            onChange={(event, newValue) => setSelectedApproval(newValue)}
            getOptionLabel={(option) => option.loan_approval_name || ""}
            renderInput={(params) => <TextField {...params} label="Select Loan Approval" />}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Inclusion Date"
              id="inclusion-date-picker"
              sx={{ m: 1, width: "25ch", marginTop: 5 }}
              value={inclusionDate ? dayjs(inclusionDate) : null}
              onChange={(newDate) => {
                setInclusionDate(newDate ? newDate.format("YYYY-MM-DD") : "");
              }}
              slotProps={{
                textField: {
                  inputProps: {
                    "data-testid": "inclusion-date-picker",
                  },
                  helperText: "MM/DD/YYYY",
                },
              }}
            />
          </LocalizationProvider>

          <NumericFormat
            customInput={TextField}
            id="outstanding-amount-field"
            sx={{ m: 1, width: "25ch", marginTop: 5 }}
            required
            value={outstandingAmount}
            onValueChange={(value) => setOutstandingAmount(value.floatValue)}
            label="Outstanding Pledged"
            thousandSeparator=","
            decimalScale={2}
            fixedDecimalScale
            prefix="$"
          />

          <NumericFormat
            customInput={TextField}
            id="commitment-amount-field"
            sx={{ m: 1, width: "25ch", marginTop: 5 }}
            required
            value={commitmentAmount}
            onValueChange={(value) => setCommitmentAmount(value.floatValue)}
            label="Commitment Pledged"
            thousandSeparator=","
            decimalScale={2}
            fixedDecimalScale
            prefix="$"
          />
        </Box>
        <Box
          sx={{
            border: "1px solid",
            borderRadius: 4,
            borderColor: "#c7c7c7ff",
            bgcolor: "#e4e4e4ff",
            width: "70ch",
            m: 3,
            padding: 2,
            display: "grid",
            rowGap: 2,
            columnGap: 5,
            gridTemplateColumns: "auto 1fr",
          }}
        >
          <Box sx={{ fontWeight: "700" }}>Borrower Name:</Box>
          <Box>{borrowerName}</Box>

          <Box sx={{ fontWeight: "700" }}>Agreement Name:</Box>
          <Box>{agreementName}</Box>

          <Box sx={{ fontWeight: "700" }}>Loan Tranche:</Box>
          <Box>{trancheName}</Box>

          <Box sx={{ fontWeight: "700" }}>Maximum Approved:</Box>
          <Box>
            {maxApproved === ""
              ? ""
              : Number(maxApproved).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
          </Box>

          <Box sx={{ fontWeight: "700" }}>Approval Expiration:</Box>
          <Box>{expiration === "" ? "" : dayjs(expiration).format("MM/DD/YYYY")}</Box>

          <Box sx={{ fontWeight: "700" }}>Bank Name:</Box>
          <Box>{bankName}</Box>

          <Box sx={{ fontWeight: "700" }}>Facility Name:</Box>
          <Box>{facilityName}</Box>
        </Box>
      </Box>

      <Box
        sx={{
          width: "110ch",
          marginLeft: "100px",
          padding: 2,
          display: "flex",
        }}
      >
        <Button
          variant="contained"
          onClick={createCollateral}
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
          Pledge Collateral
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
      </Box>
      <Box sx={{ marginLeft: "14ch" }}>
        {/* Displays message below in a success or failure situation */}
        {message && <div className="alertMessage">{message}</div>}
      </Box>
    </>
  );
}

export default CollateralPledgeAdd;
