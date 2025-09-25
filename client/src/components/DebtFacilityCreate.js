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
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import FormHelperText from "@mui/material/FormHelperText";

function DebtFacilityCreate() {
  const [lenderData, setLenderData] = useState([]); // Hold results of getLenderData below, an array of lender_name, lender_id
  const [portfolioData, setPortfolioData] = useState([]); // Hold results of getPortfolioData below, an array of portfolio_name, portfolio_id
  const [selectedLender, setSelectedLender] = useState(null); // After user chooses lender, it is set here via an onChange
  const [selectedLenderId, setSelectedLenderId] = useState(null); // After user chooses lender, a useEffect is run to find the related id and store here
  const [selectedPortfolio, setSelectedPortfolio] = useState(null); // After user chooses portfolio, it is set here via an onChange
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null); // After user chooses a portfolio, a useEffect is run to find the related id and store here
  const [facilityName, setFacilityName] = useState(""); // After user enters facility name, it is set here via an onChange
  const [commitmentDate, setCommitmentDate] = useState(""); // After user chooses commitment date, it is stored here
  const [maturityDate, setMaturityDate] = useState(""); // After user chooses maturity date, it is stored here
  const [commitmentAmount, setCommitmentAmount] = useState(null); // After user chooses commitment amount, it is stored here
  const [isOverallRate, setIsOverallRate] = useState(false); // After user chooses toggle for overall rate, it is stored here - defaults to false
  const [maxAdvanceRate, setMaxAdvanceRate] = useState(null); // After user enters max advance rate, it is stored here --- need to divide by 100 to get percent
  const [isAssetByAssetRate, setIsAssetByAssetRate] = useState(false); // After user chooses toggle for asset-by-asset rate, it is stored here - defaults to false
  const [firstLienRate, setFirstLienRate] = useState(null); // After user enteres first lien rate, it is stored here --- need to divide by 100 to get percent
  const [secondLienRate, setSecondLienRate] = useState(null); // After user enters second lien rate, it is stored here --- need to divide by 100 to get percent
  const [mezzanineRate, setMezzanineRate] = useState(null); // After user enters mezz rate, it is stored here --- need to divide by 100 to get percent
  const [isMinimumEquity, setIsMinimumEquity] = useState(false); // After user chooses toggle for min equity, it is stored here - defaults to false
  const [minimumEquity, setMinimumEquity] = useState(null); //After use enters min equity, it is stored here
  const [message,setMessage] = useState("");

  // this useEffect loads up the Lender data to populate the dropdown
  // on page load

  useEffect(() => {
    async function getLenderData() {
      try {
        const fullInfoResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/lenderquery`,
        );
        setLenderData(fullInfoResponse.data);
      } catch (error) {
        console.error("Error fetching");
      }
    }

    getLenderData();
  }, []);

  // this useEffect loads up the Portfolio data to populate the dropdown
  // on page load.

  useEffect(() => {
    async function getPortfolioData() {
      try {
        const fullInfoResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/portfolioquery`,
        );
        setPortfolioData(fullInfoResponse.data);
      } catch (error) {
        console.error("Error fetching");
      }
    }

    getPortfolioData();
  }, []);

  // this useEffect gets the related lender id number when the lender record
  // is selected.  The lender number is needed to send back to the server

  useEffect(() => {
    if (!selectedLender) return;
    setSelectedLenderId(selectedLender.lender_id);
  }, [selectedLender]);

  // this useEffect gets the related portfolio id number when the portfolio record
  // is selected.  The portfolio number is needed to send back to the server

  useEffect(() => {
    if (!selectedPortfolio) return;
    setSelectedPortfolioId(selectedPortfolio.portfolio_id);
  }, [selectedPortfolio]);


  async function postFacility() {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/createdebtfacility`,
        {
          debtFacilityName: facilityName,
          portfolioId: selectedPortfolioId,
          lenderId: selectedLenderId,
          startDate: commitmentDate,
          endDate: maturityDate,
          overAllCommitmentAmount: commitmentAmount,
          isOverallRate: isOverallRate,
          overallRate: maxAdvanceRate / 100,
          isAssetByAssetAdvance: isAssetByAssetRate,
          firstLienRate: firstLienRate / 100,
          secondLienRate: secondLienRate / 100,
          mezzRate: mezzanineRate / 100,
          isMinEquity: isMinimumEquity,
          minEquityAmount: minimumEquity,
        },
        );
      if (response.status === 201) {
        clearData();
        setMessage("Facility Created Successfully");
      }
      
    } catch (error) {
      setMessage("There was an error creating the facility.");
    }
  }

  function clearData(){

    setSelectedLender(null);
    setSelectedPortfolio(null);
    setFacilityName("");
    setCommitmentDate("");
    setMaturityDate("");
    setCommitmentAmount("");
    setIsOverallRate(false);
    setMaxAdvanceRate("");
    setIsAssetByAssetRate("");
    setFirstLienRate("");
    setSecondLienRate("");
    setMezzanineRate("");
    setIsMinimumEquity(false);
    setMinimumEquity("");
    setMessage("");
  }

  return (
    <>
      <div className="debt-facility-create">
        Create Debt Facility
      </div>
      <Box component="form" sx={{paddingLeft: "115px"}}>
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
          <div className="row-1-new-debt-facility">
            {/* Textfield which is simply the Facility Name - Stored in */}
            {/* facilityName via setFacilityName */}
            <TextField
              required
              value={facilityName}
              onChange={(event) => setFacilityName(event.target.value)}
              id="facility-name-input"
              label="Facility Name"
              sx={{ m: 1, width: "30ch" }}
            />

            {/* Autocomplete for Lender Name - Stored in */}
            {/* selectedLender via setSelectedLender */}

            <Autocomplete
              disablePortal
              id="autocomplete-lender-name"
              required
              options={lenderData}
              value={selectedLender}
              sx={{ m: 1, width: "30ch" }}
              onChange={(event, newValue) => setSelectedLender(newValue)}
              getOptionLabel={(option) => option.lender_name || ""}
              renderInput={(params) => (
                <TextField {...params} label="Lender Name" />
              )}
            />

            {/* Autocomplete for Portfolio Name - Stored in */}
            {/* selectedPortfolio via setSelectedPortfolio */}

            <Autocomplete
              disablePortal
              id="autocomplete-portfolio-name"
              required
              options={portfolioData}
              value={selectedPortfolio}
              sx={{ m: 1, width: "30ch" }}
              onChange={(event, newValue) => setSelectedPortfolio(newValue)}
              getOptionLabel={(option) => option.portfolio_name || ""}
              renderInput={(params) => (
                <TextField {...params} label="Portfolio Name" />
              )}
            />
          </div>

          <div className="row-2-new-debt-facility">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* Picker for Commitment Date */}
              <DatePicker
                label="Commitment Date"
                sx={{ m: 1, width: "30ch", marginTop: 4 }}
                value={commitmentDate ? dayjs(commitmentDate) : null} // This is needed if date is not yet a valid date or a crash occurs
                onChange={(newDate) => {
                  setCommitmentDate(
                    newDate ? newDate.format("YYYY-MM-DD") : "",
                  ); // if there is anything in new date, set commitment date or else set it to blank
                }}
                slotProps={{
                      
                  textField: {
                    inputProps: { "data-testid": "commitment-date-picker" },
                    helperText: "MM/DD/YYYY",
                  },
                }}
              />

              {/* Picker for Maturity Date */}

              <DatePicker
                label="Maturity Date"
                id="maturity-date-picker"
                sx={{ m: 1, width: "30ch", marginTop: 4 }}
                value={maturityDate ? dayjs(maturityDate) : null} // This is needed if date is not yet a valid date or a crash occurs
                onChange={(newDate) => {
                  setMaturityDate(
                    newDate ? newDate.format("YYYY-MM-DD") : "",
                  ); // if there is anything in new date, set maturity date or else set it to blank
                }}
                slotProps={{
                  textField: {
                    helperText: "MM/DD/YYYY",
                  },
                }}
              />
            </LocalizationProvider>

            {/* Textfield which is Commitment Amount - Stored in */}
            {/* commitmentAmount via setCommitmentAmount */}
            {/* Uses react-number-format integrated with MUI TextField */}
            <NumericFormat
              customInput={TextField}
              id="commitment-amount-field"
              sx={{ m: 1, width: "30ch", marginTop: 4 }}
              required
              value={commitmentAmount}
              onValueChange={(value) => setCommitmentAmount(value.floatValue)}
              label="Commitment Amount"
              thousandSeparator=","
              decimalScale={2}
              fixedDecimalScale
              prefix="$"
            />
          </div>
        </Box>
        <Box
          sx={{
            border: "1px solid",
            borderRadius: 4,
            borderColor: "#c7c7c7ff",
            width: "110ch",
            m: 3,
            padding: 2,
            display: "flex",
          }}
        >
          <Box>
            {/* Toggle for max advance rate */}
            <FormControlLabel
              control={
                <Switch
                  checked={isOverallRate}
                  id="overall-rate-switch"
                  onChange={(e) => setIsOverallRate(e.target.checked)}
                />
              }
              labelPlacement="start"
              label="Overall Rate"
            />
            <FormHelperText>
              Is the facility governed by a maximum advance rate?
            </FormHelperText>
          </Box>
          {/* Input for max advance rate */}

          <NumericFormat
            sx={{ m: 1, width: "30ch",  marginLeft: 6, width: "22ch"}}
            customInput={TextField}
            id="max-advance-rate-field"
            value={maxAdvanceRate}
            onValueChange={(value) => setMaxAdvanceRate(value.floatValue)}
            label="Overall Advance Rate"
            thousandSeparator=","
            decimalScale={6}
            suffix="%"
            fixedDecimalScale
          />
        </Box>
        <Box
          sx={{
            border: "1px solid",
            borderRadius: 4,
            borderColor: "#c7c7c7ff",
            width: "110ch",
            m: 3,
            padding: 2,
            display: "flex"
          }}
        >
          
            {/* Toggle for asset-by-asset rate */}
            <Box>
            <FormControlLabel
              control={
                <Switch
                  id="asset-by-asset-advance-rate-switch"
                  checked={isAssetByAssetRate}
                  onChange={(e) => setIsAssetByAssetRate(e.target.checked)}
                />
              }
              labelPlacement="start"
              label="Asset By Asset Rate"
            />
            <FormHelperText>
              Is the facility governed by asset-by-asset advance rates?
            </FormHelperText>
            </Box>

              <Box>
            {/* Input for first lien rate */}

            <NumericFormat
              customInput={TextField}
              id="first-lien-rate-textfield"
              sx={{ m: 1, width: "20ch",  marginLeft: 3 }}
              value={firstLienRate}
              onValueChange={(value) => setFirstLienRate(value.floatValue)}
              label="First Lien Rate"
              thousandSeparator=","
              decimalScale={6}
              suffix="%"
              fixedDecimalScale
            />

            {/* Input for second lien rate */}

            <NumericFormat
              customInput={TextField}
              id="second-lien-rate-textfield"
              sx={{ m: 1, width: "20ch",  marginLeft: 2 }}
              value={secondLienRate}
              onValueChange={(value) => setSecondLienRate(value.floatValue)}
              label="Second Lien Rate"
              thousandSeparator=","
              decimalScale={6}
              suffix="%"
              fixedDecimalScale
            />

            {/* Input for mezzanine rate */}

            <NumericFormat
              customInput={TextField}
              id="mezzanine-rate-textfield"
              sx={{ m: 1, width: "20ch",  marginLeft: 2 }}
              value={mezzanineRate}
              onValueChange={(value) => setMezzanineRate(value.floatValue)}
              label="Mezzanine Rate"
              thousandSeparator=","
              decimalScale={6}
              suffix="%"
              fixedDecimalScale
            />
     </Box>
        </Box>
        <Box
          sx={{
            border: "1px solid",
            borderRadius: 4,
            borderColor: "#c7c7c7ff",
            width: "110ch",
            m: 3,
            padding: 2,
            display: "flex"
          }}
        >
          <Box>
     
            {/* Toggle for min equity */}
            <FormControlLabel
              control={
                <Switch
                  id="min-equity-switch"
                  checked={isMinimumEquity}
                  onChange={(e) => setIsMinimumEquity(e.target.checked)}
                />
              }
              labelPlacement="start"
              label="Minimum Equity"
            />
            <FormHelperText>
              Is the facility governed by a minimum equity balance?
            </FormHelperText>
</Box>
            {/* Input for min equity amount */}

            <NumericFormat
              customInput={TextField}
              id="min-equity-textfield"
              sx={{marginLeft:"5ch"}}
              value={minimumEquity}
              onValueChange={(value) => setMinimumEquity(value.floatValue)}
              label="Minimum Equity Amount"
              thousandSeparator=","
              decimalScale={2}
              prefix="$"
              fixedDecimalScale
            />
        
        </Box>
        <div>
          <Button 
          variant="contained" 
          onClick={postFacility} 
          sx={{marginLeft: "25px",
            minWidth: "225px",
            minHeight: "50px",
            borderRadius: 2,
            backgroundColor: "#F6AE2D",
            color: "#000000",
            textTransform: "none",
            fontSize:"20px"}}>
            Save
          </Button>

          <Button 
          variant="contained" 
          onClick={clearData} 
          sx={{marginLeft: "25px",
            minWidth: "225px",
            minHeight: "50px",
            borderRadius: 2,
            backgroundColor: "#d4d4d4ff",
            color: "#000000",
            textTransform: "none",
            fontSize:"20px"}}>
            Cancel
          </Button>
        </div>

{/* Displays message below in a success or failure situation */}
        {message &&
        <div className="alertMessage">
          {message}
        </div>
      }
      </Box>
    </>
  );
}

export default DebtFacilityCreate;
