const express = require("express");
const router = express.Router();
const {
  getFacilityCollateral,
  getBalances,
  getBankMetrics,
  getLoanApprovalInfo,
  getInternalValInfo,
  //getCollateralNames,
} = require("./rollforwardQueries");

const { getIdsAtEndOfPeriod } = require("./processIds");

const { getEndOfPeriodBalances } = require("./processBalanceData");

let asOfDateObject;

router.get("/api/pieChartCalculations", async (req, res) => {
  const { debtFacilityId, asOfDate } = req.query;
  console.log(asOfDate);
  asOfDateObject = new Date(asOfDate + "T00:00:00");
  console.log(asOfDateObject);
  try {
    const facilityCollateral = await getFacilityCollateral(debtFacilityId);
    const collateralBalances = await getBalances(debtFacilityId);
    const allIdsEnd = getIdsAtEndOfPeriod(facilityCollateral, asOfDateObject);
    const endBalances = getEndOfPeriodBalances(allIdsEnd, collateralBalances, asOfDateObject);
    const loanApprovalValuations = await getLoanApprovalInfo(debtFacilityId);
    const bankMetricsEnd = await getBankMetrics(debtFacilityId, asOfDateObject);
    const intValEnd = await getInternalValInfo(debtFacilityId, asOfDateObject);
    let values = [];

    for (let i = 0; i < allIdsEnd.length; i++) {
      let bankValuation;

      const bankMetricEndRow =
        bankMetricsEnd.rows.find((row) => row.collateral_id === allIdsEnd[i].collateralId) || null;
      const loanApprovalRow =
        loanApprovalValuations.rows.find(
          (row) => row.collateral_id === allIdsEnd[i].collateralId,
        ) || null;
      const intValRow =
        intValEnd.rows.find((row) => row.collateral_id === allIdsEnd[i].collateralId) || null;
      const internalValue = intValRow.internal_val;
      const endBalance =
        endBalances.find((row) => row.collateralId === allIdsEnd[i].collateralId) || null;

      if (bankMetricEndRow) {
        bankValuation = bankMetricEndRow.valuation;
      } else {
        bankValuation = loanApprovalRow.approved_valuation;
      }
      values.push({
        collateralId: allIdsEnd[i].collateralId,
        valuationPercentage: Math.min(bankValuation, internalValue),
        outstandingBalance: endBalance.endBalance,
        valuation: Math.min(bankValuation, internalValue) * endBalance.endBalance,
      });
    }

    for (let i = 0; i < values.length; i++) {
      console.log("Collateral ID: " + values[i].collateralId);
      console.log("Valuation %: " + values[i].valuationPercentage);
      console.log("Outstanding Balance: " + values[i].outstandingBalance);
      console.log("Valuation: " + values[i].valuation);
    }

    console.log("TEST");
    res.status(200).send("TEST");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
