const express = require("express");
const router = express.Router();
const {
  getFacilityCollateral,
  getBalances,
  getBankMetrics,
  getLoanApprovalInfo,
  getInternalValInfo,
  getCollateralNames,
} = require("./rollforwardQueries");

const { getIdsAtEndOfPeriod } = require("./processIds");
const { getEndOfPeriodBalances } = require("./processBalanceData");
const { getPieChartData } = require("./pieChartQuery");

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
    const collateralNames = await getCollateralNames(debtFacilityId);
    const pieChartData = await getPieChartData(debtFacilityId);

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
      const collateralName =
        collateralNames.rows.find((row) => row.collateral_id === allIdsEnd[i].collateralId) || null;
      if (bankMetricEndRow) {
        bankValuation = bankMetricEndRow.valuation;
      } else {
        bankValuation = loanApprovalRow.approved_valuation;
      }
      const pieChartDataRow =
        pieChartData.rows.find((row) => row.collateral_id === allIdsEnd[i].collateralId) || null;

      values.push({
        collateralId: allIdsEnd[i].collateralId,
        collateralName: collateralName.legal_name,
        valuationPercentage: Math.min(bankValuation, internalValue),
        outstandingBalance: endBalance.endBalance,
        valuation: Math.min(bankValuation, internalValue) * endBalance.endBalance,
        lienType: pieChartDataRow.lien_type,
        corpHQId: pieChartDataRow.corporate_hq_id,
        corpHQRegionName: pieChartDataRow.hq_region_name,
        revRegionID: pieChartDataRow.revenue_geography_id,
        revRegionName: pieChartDataRow.rev_region_name,
        naicsCode: pieChartDataRow.naics_subsector_id,
        naicsSubsector: pieChartDataRow.naics_subsector_name,
        isPublic: pieChartDataRow.is_public,
      });
    }

    for (let i = 0; i < values.length; i++) {
      console.log("Collateral ID: " + values[i].collateralId);
      console.log("Collateral Name: " + values[i].collateralName);
      console.log("Valuation %: " + values[i].valuationPercentage);
      console.log("Outstanding Balance: " + values[i].outstandingBalance);
      console.log("Valuation: " + values[i].valuation);
      console.log("Lien Type: " + values[i].lienType);
      console.log("Corp HQ Id: " + values[i].corpHQId);
      console.log("Corp HQ Region Name: " + values[i].corpHQRegionName);
      console.log("Corp Revenue Region ID: " + values[i].revRegionID);
      console.log("Corp Revenue Region Name: " + values[i].revRegionName);
      console.log("NAICS Subsector ID: " + values[i].naicsCode);
      console.log("NAICS Subsector Name: " + values[i].naicsSubsector);
      console.log("Public: " + values[i].isPublic);
    }

    res.json(values);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
