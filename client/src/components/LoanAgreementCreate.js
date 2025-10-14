import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function LoanAgreementCreate() {
  const [borrowerData, setBorrowerData] = useState([]); // Hold results of getBorrowerData below
  const [selectedBorrower, setSelectedBorrower] = useState(null); // Which borrower was selected?
  const [selectedBorrowerId, setSelectedBorrowerId] = useState(null); // What is primary key for the borrower
  const [loanAgreementTitle, setLoanAgreementTitle] = useState(""); // After user enters loan agreement title, it is set here via an onChange
  const [agreementDate, setAgreementDate] = useState(""); // After user chooses agreement date, it is stored here
  const [message, setMessage] = useState("");

  // this useEffect loads up the borrower to populate the dropdown for Borrower on page load

  useEffect(() => {
    async function getBorrowerData() {
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
        setMessage("There was an error updating borrower data");
      }
    }

    getBorrowerData();
  }, []);

  // this useEffect gets the related borrower id number when the borrower
  // is selected.  The borrower is later sent back to the server

  useEffect(() => {
    if (!selectedBorrower) return;
    setSelectedBorrowerId(selectedBorrower.borrower_id);
  }, [selectedBorrower]);

  // The following axios post function is run when the user clicks save

  async function postLoanAgreement() {
    if (!selectedBorrower || !loanAgreementTitle || !agreementDate) {
      setMessage(
        "Not Saved - Please fill out all required fields - denoted by *",
      );
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/createloanagreement`,
        {
          loanAgreementName: loanAgreementTitle,
          borrowerId: selectedBorrowerId,
          loanAgreementDate: agreementDate,
        },
      );
      if (response.status === 201) {
        clearData();
        setMessage("Loan Agreement Created Successfully");
      }
    } catch (error) {
      setMessage("There was an error creating the loan agreement.");
    }
  }

  // The following function is run when the user clicks clear

  function clearData() {
    setLoanAgreementTitle("");
    setSelectedBorrower(null);
    setAgreementDate("");
  }

  return (
    <>
      <div className="borrower-create">Create Loan Agreement</div>
      <Box component="form" sx={{ paddingLeft: "115px" }}>
        <Box
          sx={{
            border: "1px solid",
            borderRadius: 4,
            borderColor: "#c7c7c7ff",
            width: "110ch",
            m: 3,
            padding: 2,
          }}
        >
          <div
            className="row-1-new-loan-agreement"
            style={{ display: "flex", gap: "50px" }}
          >
            <Autocomplete
              disablePortal
              id="borrower-name"
              options={borrowerData}
              value={selectedBorrower}
              sx={{ m: 1, width: "35ch" }}
              onChange={(event, newValue) => setSelectedBorrower(newValue)}
              getOptionLabel={(option) => option.legal_name} // doesn't need '|| ""' since we are filtering nulls above
              renderInput={(params) => (
                <TextField {...params} label="Borrower Name" required />
              )}
            />

            <TextField
              required
              value={loanAgreementTitle}
              onChange={(event) => setLoanAgreementTitle(event.target.value)}
              id="loan-agreement-title-input"
              label="Loan Agreement Title"
              sx={{ m: 1, width: "60ch" }}
            />
          </div>

          <div className="row-2-new-loan-agreement">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Loan Agreement Date"
                id="loan-agreement-date"
                required
                sx={{ m: 1, width: "30ch", marginTop: 4 }}
                value={agreementDate ? dayjs(agreementDate) : null} // This is needed if date is not yet a valid date or a crash occurs
                onChange={(newDate) => {
                  setAgreementDate(newDate ? newDate.format("YYYY-MM-DD") : ""); // if there is anything in new date, set commitment date or else set it to blank
                }}
                slotProps={{
                  textField: {
                    required: true,
                    inputProps: { "data-testid": "agreement-date-picker" },
                    helperText: "MM/DD/YYYY",
                  },
                }}
              />
            </LocalizationProvider>
          </div>
        </Box>
        <Box
          sx={{
            width: "110ch",
            marginTop: 4,
            padding: 0,
            display: "flex",
          }}
        >
          <div>
            <Button
              variant="contained"
              onClick={postLoanAgreement}
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

export default LoanAgreementCreate;
