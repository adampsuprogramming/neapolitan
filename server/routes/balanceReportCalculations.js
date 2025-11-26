const express = require("express");
const router = express.Router();
const { getFacilityCollateral, getBalances, getCollateralNames } = require("./rollforwardQueries");

const { getEndOfPeriodBalances } = require("./processBalanceData");
const { getCollateralByPortfolio } = require("./collateralQueryByPortfolio");
const { getIdsAtEndOfPeriod } = require("./processIds");
const { getDebtFacilities } = require("./debtFacilitiesInPortfolio");

router.get("/api/balanceReportCalculations", async (req, res) => {
  const { portfolioId, asOfDate } = req.query;
  const asOfDateObject = new Date(asOfDate + "T00:00:00");

  const trancheBalancesByFacility = {};

  try {
    const debtFacilities = await getDebtFacilities(portfolioId, asOfDateObject);
    const collateralMap = await getCollateralByPortfolio(portfolioId, asOfDateObject);

    for (let i = 0; i < debtFacilities.rows.length; i++) {
      const collateralNames = await getCollateralNames(debtFacilities.rows[i].debt_facility_id);
      const facilityCollateral = await getFacilityCollateral(
        debtFacilities.rows[i].debt_facility_id,
      );
      const collateralBalances = await getBalances(debtFacilities.rows[i].debt_facility_id);
      const allIdsEnd = getIdsAtEndOfPeriod(facilityCollateral, asOfDateObject);
      const endBalances = getEndOfPeriodBalances(allIdsEnd, collateralBalances, asOfDateObject);

      for (let j = 0; j < endBalances.length; j++) {
        const collateral = collateralMap.rows.find(
          (row) => row.collateral_id === endBalances[j].collateralId,
        );
        const name = collateralNames.rows.find(
          (row) => row.collateral_id === endBalances[j].collateralId,
        );
        const trancheIdNumb = collateral?.tranche_id;
        const facilityName = collateral?.debt_facility_name;

        if (!trancheBalancesByFacility[trancheIdNumb]) {
          trancheBalancesByFacility[trancheIdNumb] = {
            trancheId: trancheIdNumb,
            legalName: name.legal_name,
            facilities: {},
          };
        }

        if (!trancheBalancesByFacility[trancheIdNumb].facilities[facilityName]) {
          trancheBalancesByFacility[trancheIdNumb].facilities[facilityName] = 0;
        }

        trancheBalancesByFacility[trancheIdNumb].facilities[facilityName] +=
          endBalances[j].endBalance;
      }
    }

    const result = Object.values(trancheBalancesByFacility);
    
    // Get unique facility names in the data
    const uniqueFaciltiesUnsorted = [];
    for (const item of result) {
      for (const facilityName in item.facilities) {
        if (!uniqueFaciltiesUnsorted.includes(facilityName)) {
          uniqueFaciltiesUnsorted.push(facilityName);
        }
      }
    }
const uniqueFacilties = uniqueFaciltiesUnsorted
      .sort((firstToSort, secondToSort) => firstToSort[0].localeCompare(secondToSort[0]));

    // Create header row of output array, including Tranche Name, Facility Names, and Total Column
    const arrayOutput = [];
    arrayOutput[0] = [];
    arrayOutput[0][0] = "Tranche Name";
    uniqueFacilties.forEach((facility, index) => {
      arrayOutput[0][index + 1] = facility;
    });
    arrayOutput[0][uniqueFacilties.length + 1] = "Total";

    // Populates arrays with balance values that match facilityNames for each Tranche and tracks row totals

    let arrayRow = 1;
    result.forEach((thing) => {
      arrayOutput[arrayRow] = []; // Sets rows as array
      arrayOutput[arrayRow][0] = thing.legalName; // Sets first column as legal name

      let totalColumn = 0; // column total addition set to zero
      for (let i = 1; i < arrayOutput[0].length - 1; i++) {
        /// iterates through facility column excluding first (tranche name) and last (total)
        arrayOutput[arrayRow][i] = 0;

        for (let facilityName in thing.facilities) {
          if (arrayOutput[0][i] === facilityName) {
            totalColumn += thing.facilities[facilityName];
            arrayOutput[arrayRow][i] = thing.facilities[facilityName];
          }
          arrayOutput[arrayRow][i + 1] = totalColumn;
        }
      }
      arrayRow++;
    });

    const arraySize = arrayOutput.length;
    arrayOutput[arraySize] = ["Total"];
    for (let i = 1; i < arrayOutput[0].length; i++) {
      let total = 0;
      for (let j = 1; j < arrayOutput.length - 1; j++) {
        total += arrayOutput[j][i];
      }
      arrayOutput[arraySize][i] = total;
    }

    const dataInArray = arrayOutput
      .slice(1, -1)
      .sort((firstToSort, secondToSort) => firstToSort[0].localeCompare(secondToSort[0]));

    const sortedArrayOutput = [arrayOutput[0], ...dataInArray, arrayOutput[arrayOutput.length - 1]];

    res.status(200).json(sortedArrayOutput);
  } catch {
    res.status(500).send("Query Has Failed");
  }
});

module.exports = router;
