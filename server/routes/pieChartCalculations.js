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
  asOfDateObject = new Date(asOfDate + "T00:00:00");
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
      const internalValue = intValRow?.internal_val || null;
      const endBalance =
        endBalances.find((row) => row.collateralId === allIdsEnd[i].collateralId) || null;
      const collateralName =
        collateralNames.rows.find((row) => row.collateral_id === allIdsEnd[i].collateralId) || null;
      if (bankMetricEndRow) {
        bankValuation = bankMetricEndRow.valuation;
      } else {
        bankValuation = loanApprovalRow?.approved_valuation;
      }
      const pieChartDataRow =
        pieChartData.rows.find((row) => row.collateral_id === allIdsEnd[i].collateralId) || null;
      const applicableValuation =
        internalValue !== null ? Math.min(bankValuation, internalValue) : bankValuation;

      values.push({
        collateralId: allIdsEnd[i].collateralId,
        collateralName: collateralName?.legal_name || null,
        valuationPercentage: applicableValuation,
        outstandingBalance: endBalance.endBalance,
        valuation: applicableValuation * endBalance.endBalance,
        lienType: pieChartDataRow.lien_type,
        corpHQId: pieChartDataRow.corporate_hq_id,
        corpHQRegionName: pieChartDataRow.hq_region_name,
        revRegionID: pieChartDataRow.revenue_geography_id,
        revRegionName: pieChartDataRow.rev_region_name,
        naicsCode: pieChartDataRow.naics_subsector_id,
        naicsSubsector: pieChartDataRow.naics_subsector_name,
        isPublic: pieChartDataRow.is_public ? "Public" : "Private",
      });
    }

    res.json(values);
  } catch {
    res.status(500).send("Payments Query Has Failed)");
  }
});

module.exports = router;
