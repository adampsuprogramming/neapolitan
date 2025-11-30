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

function AssetBalanceReport() {
  const [facilityData, setFacilityData] = useState([]);
  const [uniqueNames, setUniqueNames] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState("");
  const [portfolioNumber, setPortfolioNumber] = useState("");
  const [asOfDate, setAsOfDate] = useState("");
  const [rowData, setRowData] = useState([]);
  const [message, setMessage] = useState("");

  const handlePortfolioChange = (e, value) => {
    setSelectedPortfolio(value || "");
    const portfolioFacilities = facilityData.filter((item) =>
      item.portfolio_name.includes(value || ""),
    );
    setPortfolioNumber(portfolioFacilities[0].portfolio_id);
  };

  function clearData() {
    setSelectedPortfolio("");
    setAsOfDate("");
    setRowData([]);
  }

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
        `${process.env.REACT_APP_BACKEND_URL}/api/balanceReportCalculations`,
        // `https://mocki.io/v1/c70e6088-442e-4428-ba53-b029718b1b5e`,
        {
          params: {
            portfolioId: portfolioNumber,
            asOfDate: asOfDate,
          },
        },
      );
      setRowData(fullInfoResponse.data);
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
          width: "140ch",
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

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="As Of Date"
              id="as-of-date-picker"
              sx={{ m: 1, width: "25ch" }}
              value={asOfDate ? dayjs(asOfDate) : null}
              onChange={(newDate) => {
                setAsOfDate(newDate ? newDate.format("YYYY-MM-DD") : "");
              }}
              slotProps={{
                textField: {
                  inputProps: {
                    "data-testid": "as-of-date-picker",
                  },
                  helperText: "MM/DD/YYYY",
                },
              }}
            />
          </LocalizationProvider>
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
                Tranche Balance By Facility - {dayjs(asOfDate).format("M/DD/YYYY")}
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
                      {rowData[0].map((item, key) => (
                        <TableCell key={key}>{item}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {rowData.slice(1).map((item, key) => (
                      <TableRow key={key}>
                        {item.map((colItem, colKey) => (
                          <TableCell
                            key={colKey}
                            sx={
                              key === rowData.slice(1).length - 1
                                ? {
                                    fontWeight: "bold",
                                    borderTop: "2px solid #000",
                                    backgroundColor: "#f5f5f5",
                                    textAlign: typeof colItem === "number" ? "right" : "left",
                                  }
                                : {
                                    textAlign: typeof colItem === "number" ? "right" : "left",
                                    ...(colKey === 0 && { width: "300px" }),
                                  }
                            }
                          >
                            {typeof colItem === "number" ? (
                              <NumericFormat
                                value={colItem}
                                displayType="text"
                                thousandSeparator=","
                                decimalScale={0}
                                fixedDecimalScale
                              />
                            ) : (
                              colItem
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <br></br>
            </Box>
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

export default AssetBalanceReport;
