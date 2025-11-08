import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { NumericFormat } from "react-number-format";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function PaymentsReceived() {
  const [facilityData, setFacilityData] = useState([]);
  const [uniqueNames, setUniqueNames] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [facilityNames, setFacilityNames] = useState([]);
  const [facilityNumber, setFacilityNumber] = useState(null);
  const [uniqueFacilityNames, setUniqueFacilityNames] = useState([]);
  const [paymentDate, setPaymentDate] = useState("");
  const [rowData, setRowData] = useState([]);
  const [newData, setNewData] = useState([]);
  const [latestPymtDate, setLatestPymtDate] = useState(null);
  const [message, setMessage] = useState("");

  const handlePortfolioChange = (e, value) => {
    setSelectedPortfolio(value || "");
    const portfolioFacilities = facilityData.filter((item) =>
      item.portfolio_name.includes(value || ""),
    );
    setFacilityNames(portfolioFacilities);
  };

  const handleFacilityChange = (e, value) => {
    setFacilityName(value || "");
    const facility_record = facilityData.find((f) => f.debt_facility_name === value);

    const facility_numb = facility_record.debt_facility_id;
    setFacilityNumber(facility_numb);
  };

  function clearData() {
    setSelectedPortfolio("");
    setFacilityName("");
    setFacilityNames([]);
    setFacilityNumber(null);
    setUniqueFacilityNames([]);
    setPaymentDate("");
    setRowData([]);
    setNewData([]);
  }

  const handleDataChange = (collateralId, commitAmt, outstandingAmt, field, value) => {
    let newOutstanding;
    let newCommit;
    const existingRecord = newData.find((item) => item.collateralId === collateralId); // find existing row for collateralId and save it as a new variable
    const tempArray = newData.filter((item) => item.collateralId !== collateralId); // get existing array for newData but without the line the collateralId passed in

    const currCommit = existingRecord?.commitment ?? commitAmt;
    const currOutstanding = existingRecord?.outstanding ?? outstandingAmt;

    // If there is an amount in principalReceived, then reduce the new outstanding amount
    if (field === "principalReceived") {
      newOutstanding = outstandingAmt - value;
      newCommit = commitAmt - value;
    } else {
      newCommit = currCommit;
      newOutstanding = currOutstanding;
    }
    tempArray.push({
      ...existingRecord, // the array items in existing (if any)
      collateralId: collateralId, // included for the first time we're create the new row array
      commitment: newCommit,
      outstanding: newOutstanding,
      [field]: value, // set new value for whatever field name we'reupdating
    });

    setNewData(tempArray);
  };

  useEffect(() => {
    if (facilityNames.length > 0) {
      const facilityNameSelection = facilityNames.map((a) => a.debt_facility_name);
      const uniqueDebtFacilityNamesArray = Array.from(new Set(facilityNameSelection)).sort();
      setUniqueFacilityNames(uniqueDebtFacilityNamesArray);
    }
  }, [facilityNames]);

  useEffect(() => {
    async function getFacilityData() {
      try {
        const fullInfoResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/facilities`,
        );
        setFacilityData(fullInfoResponse.data);
      } catch (error) {
        console.error("Error fetching: ", error);
      }
    }

    getFacilityData();
  }, []);

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
        const [firstResponse, secondResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/borrowbase`, {
            params: {
              as_of_date: paymentDate,
              facility_id: facilityNumber,
            },
          }),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/paymentsQuery`, {
            params: {
              debtFacilityId: facilityNumber,
            },
          }),
        ]);

        const sortedFirstResponse = firstResponse.data.sort((a, b) => a.legal_name.localeCompare(b.legal_name));
        setRowData(sortedFirstResponse);

        if (secondResponse.data.length > 0) {
          setLatestPymtDate(secondResponse.data[0].payment_date);
        } else {
          setLatestPymtDate(null);
        }
      } catch (error) {
        console.error("Error fetching: ", error);
      }
    }
    if (paymentDate && facilityNumber) {
      getBorrowBase();
    }
  }, [paymentDate, facilityNumber]);

  const getAmount = (collateralID, field) => {
    return newData.find((item) => item.collateralId === collateralID)?.[field] || "";
  };

  async function postPaymentUpdate() {
    if (paymentDate <= latestPymtDate) {
      setMessage("Payment Date Must Me After Previously Entered Payments Dates for this Facility");
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/createPayments`, {
        paymentDate: paymentDate,
        paymentsReceived: newData,
      });
      if (response.status === 201) {
        clearData();
        setMessage("Payments Successfully Posted");
      }
    } catch {
      setMessage("There was an error posting the payments.");
    }
  }

  return (
    <>
      <div
        className="record-payments-received"
        style={{
          fontSize: "18px",
          fontFamily: "Inter",
          paddingLeft: 60,
          paddingTop: 20,
          paddingBottom: 20,
          fontWeight: "800",
        }}
      >
        Record Payments Received
      </div>
      <Box
        sx={{
          display: "flex",
          border: 1,
          borderRadius: 4,
          borderColor: "#c7c7c7ff",
          marginTop: 4,
          marginLeft: 6,
          marginBottom: 3,
          padding: 2,
          width: "120ch",
        }}
      >
        <Autocomplete
          disablePortal
          id="autocomplete-portfolio-name"
          required
          options={uniqueNames}
          value={selectedPortfolio}
          sx={{ m: 1, width: "40ch" }}
          onChange={handlePortfolioChange}
          getOptionLabel={(option) => option}
          renderInput={(params) => <TextField {...params} label="Portfolio Name" required />}
        />

        <Autocomplete
          disablePortal
          id="autocomplete-facility-name"
          required
          options={uniqueFacilityNames}
          value={facilityName}
          sx={{ m: 1, width: "40ch" }}
          onChange={handleFacilityChange}
          getOptionLabel={(option) => option}
          renderInput={(params) => <TextField {...params} label="Facility Name" required />}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Payment Date"
            id="payment-date-picker"
            sx={{ m: 1, width: "25ch" }}
            value={paymentDate ? dayjs(paymentDate) : null}
            onChange={(newDate) => {
              setPaymentDate(newDate ? newDate.format("YYYY-MM-DD") : "");
            }}
            slotProps={{
              textField: {
                inputProps: {
                  "data-testid": "payment-date-picker",
                },
                helperText: "MM/DD/YYYY",
              },
            }}
          />
        </LocalizationProvider>
      </Box>

      {rowData.length > 0 ? (
        <TableContainer component={Paper} sx={{ width: "75%", marginLeft: "5ch" }}>
          <Table sx={{ "& .MuiTableCell-root": { fontSize: "16px" } }}>
            <TableHead
              sx={{
                "& .MuiTableCell-root": {
                  fontSize: "16px",
                  fontWeight: "bold",
                  backgroundColor: "#33648A",
                  color: "#fff",
                },
              }}
            >
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Borrower</TableCell>
                <TableCell>Commitment Amount</TableCell>
                <TableCell>Outstanding Amount</TableCell>
                <TableCell>Principal Received</TableCell>
                <TableCell>Interest Received</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rowData.map((loan) => (
                <TableRow
                  key={loan.collateral_id}
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "#edf8fdff" },
                  }}
                >
                  <TableCell>{loan.collateral_id}</TableCell>
                  <TableCell>{loan.legal_name}</TableCell>
                  <TableCell>
                    {" "}
                    <NumericFormat
                      value={loan.commitment_amount}
                      displayType="text"
                      thousandSeparator=","
                      decimalScale={2}
                      prefix="$"
                    />
                  </TableCell>
                  <TableCell>
                    <NumericFormat
                      value={loan.outstanding_amount}
                      displayType="text"
                      thousandSeparator=","
                      decimalScale={2}
                      prefix="$"
                    />
                  </TableCell>
                  <TableCell>
                    {" "}
                    <NumericFormat
                      customInput={TextField}
                      id="new-principal-received"
                      size="small"
                      sx={{ width: "25ch" }}
                      value={getAmount(loan.collateral_id, "principalReceived")}
                      onValueChange={(values) =>
                        handleDataChange(
                          loan.collateral_id,
                          loan.commitment_amount,
                          loan.outstanding_amount,
                          "principalReceived",
                          values.floatValue,
                        )
                      }
                      label="Principal Received"
                      prefix="$"
                      thousandSeparator=","
                      decimalScale={2}
                      fixedDecimalScale
                    />
                  </TableCell>
                  <TableCell>
                    {" "}
                    <NumericFormat
                      customInput={TextField}
                      id="new-interest-received"
                      size="small"
                      sx={{ width: "25ch" }}
                      value={getAmount(loan.collateral_id, "interestReceived")}
                      onValueChange={(values) =>
                        handleDataChange(
                          loan.collateral_id,
                          loan.commitment_amount,
                          loan.outstanding_amount,
                          "interestReceived",
                          values.floatValue,
                        )
                      }
                      label="Interest Received"
                      prefix="$"
                      thousandSeparator=","
                      decimalScale={2}
                      fixedDecimalScale
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        ""
      )}

      {newData.length > 0 && (
        <Box sx={{ marginTop: "2ch", marginLeft: "2ch", marginBottom: "10ch" }}>
          <Button
            variant="contained"
            onClick={postPaymentUpdate}
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
        </Box>
      )}
      <Box sx={{ marginLeft: 5 }}>{message && <div className="alertMessage">{message}</div>}</Box>
    </>
  );
}

export default PaymentsReceived;
