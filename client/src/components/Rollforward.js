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
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

function Rollforward() {
  const [facilityData, setFacilityData] = useState([]);
  const [uniqueNames, setUniqueNames] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [facilityNames, setFacilityNames] = useState([]);
  const [facilityNumber, setFacilityNumber] = useState(null);
  const [flowData, setFlowData] = useState([]);
  const [uniqueFacilityNames, setUniqueFacilityNames] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rowData, setRowData] = useState([]);
  const [totalRow, setTotalRow] = useState([]);
  const [currentOutstandings, setCurrentOutstandings] = useState(null);
  const [intExpDue, setIntExpDue] = useState(null);
  const [isFundsFlow, setIsFundsFlow] = useState(false);
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
    setStartDate("");
    setEndDate("");
    setRowData([]);
    setCurrentOutstandings("");
    setIntExpDue("");
    setIsFundsFlow(false);
  }

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
        setMessage("Error fetching facility data");
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

  async function submitForm() {
    try {
      const fullInfoResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/reportingCalculations`,
        // `https://mocki.io/v1/c70e6088-442e-4428-ba53-b029718b1b5e`,
        {
          params: {
            debtFacilityId: facilityNumber,
            startDate: startDate,
            endDate: endDate,
            isFundsFlow: isFundsFlow,
            currentOutstandings: currentOutstandings,
            intExpDue: intExpDue,
          },
        },
      );
      setRowData(fullInfoResponse.data.collateralData);
      setFlowData(fullInfoResponse.data.fundsFlowData);

      let totals = {
        balanceBeg: 0,
        collAdded: 0,
        collRemoved: 0,
        principalRec: 0,
        balanceEnd: 0,
        collateralName: 0,
        begValue: 0,
        chgDueToAdd: 0,
        chgDueToRepay: 0,
        chgDueToInternalVal: 0,
        addlChgBankVal: 0,
        endValue: 0,
        collateralName: 0,
        begLevAvail: 0,
        levAvailChgDueToAddition: 0,
        levAvailChgDueToRepay: 0,
        levAvailChgDueToVal: 0,
        levAvailChgDueToAdvRate: 0,
        endLevAvail: 0,
      };

      for (let loan of fullInfoResponse.data.collateralData) {
        totals.balanceBeg += parseFloat(loan.balanceBeg);
        totals.collAdded += parseFloat(loan.collAdded);
        totals.collRemoved += parseFloat(loan.collRemoved);
        totals.principalRec += parseFloat(loan.principalRec);
        totals.balanceEnd += parseFloat(loan.balanceEnd);
        totals.begValue += parseFloat(loan.begValue);
        totals.chgDueToAdd += parseFloat(loan.chgDueToAdd);
        totals.chgDueToRepay += parseFloat(loan.chgDueToRepay);
        totals.chgDueToInternalVal += parseFloat(loan.chgDueToInternalVal);
        totals.addlChgBankVal += parseFloat(loan.addlChgBankVal);
        totals.endValue += parseFloat(loan.endValue);
        totals.begLevAvail += parseFloat(loan.begLevAvail);
        totals.levAvailChgDueToAddition += parseFloat(loan.levAvailChgDueToAddition);
        totals.levAvailChgDueToRepay += parseFloat(loan.levAvailChgDueToRepay);
        totals.levAvailChgDueToVal += parseFloat(loan.levAvailChgDueToVal);
        totals.levAvailChgDueToAdvRate += parseFloat(loan.levAvailChgDueToAdvRate);
        totals.endLevAvail += parseFloat(loan.endLevAvail);
      }

      setTotalRow(totals);
    } catch (error) {
      setMessage("Error fetching rollforward data");
    }
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          border: 1,
          borderRadius: 4,
          borderColor: "#c7c7c7ff",
          marginTop: 4,
          marginLeft: 6,
          marginBottom: 3,
          padding: 2,
          width: "120ch",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 1, marginBottom: 2 }}>
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
              label="Start Date"
              id="start-date-picker"
              sx={{ m: 1, width: "25ch" }}
              value={startDate ? dayjs(startDate) : null}
              onChange={(newDate) => {
                setStartDate(newDate ? newDate.format("YYYY-MM-DD") : "");
              }}
              slotProps={{
                textField: {
                  inputProps: {
                    "data-testid": "start-date-picker",
                  },
                  helperText: "MM/DD/YYYY",
                },
              }}
            />
            <DatePicker
              label="End Date"
              id="end-date-picker"
              sx={{ m: 1, width: "25ch" }}
              value={endDate ? dayjs(endDate) : null}
              onChange={(newDate) => {
                setEndDate(newDate ? newDate.format("YYYY-MM-DD") : "");
              }}
              slotProps={{
                textField: {
                  inputProps: {
                    "data-testid": "end-date-picker",
                  },
                  helperText: "MM/DD/YYYY",
                },
              }}
            />
          </LocalizationProvider>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isFundsFlow}
                id="funds-flow-switch"
                onChange={(e) => setIsFundsFlow(e.target.checked)}
              />
            }
            labelPlacement="start"
            label="Includes Funds Flow"
          />
          <NumericFormat
            customInput={TextField}
            id="current-outstandings-textfield"
            sx={{ m: 1, width: "25ch", marginTop: 0, marginLeft: 15 }}
            disabled={!isFundsFlow}
            value={currentOutstandings}
            required={isFundsFlow}
            onValueChange={(value) => setCurrentOutstandings(value.floatValue)}
            label="Current Outstandings"
            thousandSeparator=","
            decimalScale={2}
            prefix="$"
            fixedDecimalScale
          />

          <NumericFormat
            customInput={TextField}
            id="interest-expense-due"
            sx={{ m: 1, width: "25ch", marginTop: 0, marginLeft: 5 }}
            disabled={!isFundsFlow}
            value={intExpDue}
            required={isFundsFlow}
            onValueChange={(value) => setIntExpDue(value.floatValue)}
            label="Interest Expense Due"
            thousandSeparator=","
            decimalScale={2}
            prefix="$"
            fixedDecimalScale
          />
        </Box>
      </Box>

      {rowData?.length > 0 ? (
        <>
          <Box sx={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            <Box>
              <div
                className="record-payments-received"
                style={{
                  fontSize: "18px",
                  fontFamily: "Inter",
                  paddingLeft: 50,
                  paddingTop: 20,
                  paddingBottom: 20,
                  fontWeight: "800",
                }}
              >
                Rollforward of Outstandings from {dayjs(startDate).format("M/DD/YYYY")} to{" "}
                {dayjs(endDate).format("M/DD/YYYY")}
              </div>
              <TableContainer component={Paper} sx={{ width: "95%", marginLeft: "5ch" }}>
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
                      <TableCell sx={{ width: "25%" }}>Borrower</TableCell>
                      <TableCell sx={{ width: "15%" }} align="right">
                        Beginning Outstanding
                      </TableCell>
                      <TableCell sx={{ width: "15%" }} align="right">
                        Collateral Added
                      </TableCell>
                      <TableCell sx={{ width: "15%" }} align="right">
                        Collateral Removed
                      </TableCell>
                      <TableCell sx={{ width: "15%" }} align="right">
                        Principal Received
                      </TableCell>
                      <TableCell sx={{ width: "15%" }} align="right">
                        Ending Outstanding
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {rowData.map((loan) => (
                      <TableRow
                        key={loan.collateralId}
                        sx={{
                          "&:nth-of-type(odd)": {
                            backgroundColor: "#edf8fdff",
                          },
                        }}
                      >
                        <TableCell>{loan.collateralName}</TableCell>
                        <TableCell align="right">
                          <NumericFormat
                            value={loan.balanceBeg}
                            displayType="text"
                            thousandSeparator=","
                            decimalScale={0}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <NumericFormat
                            value={loan.collAdded}
                            displayType="text"
                            thousandSeparator=","
                            decimalScale={0}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <NumericFormat
                            value={-loan.collRemoved}
                            displayType="text"
                            thousandSeparator=","
                            decimalScale={0}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <NumericFormat
                            value={-loan.principalRec}
                            displayType="text"
                            thousandSeparator=","
                            decimalScale={0}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <NumericFormat
                            value={loan.balanceEnd}
                            displayType="text"
                            thousandSeparator=","
                            decimalScale={0}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow
                      sx={{
                        backgroundColor: "#33648A",
                        "& .MuiTableCell-root": {
                          fontWeight: "bold",
                          color: "#fff",
                          fontSize: "16px",
                        },
                      }}
                    >
                      <TableCell>Total</TableCell>
                      <TableCell align="right">
                        <NumericFormat
                          value={totalRow.balanceBeg}
                          displayType="text"
                          thousandSeparator=","
                          decimalScale={0}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <NumericFormat
                          value={totalRow.collAdded}
                          displayType="text"
                          thousandSeparator=","
                          decimalScale={0}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <NumericFormat
                          value={-totalRow.collRemoved}
                          displayType="text"
                          thousandSeparator=","
                          decimalScale={0}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <NumericFormat
                          value={-totalRow.principalRec}
                          displayType="text"
                          thousandSeparator=","
                          decimalScale={0}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <NumericFormat
                          value={totalRow.balanceEnd}
                          displayType="text"
                          thousandSeparator=","
                          decimalScale={0}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <br></br>
              <div
                className="record-payments-received"
                style={{
                  fontSize: "18px",
                  fontFamily: "Inter",
                  paddingLeft: 50,
                  paddingTop: 20,
                  paddingBottom: 20,
                  fontWeight: "800",
                }}
              >
                Rollforward of Value from {dayjs(startDate).format("M/DD/YYYY")} to{" "}
                {dayjs(endDate).format("M/DD/YYYY")}
              </div>
              <TableContainer component={Paper} sx={{ width: "95%", marginLeft: "5ch" }}>
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
                      <TableCell sx={{ width: "25%" }}>Borrower</TableCell>
                      <TableCell sx={{ width: "15%" }} align="right">
                        Beginning Value
                      </TableCell>
                      <TableCell sx={{ width: "15%" }} align="right">
                        Change Due to Principal Additions
                      </TableCell>
                      <TableCell sx={{ width: "15%" }} align="right">
                        Change Due to Principal Repayments
                      </TableCell>
                      <TableCell sx={{ width: "15%" }} align="right">
                        Change Due to Valuation
                      </TableCell>
                      <TableCell sx={{ width: "15%" }} align="right">
                        Ending Value
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {rowData.map((loan) => (
                      <TableRow
                        key={loan.collateralId}
                        sx={{
                          "&:nth-of-type(odd)": {
                            backgroundColor: "#edf8fdff",
                          },
                        }}
                      >
                        <TableCell>{loan.collateralName}</TableCell>
                        <TableCell align="right">
                          <NumericFormat
                            value={loan.begValue}
                            displayType="text"
                            thousandSeparator=","
                            decimalScale={0}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <NumericFormat
                            value={loan.chgDueToAdd}
                            displayType="text"
                            thousandSeparator=","
                            decimalScale={0}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <NumericFormat
                            value={loan.chgDueToRepay}
                            displayType="text"
                            thousandSeparator=","
                            decimalScale={0}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <NumericFormat
                            value={loan.chgDueToInternalVal + loan.addlChgBankVal}
                            displayType="text"
                            thousandSeparator=","
                            decimalScale={0}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <NumericFormat
                            value={loan.endValue}
                            displayType="text"
                            thousandSeparator=","
                            decimalScale={0}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow
                      sx={{
                        backgroundColor: "#33648A",
                        "& .MuiTableCell-root": {
                          fontWeight: "bold",
                          color: "#fff",
                          fontSize: "16px",
                        },
                      }}
                    >
                      <TableCell>Total</TableCell>
                      <TableCell align="right">
                        <NumericFormat
                          value={totalRow.begValue}
                          displayType="text"
                          thousandSeparator=","
                          decimalScale={0}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <NumericFormat
                          value={totalRow.chgDueToAdd}
                          displayType="text"
                          thousandSeparator=","
                          decimalScale={0}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <NumericFormat
                          value={totalRow.chgDueToRepay}
                          displayType="text"
                          thousandSeparator=","
                          decimalScale={0}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <NumericFormat
                          value={totalRow.chgDueToInternalVal + totalRow.addlChgBankVal}
                          displayType="text"
                          thousandSeparator=","
                          decimalScale={0}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <NumericFormat
                          value={totalRow.endValue}
                          displayType="text"
                          thousandSeparator=","
                          decimalScale={0}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <br></br>
              <div
                className="record-payments-received"
                style={{
                  fontSize: "18px",
                  fontFamily: "Inter",
                  paddingLeft: 50,
                  paddingTop: 20,
                  paddingBottom: 20,
                  fontWeight: "800",
                }}
              >
                Rollforward of Total Availability from {dayjs(startDate).format("M/DD/YYYY")} to{" "}
                {dayjs(endDate).format("M/DD/YYYY")}
              </div>
              <TableContainer component={Paper} sx={{ width: "95%", marginLeft: "5ch" }}>
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
                      <TableCell sx={{ width: "25%" }}>Borrower</TableCell>
                      <TableCell sx={{ width: "12.5%" }} align="right">
                        Beginning Contribution to Leverage
                      </TableCell>
                      <TableCell sx={{ width: "12.5%" }} align="right">
                        Change Due to Addition
                      </TableCell>
                      <TableCell sx={{ width: "12.5%" }} align="right">
                        Change Due to Repayment
                      </TableCell>
                      <TableCell sx={{ width: "12.5%" }} align="right">
                        Change Due to Valuation
                      </TableCell>
                      <TableCell sx={{ width: "12.5%" }} align="right">
                        Change Due to Advance Rate Change
                      </TableCell>
                      <TableCell sx={{ width: "12.5%" }} align="right">
                        Ending Contribution to Leverage
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {rowData.map((loan) => (
                      <TableRow
                        key={loan.collateralId}
                        sx={{
                          "&:nth-of-type(odd)": {
                            backgroundColor: "#edf8fdff",
                          },
                        }}
                      >
                        <TableCell>{loan.collateralName}</TableCell>
                        <TableCell align="right">
                          <NumericFormat
                            value={loan.begLevAvail}
                            displayType="text"
                            thousandSeparator=","
                            decimalScale={0}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <NumericFormat
                            value={loan.levAvailChgDueToAddition}
                            displayType="text"
                            thousandSeparator=","
                            decimalScale={0}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <NumericFormat
                            value={loan.levAvailChgDueToRepay}
                            displayType="text"
                            thousandSeparator=","
                            decimalScale={0}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <NumericFormat
                            value={loan.levAvailChgDueToVal}
                            displayType="text"
                            thousandSeparator=","
                            decimalScale={0}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <NumericFormat
                            value={loan.levAvailChgDueToAdvRate}
                            displayType="text"
                            thousandSeparator=","
                            decimalScale={0}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <NumericFormat
                            value={loan.endLevAvail}
                            displayType="text"
                            thousandSeparator=","
                            decimalScale={0}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow
                      sx={{
                        backgroundColor: "#33648A",
                        "& .MuiTableCell-root": {
                          fontWeight: "bold",
                          color: "#fff",
                          fontSize: "16px",
                        },
                      }}
                    >
                      <TableCell>Total</TableCell>
                      <TableCell align="right">
                        <NumericFormat
                          value={totalRow.begLevAvail}
                          displayType="text"
                          thousandSeparator=","
                          decimalScale={0}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <NumericFormat
                          value={totalRow.levAvailChgDueToAddition}
                          displayType="text"
                          thousandSeparator=","
                          decimalScale={0}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <NumericFormat
                          value={totalRow.levAvailChgDueToRepay}
                          displayType="text"
                          thousandSeparator=","
                          decimalScale={0}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <NumericFormat
                          value={totalRow.levAvailChgDueToVal}
                          displayType="text"
                          thousandSeparator=","
                          decimalScale={0}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <NumericFormat
                          value={totalRow.levAvailChgDueToAdvRate}
                          displayType="text"
                          thousandSeparator=","
                          decimalScale={0}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <NumericFormat
                          value={totalRow.endLevAvail}
                          displayType="text"
                          thousandSeparator=","
                          decimalScale={0}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <br></br>
              <div
                className="record-payments-received"
                style={{
                  fontSize: "18px",
                  fontFamily: "Inter",
                  paddingLeft: 50,
                  paddingTop: 20,
                  paddingBottom: 20,
                  fontWeight: "800",
                }}
              >
                Additional Data - {dayjs(startDate).format("M/DD/YYYY")} /{" "}
                {dayjs(endDate).format("M/DD/YYYY")}
              </div>
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
                      <TableCell sx={{ width: "25%" }}>Borrower</TableCell>
                      <TableCell sx={{ width: "10.7%" }} align="right">
                        Beginning Bank Valuation
                      </TableCell>
                      <TableCell sx={{ width: "10.7%" }} align="right">
                        Ending Bank Valuation
                      </TableCell>
                      <TableCell sx={{ width: "10.7%" }} align="right">
                        Beginning Internal Valuation
                      </TableCell>
                      <TableCell sx={{ width: "10.7%" }} align="right">
                        Ending Internal Valuation
                      </TableCell>
                      <TableCell sx={{ width: "10.7%" }} align="right">
                        Beginning Advance Rate
                      </TableCell>
                      <TableCell sx={{ width: "10.7%" }} align="right">
                        Ending Advance Rate
                      </TableCell>
                      <TableCell sx={{ width: "10.7%" }} align="right">
                        Interest Received
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {rowData.map((loan) => (
                      <TableRow
                        key={loan.collateralId}
                        sx={{
                          "&:nth-of-type(odd)": {
                            backgroundColor: "#edf8fdff",
                          },
                        }}
                      >
                        <TableCell>{loan.collateralName}</TableCell>
                        <TableCell align="right">{(loan.bankValBeg * 100).toFixed(2)}%</TableCell>
                        <TableCell align="right">{(loan.bankValEnd * 100).toFixed(2)}%</TableCell>
                        <TableCell align="right">
                          {(loan.internalValBeg * 100).toFixed(2)}%
                        </TableCell>
                        <TableCell align="right">
                          {(loan.internalValEnd * 100).toFixed(2)}%
                        </TableCell>
                        <TableCell align="right">
                          {(loan.advanceRateBeg * 100).toFixed(2)}%
                        </TableCell>
                        <TableCell align="right">
                          {(loan.advanceRateEnd * 100).toFixed(2)}%
                        </TableCell>
                        <TableCell align="right">
                          <NumericFormat
                            value={loan.intRec}
                            displayType="text"
                            thousandSeparator=","
                            decimalScale={0}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {isFundsFlow ? (
              <Box
                sx={{
                  border: "1px solid",
                  borderRadius: 4,
                  borderColor: "#c7c7c7ff",
                  width: "50ch",
                  marginTop: 8,
                  padding: 2,
                  fontSize: "20px",
                }}
              >
                <Box
                  sx={{
                    textAlign: "center",
                    marginBottom: 5,
                    fontWeight: "700",
                  }}
                >
                  Funds Flow from {dayjs(startDate).format("M/DD/YYYY")} to{" "}
                  {dayjs(endDate).format("M/DD/YYYY")}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 1,
                  }}
                >
                  <Box sx={{ fontWeight: "500" }}>Current Facility Balance</Box>
                  <Box>
                    {
                      <NumericFormat
                        value={flowData.currFacBal}
                        displayType="text"
                        thousandSeparator=","
                        decimalScale={0}
                      />
                    }
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 1,
                  }}
                >
                  <Box sx={{ fontWeight: "500" }}>Total Borrowing Availability</Box>
                  <Box>
                    {
                      <NumericFormat
                        value={flowData.endLevAvail}
                        displayType="text"
                        thousandSeparator=","
                        decimalScale={0}
                      />
                    }
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 1,
                  }}
                >
                  <Box sx={{ fontWeight: "700" }}>&nbsp;&nbsp;&nbsp;&nbsp;Excess/(Deficit)</Box>
                  <Box sx={{ fontWeight: "700" }}>
                    {
                      <NumericFormat
                        value={flowData.currAvail}
                        displayType="text"
                        thousandSeparator=","
                        decimalScale={0}
                      />
                    }
                  </Box>
                </Box>
                <br></br>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 1,
                  }}
                >
                  <Box sx={{ fontWeight: "700" }}>Interest Expense Due:</Box>
                  <Box sx={{ fontWeight: "700" }}>
                    {
                      <NumericFormat
                        value={flowData.intExp}
                        displayType="text"
                        thousandSeparator=","
                        decimalScale={0}
                      />
                    }
                  </Box>
                </Box>
                <br></br>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 1,
                  }}
                >
                  <Box sx={{ fontWeight: "500" }}>Total Principal Received:</Box>
                  <Box>
                    {
                      <NumericFormat
                        value={flowData.principalRec}
                        displayType="text"
                        thousandSeparator=","
                        decimalScale={0}
                      />
                    }
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 1,
                  }}
                >
                  <Box sx={{ fontWeight: "500" }}>Total Interest Received:</Box>
                  <Box>
                    {
                      <NumericFormat
                        value={flowData.intRec}
                        displayType="text"
                        thousandSeparator=","
                        decimalScale={0}
                      />
                    }
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 1,
                  }}
                >
                  <Box sx={{ fontWeight: "700" }}>
                    &nbsp;&nbsp;&nbsp;&nbsp;Total Funds to Distribute:
                  </Box>
                  <Box sx={{ fontWeight: "700" }}>
                    {
                      <NumericFormat
                        value={flowData.totalDist}
                        displayType="text"
                        thousandSeparator=","
                        decimalScale={0}
                      />
                    }
                  </Box>
                </Box>

                <br></br>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 1,
                  }}
                >
                  <Box sx={{ fontWeight: "700" }}>Funds Due to Bank</Box>
                  <Box sx={{ fontWeight: "700" }}>
                    {
                      <NumericFormat
                        value={flowData.dueToBank}
                        displayType="text"
                        thousandSeparator=","
                        decimalScale={0}
                      />
                    }
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 1,
                  }}
                >
                  <Box sx={{ fontWeight: "700" }}>Funds Due to / (from) Client</Box>
                  <Box sx={{ fontWeight: "700" }}>
                    {
                      <NumericFormat
                        value={flowData.dueToClient}
                        displayType="text"
                        thousandSeparator=","
                        decimalScale={0}
                      />
                    }
                  </Box>
                </Box>
              </Box>
            ) : null}
          </Box>
        </>
      ) : (
        ""
      )}

      <Box sx={{ marginLeft: 5 }}>{message && <div className="alertMessage">{message}</div>}</Box>
      <div style={{ marginTop: "40px" }}>
        <Button
          variant="contained"
          onClick={submitForm}
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
          Generate Report
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
    </>
  );
}

export default Rollforward;
