import { useEffect, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import { PieChart } from "@mui/x-charts/PieChart";
import { Typography, Box } from "@mui/material";

function Dashboard() {
  const [facilityData, setFacilityData] = useState([]);
  const [uniqueNames, setUniqueNames] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [facilityNames, setFacilityNames] = useState([]);
  const [facilityNumber, setFacilityNumber] = useState(null);
  const [uniqueFacilityNames, setUniqueFacilityNames] = useState([]);
  const [asOfDate, setAsOfDate] = useState("");
  const [message, setMessage] = useState("");
  const [lienChartData, setLienChartData] = useState(null);
  const [naicsChartData, setNaicsChartData] = useState(null);
  const [hqChartData, setHqChartData] = useState(null);
  const [revRegionData, setRevRegionData] = useState(null);
  const [publicData, setPublicData] = useState(null);
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
    setLienChartData(null);
    setNaicsChartData(null);
    setHqChartData(null);
    setRevRegionData(null);
    setPublicData(null);
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

  function aggregateLien(lienObject) {
    let lienAmounts = [];
    for (let i = 0; i < lienObject.length; i++) {
      const existing = lienAmounts.find((item) => item.label === lienObject[i].lienType);
      if (existing) {
        existing.value += lienObject[i].valuation;
      } else {
        lienAmounts.push({ value: lienObject[i].valuation, label: lienObject[i].lienType });
      }
    }
    return lienAmounts;
  }

  function aggregateNAICS(naicsObject) {
    let naicsAmounts = [];
    for (let i = 0; i < naicsObject.length; i++) {
      const existing = naicsAmounts.find((item) => item.label === naicsObject[i].naicsSubsector);
      if (existing) {
        existing.value += naicsObject[i].valuation;
      } else {
        naicsAmounts.push({
          value: naicsObject[i].valuation,
          label: naicsObject[i].naicsSubsector,
        });
      }
    }
    return naicsAmounts;
  }

  function aggregateHq(hqObject) {
    let hqAmounts = [];
    for (let i = 0; i < hqObject.length; i++) {
      const existing = hqAmounts.find((item) => item.label === hqObject[i].corpHQRegionName);
      if (existing) {
        existing.value += hqObject[i].valuation;
      } else {
        hqAmounts.push({ value: hqObject[i].valuation, label: hqObject[i].corpHQRegionName });
      }
    }
    return hqAmounts;
  }

  function aggregateRevRegion(revRegObject) {
    let revRegAmounts = [];
    for (let i = 0; i < revRegObject.length; i++) {
      const existing = revRegAmounts.find((item) => item.label === revRegObject[i].revRegionName);
      if (existing) {
        existing.value += revRegObject[i].valuation;
      } else {
        revRegAmounts.push({
          value: revRegObject[i].valuation,
          label: revRegObject[i].revRegionName,
        });
      }
    }
    return revRegAmounts;
  }

  function aggregatePublic(publicObject) {
    let publicAmounts = [];
    for (let i = 0; i < publicObject.length; i++) {
      const existing = publicAmounts.find((item) => item.label === publicObject[i].isPublic);
      if (existing) {
        existing.value += publicObject[i].valuation;
      } else {
        publicAmounts.push({ value: publicObject[i].valuation, label: publicObject[i].isPublic });
      }
    }
    return publicAmounts;
  }

  async function submitForm() {
    try {
      const fullInfoResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/pieChartCalculations`,
        {
          params: {
            debtFacilityId: facilityNumber,
            asOfDate: asOfDate,
          },
        },
      );

      const summarizedLien = aggregateLien(fullInfoResponse.data);
      setLienChartData({ data: summarizedLien });

      const summarizedNaics = aggregateNAICS(fullInfoResponse.data);
      setNaicsChartData({ data: summarizedNaics });

      const summarizedHq = aggregateHq(fullInfoResponse.data);
      setHqChartData({ data: summarizedHq });

      const summarizedRevReg = aggregateRevRegion(fullInfoResponse.data);
      setRevRegionData({ data: summarizedRevReg });

      const summarizedPublic = aggregatePublic(fullInfoResponse.data);
      setPublicData({ data: summarizedPublic });
    } catch (error) {
      setMessage("Error fetching rollforward data");
    }
  }

  return (
    <>
      <div style={{ display: "flex" }} className="dashboard-title">
        Facility Dashboard
      </div>
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

          <Autocomplete
            disablePortal
            id="autocomplete-facility-name"
            required
            options={uniqueFacilityNames}
            value={facilityName}
            sx={{ m: 1, width: "60ch" }}
            onChange={handleFacilityChange}
            getOptionLabel={(option) => option}
            renderInput={(params) => <TextField {...params} label="Facility Name" required />}
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
      {(lienChartData || naicsChartData || hqChartData || revRegionData || publicData) && (
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
            <Box>
              {lienChartData && (
                <>
                  <Typography align="center">Value by Lien Type</Typography>
                  <PieChart
                    series={[lienChartData]}
                    width={600}
                    height={350}
                    slotProps={{
                      legend: {
                        direction: "row",
                        position: { vertical: "bottom", horizontal: "middle" },
                      },
                    }}
                  />
                </>
              )}
            </Box>

            <Box>
              {naicsChartData && (
                <>
                  <Typography align="center">Value by NAICS Subsector</Typography>
                  <PieChart
                    series={[naicsChartData]}
                    width={600}
                    height={350}
                    slotProps={{
                      legend: {
                        direction: "horizontal",
                        position: { vertical: "bottom", horizontal: "middle" },
                      },
                    }}
                  />
                </>
              )}
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1, marginBottom: 2 }}>
            <Box>
              {hqChartData && (
                <>
                  <Typography align="center">Value by Corporate HQ</Typography>
                  <PieChart
                    series={[hqChartData]}
                    width={600}
                    height={350}
                    slotProps={{
                      legend: {
                        direction: "horizontal",
                        position: { vertical: "bottom", horizontal: "middle" },
                      },
                    }}
                  />
                </>
              )}
            </Box>

            <Box>
              {revRegionData && (
                <>
                  <Typography align="center">Value by Primary Revenue Region</Typography>
                  <PieChart
                    series={[revRegionData]}
                    width={600}
                    height={350}
                    slotProps={{
                      legend: {
                        direction: "horizontal",
                        position: { vertical: "bottom", horizontal: "middle" },
                      },
                    }}
                  />
                </>
              )}
            </Box>
          </Box>
          <Box>
            {publicData && (
              <>
                <Typography align="center">Value by Public/Private</Typography>
                <PieChart
                  series={[publicData]}
                  width={600}
                  height={350}
                  slotProps={{
                    legend: {
                      direction: "horizontal",
                      position: { vertical: "bottom", horizontal: "middle" },
                    },
                  }}
                />
              </>
            )}
          </Box>
        </Box>
      )}

      <Box sx={{ marginLeft: 5 }}>{message && <div className="alertMessage">{message}</div>}</Box>
      <div style={{ marginTop: "40px" }}>
        <Button
          variant="contained"
          onClick={submitForm}
          sx={{
            marginLeft: "50px",
            minWidth: "225px",
            minHeight: "50px",
            borderRadius: 2,
            backgroundColor: "#F6AE2D",
            color: "#000000",
            textTransform: "none",
            fontSize: "20px",
          }}
        >
          Generate Dashboard
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

export default Dashboard;
