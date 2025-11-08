import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import FormHelperText from "@mui/material/FormHelperText";

function BorrowerCreate() {
  const [regionData, setRegionData] = useState([]); // Hold results of getRegionData below
  const [selectedCorpHQRegion, setSelectedCorpHQRegion] = useState(null); // Which corporate region was selected?
  const [selectedCorpHQId, setSelectedCorpHQId] = useState(null); // What is primary key for corporate region
  const [selectedRevRegion, setSelectedRevRegion] = useState(null); // Which revenue region was selected?
  const [selectedRevId, setSelectedRevId] = useState(null); // What is primary key for revenue region
  const [naicsSubSectorData, setNaicsSubSectorData] = useState([]); // Hold subsector data from API call
  const [selectedNaicsSubsector, setSelectedNaicsSubsector] = useState(null); // Which subsector was selected?
  const [selectedNaicsSubsectorId, setSelectedNaicsSubsectorId] = useState(null); // What is primary key for subsector?
  const [legalName, setLegalName] = useState(""); // After user enters borrower legal name, it is set here via an onChange
  const [shortName, setShortName] = useState(""); // After user enters borrower nick name, it is set here via an onChange
  const [isPublicBorrower, setIsPublicBorrower] = useState(false); // Sets based on user interaction with toggle switch
  const [tickerSymbol, setTickerSymbol] = useState(""); // What is the ticker symbol?

  const [message, setMessage] = useState("");

  // this useEffect loads up the region data to populate the dropdowns for Corporate HQ and
  // Primary Geography on page load

  useEffect(() => {
    async function getRegionData() {
      try {
        const fullInfoResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/regionquery`,
        );
        setRegionData(fullInfoResponse.data);
      } catch (error) {
        console.error("Error fetching: ", error);
      }
    }

    getRegionData();
  }, []);

  // this useEffect loads up the NAICS subsector data to populate the dropdown
  // on page load.

  useEffect(() => {
    async function getSubSectorData() {
      try {
        const fullInfoResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/subsectorquery`,
        );
        setNaicsSubSectorData(fullInfoResponse.data);
      } catch (error) {
        console.error("Error fetching: ", error);
      }
    }

    getSubSectorData();
  }, []);

  // this useEffect gets the related region id number when the HQ Region
  // is selected.  The region id is later sent back to the server

  useEffect(() => {
    if (!selectedCorpHQRegion) return;
    setSelectedCorpHQId(selectedCorpHQRegion.region_id);
  }, [selectedCorpHQRegion]);

  // this useEffect gets the related region id number when the revenue region
  // is selected.  The region id is later sent back to the server

  useEffect(() => {
    if (!selectedRevRegion) return;
    setSelectedRevId(selectedRevRegion.region_id);
  }, [selectedRevRegion]);

  // this useEffect gets the naics subsector id number when the subsector
  // is selected.  The subsector id is later sent back to the server

  useEffect(() => {
    if (!selectedNaicsSubsector) return;
    setSelectedNaicsSubsectorId(selectedNaicsSubsector.naics_subsector_id);
  }, [selectedNaicsSubsector]);

  // The following axios post function is run when the user clicks save

  async function postBorrower() {
    if (!legalName || !selectedCorpHQId || !selectedCorpHQRegion || !selectedNaicsSubsector) {
      setMessage("Not Saved - Please fill out all required fields - denoted by *");
      return;
    }
    if (isPublicBorrower && !tickerSymbol) {
      setMessage("Not Saved - If borrower is public, a ticker symbol must be entered.");
      return;
    }
    if (!isPublicBorrower && tickerSymbol) {
      setMessage(
        "Not Saved - A ticker symbol has been entered, but borrower has not be listed as public.",
      );
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/createborrower`, {
        legalName: legalName,
        shortName: shortName,
        corporateHqId: selectedCorpHQId,
        revenueGeographyId: selectedRevId,
        naicsSubsectorId: selectedNaicsSubsectorId,
        isPublic: isPublicBorrower,
        tickerSymbol: tickerSymbol,
      });
      if (response.status === 201) {
        clearData();
        setMessage("Borrower Created Successfully");
      }
    } catch {
      setMessage("There was an error creating the borrower.");
    }
  }

  // The following function is run when the user clicks clear

  function clearData() {
    setLegalName("");
    setShortName("");
    setSelectedCorpHQRegion(null);
    setSelectedRevRegion(null);
    setSelectedNaicsSubsector(null);
    setIsPublicBorrower(false);
    setTickerSymbol("");
    setMessage("");
  }

  return (
    <>
      <div className="borrower-create">Create Borrower</div>
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
          <div className="row-1-new-debt-facility">
            <TextField
              required
              value={legalName}
              onChange={(event) => setLegalName(event.target.value)}
              id="legal-name-input"
              label="Borrower Name"
              sx={{ m: 1, width: "35ch" }}
            />

            <TextField
              value={shortName}
              onChange={(event) => setShortName(event.target.value)}
              id="short-name-input"
              label="Borrower Nickname"
              sx={{ m: 1, width: "30ch" }}
            />

            {/* Autocomplete for Lender Name - Stored in */}
            {/* selectedLender via setSelectedLender */}

            <Autocomplete
              disablePortal
              id="autocomplete-corporate-hq"
              required
              options={regionData}
              value={selectedCorpHQRegion}
              sx={{ m: 1, width: "35ch" }}
              onChange={(event, newValue) => setSelectedCorpHQRegion(newValue)}
              getOptionLabel={(option) => option.region_name || ""}
              renderInput={(params) => (
                <TextField {...params} label="Corporate Headquarters" required />
              )}
            />
          </div>

          <div className="row-2-new-debt-facility">
            <Autocomplete
              disablePortal
              id="autocomplete-rev-region"
              required
              options={regionData}
              value={selectedRevRegion}
              sx={{ m: 1, width: "35ch", marginTop: 4 }}
              onChange={(event, newValue) => setSelectedRevRegion(newValue)}
              getOptionLabel={(option) => option.region_name || ""}
              renderInput={(params) => (
                <TextField {...params} label="Primary Geography (Revenue) " required />
              )}
            />
            <Autocomplete
              disablePortal
              id="autocomplete-naics-subsector"
              required
              options={naicsSubSectorData}
              value={selectedNaicsSubsector}
              sx={{ m: 1, width: "60ch", marginTop: 4 }}
              onChange={(event, newValue) => setSelectedNaicsSubsector(newValue)}
              getOptionLabel={(option) =>
                option
                  ? `${option.naics_subsector_id ?? ""} - ${option.naics_subsector_name ?? ""}`
                  : ""
              }
              renderInput={(params) => (
                <TextField {...params} label="NAICS Subsector Code" required />
              )}
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
            <FormControlLabel
              control={
                <Switch
                  checked={isPublicBorrower}
                  id="public-borrower-switch"
                  onChange={(e) => setIsPublicBorrower(e.target.checked)}
                />
              }
              labelPlacement="start"
              label="Public Borrower"
            />
            <FormHelperText>Is the borrower a publicly traded company?</FormHelperText>
          </Box>

          <TextField
            sx={{ m: 1, marginLeft: 6, width: "22ch" }}
            required={isPublicBorrower}
            disabled={!isPublicBorrower}
            id="ticker-symbol"
            value={tickerSymbol}
            onChange={(event) => setTickerSymbol(event.target.value)}
            label="Ticker Symbol"
          />
        </Box>

        <div>
          <Button
            variant="contained"
            onClick={postBorrower}
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

export default BorrowerCreate;
