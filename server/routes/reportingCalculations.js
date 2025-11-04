const express = require("express");
const router = express.Router();
const {
  getFacilityCollateral,
  getBalances,
  getBankMetrics,
  getFacilityMetrics,
  getLienType,
  getLoanApprovalInfo,
  getInternalValInfo,
  getIntValForCollateral,
  getPaymentsTimePeriod,
  getCollateralNames,
} = require("../routes/rollforwardQueries");

const {
  getIdsOfAdditions,
  getIdsOfRemoved,
  getIdsAtStartOfPeriod,
  getIdsAtEndOfPeriod,
  getEveryIdInPeriod,
} = require("../routes/processIds");

const {
  getFacilityBalanceAdditions,
  getFacilityBalanceRemovals,
  getStartOfPeriodBalances,
  getEndOfPeriodBalances,
  getBegAndEndOustandings,
} = require("../routes/processBalanceData");

const { getBegAndEndAdvRates } = require("../routes/processAdvanceRates");

const { getBegAndEndBankValuations } = require("./processBankValuations");

const { getBegAndEndInternalValuations } = require("./processInternalValuations");

const { getPaymentInfo } = require("./processPayments");

let startDateObject;
let endDateObject;
let facilityCollateral;
let collateralBalances;

router.get("/api/reportingCalculations", async (req, res) => {
  const { debtFacilityId, startDate, endDate } = req.query;

  startDateObject = new Date(startDate + "T00:00:00");
  endDateObject = new Date(endDate + "T00:00:00");

  try {
    const facilityCollateral = await getFacilityCollateral(debtFacilityId);
    const collateralBalances = await getBalances(debtFacilityId);
    const bankMetricsStart = await getBankMetrics(debtFacilityId, startDate);
    const bankMetricsEnd = await getBankMetrics(debtFacilityId, endDate);
    const facilityMetricsStart = await getFacilityMetrics(debtFacilityId, startDate);
    const facilityMetricsEnd = await getFacilityMetrics(debtFacilityId, endDate);
    const collateralLien = await getLienType(debtFacilityId);
    const loanApprovalResults = await getLoanApprovalInfo(debtFacilityId);
    const intValStart = await getInternalValInfo(debtFacilityId, startDate);
    const intValEnd = await getInternalValInfo(debtFacilityId, endDate);
    const paymentsResults = await getPaymentsTimePeriod(debtFacilityId, startDate, endDate);
    const collateralNames = await getCollateralNames(debtFacilityId);

    const addedIds = getIdsOfAdditions(facilityCollateral);

    const additions = getFacilityBalanceAdditions(
      collateralBalances,
      addedIds,
      startDateObject,
      endDateObject,
    );

    // The following populates removedIds[] with an array of id's and removal dates for
    // the collateral in the facility (all collateral that has been removed, not filtered by date)

    const removedIds = getIdsOfRemoved(facilityCollateral);
    const removals = getFacilityBalanceRemovals(
      collateralBalances,
      removedIds,
      startDateObject,
      endDateObject,
    );

    // Populate allIds with IDs that existed at start of period only
    const allIdsStart = getIdsAtStartOfPeriod(facilityCollateral, startDateObject);
    const startBalances = getStartOfPeriodBalances(
      allIdsStart,
      collateralBalances,
      startDateObject,
    );

    // Populate allIds with IDs that existed at end of period only
    const allIdsEnd = getIdsAtEndOfPeriod(facilityCollateral, endDateObject);
    const endBalances = getEndOfPeriodBalances(allIdsEnd, collateralBalances, endDateObject);
    const everyIdInPeriod = getEveryIdInPeriod(facilityCollateral, startDateObject, endDateObject);
    const outstandingBal = getBegAndEndOustandings(startBalances, endBalances);

    // **************************************** Advance Rates **************************************

    // Query bankmetrics to populate advance rates
    const advanceRates = getBegAndEndAdvRates(
      allIdsStart,
      addedIds,
      allIdsEnd,
      collateralLien,
      bankMetricsStart,
      bankMetricsEnd,
      loanApprovalResults,
      facilityMetricsStart,
      facilityMetricsEnd,
    );

    // **************************************** bank valuations **************************************
    const bankValuations = getBegAndEndBankValuations(
      allIdsStart,
      allIdsEnd,
      additions,
      bankMetricsStart,
      bankMetricsEnd,
      loanApprovalResults,
    );

    // **************************************** internal valuations **************************************
    const internalValuations = await getBegAndEndInternalValuations(
      allIdsStart,
      allIdsEnd,
      additions,
      intValStart,
      intValEnd,
    );

    // **************************************** payments **************************************
    const payments = getPaymentInfo(everyIdInPeriod, paymentsResults);

    // Calculations

    let report = [];
    let rCollateralId;
    let rCollateralName;
    let rBalanceBeg;
    let rCollAdded;
    let rCollRemoved;
    let rPrincipalRec;
    let rBalanceEnd;
    let rBegValue;
    let rChgDueToAdd;
    let rChgDueToRepay;
    let rChgDueToInternalVal;
    let rAddlChgBankVal;
    let rEndValue;
    let rBegLevAvail;
    let rLevAvailChgDueToAddition;
    let rLevAvailChgDueToRepay;
    let rLevAvailChgDueToVal;
    let rLevAvailChgDueToAdvRate;
    let rEndLevAvail;
    let rBankValBeg;
    let rBankValEnd;
    let rInternalValBeg;
    let rInternalValEnd;
    let rAdvanceRateBeg;
    let rAdvanceRateEnd;
    let rIntRec;

    for (let i = 0; i < everyIdInPeriod.length; i++) {
      rCollateralId = null;
      rCollateralName = null;
      rBalanceBeg = null;
      rCollAdded = null;
      rCollRemoved = null;
      rPrincipalRec = null;
      rBalanceEnd = null;
      rBegValue = null;
      rChgDueToAdd = null;
      rChgDueToRepay = null;
      rChgDueToInternalVal = null;
      rAddlChgBankVal = null;
      rEndValue = null;
      rBegLevAvail = null;
      rLevAvailChgDueToAddition = null;
      rLevAvailChgDueToRepay = null;
      rLevAvailChgDueToVal = null;
      rLevAvailChgDueToAdvRate = null;
      rEndLevAvail = null;
      rBankValBeg = null;
      rBankValEnd = null;
      rInternalValBeg = null;
      rInternalValEnd = null;
      rAdvanceRateBeg = null;
      rAdvanceRateEnd = null;
      rIntRec = null;

      // populate collateral ids and names
      for (let j = 0; j < collateralNames.rows.length; j++) {
        if (collateralNames.rows[j].collateral_id === everyIdInPeriod[i].id) {
          rCollateralId = collateralNames.rows[j].collateral_id;
          rCollateralName = collateralNames.rows[j].legal_name;
        }
      }

      // populate amount added
      for (let j = 0; j < additions.length; j++) {
        if (additions[j].collateralId === everyIdInPeriod[i].id) {
          rCollAdded = additions[j].amtAdded;
        }
      }

      // populate amount removed
      for (let j = 0; j < removals.length; j++) {
        if (removals[j].collateralId === everyIdInPeriod[i].id) {
          rCollRemoved = removals[j].amtRemoved;
        }
      }

      // populate balances at beginning and end
      for (let j = 0; j < outstandingBal.length; j++) {
        if (outstandingBal[j].collateralId === everyIdInPeriod[i].id) {
          rBalanceBeg = outstandingBal[j].balanceBeg;
          rBalanceEnd = outstandingBal[j].balanceEnd;
        }
      }

      // populate principal and interest received
      for (let j = 0; j < payments.length; j++) {
        if (payments[j].collateralId === everyIdInPeriod[i].id) {
          rPrincipalRec = payments[j].principalRec;
          rIntRec = payments[j].interestRec;
        }
      }

      // populate internal valuations
      for (let j = 0; j < internalValuations.length; j++) {
        if (internalValuations[j].collateralId === everyIdInPeriod[i].id) {
          rInternalValBeg = internalValuations[j].internalValBeg;
          rInternalValEnd = internalValuations[j].internalValEnd;
        }
      }

      // populate bank valuations
      for (let j = 0; j < bankValuations.length; j++) {
        if (bankValuations[j].collateralId === everyIdInPeriod[i].id) {
          rBankValBeg = bankValuations[j].bankValBeg;
          rBankValEnd = bankValuations[j].bankValEnd;
        }
      }

      // populate bank advance rates
      for (let j = 0; j < advanceRates.length; j++) {
        if (advanceRates[j].collateralId === everyIdInPeriod[i].id) {
          rAdvanceRateBeg = advanceRates[j].advanceRateBeg;
          rAdvanceRateEnd = advanceRates[j].advanceRateEnd;
        }
      }

      rBegValue = rBalanceBeg * Math.min(rBankValBeg, rInternalValBeg);

      rChgDueToAdd = rCollAdded * rBankValBeg;

      rChgDueToRepay = -(rCollRemoved + rPrincipalRec) * Math.min(rBankValBeg, rInternalValBeg);

      rChgDueToInternalVal =
        rBalanceEnd * (rInternalValEnd - Math.min(rBankValBeg, rInternalValBeg));

      if (
        (rBankValEnd - rBankValBeg) * rBalanceEnd <
        (rInternalValEnd - Math.min(rInternalValBeg, rBankValBeg)) * rBalanceEnd
      ) {
        rAddlChgBankVal =
          (rBankValEnd - rBankValBeg) * rBalanceEnd -
          (rInternalValEnd - Math.min(rInternalValBeg, rBankValBeg)) * rBalanceEnd;
      } else {
        rAddlChgBankVal = 0;
      }

      rEndValue = Math.min(rInternalValEnd, rBankValEnd) * rBalanceEnd;

      rBegLevAvail = rBegValue * rAdvanceRateBeg;

      rLevAvailChgDueToAddition = rChgDueToAdd * rAdvanceRateBeg;

      rLevAvailChgDueToRepay = rChgDueToRepay * rAdvanceRateBeg;

      rLevAvailChgDueToVal = (rChgDueToInternalVal + rAddlChgBankVal) * rAdvanceRateBeg;

      rLevAvailChgDueToAdvRate = -(
        rBegLevAvail +
        rLevAvailChgDueToAddition +
        rLevAvailChgDueToRepay +
        rLevAvailChgDueToVal -
        rEndValue * rAdvanceRateEnd
      );

      rEndLevAvail = rEndValue * rAdvanceRateEnd;

      // Add them to the final array
      report.push({
        collateralId: rCollateralId || null,
        collateralName: rCollateralName || null,
        balanceBeg: rBalanceBeg || 0,
        collAdded: rCollAdded || 0,
        collRemoved: rCollRemoved || 0,
        principalRec: rPrincipalRec || 0,
        balanceEnd: rBalanceEnd || 0,
        begValue: rBegValue || 0,
        chgDueToAdd: rChgDueToAdd || 0,
        chgDueToRepay: rChgDueToRepay || 0,
        chgDueToInternalVal: rChgDueToInternalVal || 0,
        addlChgBankVal: rAddlChgBankVal || 0,
        endValue: rEndValue || 0,
        begLevAvail: rBegLevAvail || 0,
        levAvailChgDueToAddition: rLevAvailChgDueToAddition || 0,
        levAvailChgDueToRepay: rLevAvailChgDueToRepay || 0,
        levAvailChgDueToVal: rLevAvailChgDueToVal || 0,
        levAvailChgDueToAdvRate: rLevAvailChgDueToAdvRate || 0,
        endLevAvail: rEndLevAvail || 0,
        bankValBeg: parseFloat(rBankValBeg) || null,
        bankValEnd: parseFloat(rBankValEnd) || null,
        internalValBeg: parseFloat(rInternalValBeg) || null,
        internalValEnd: parseFloat(rInternalValEnd) || null,
        advanceRateBeg: parseFloat(rAdvanceRateBeg) || null,
        advanceRateEnd: parseFloat(rAdvanceRateEnd) || null,
        intRec: rIntRec || 0,
      });
    }

    returnPackage = {
      collateralData: report,
      fundsFlowData: {
        currFacBal: 32000000.0,
        endLevAvail: 31215700.0,
        currAvail: -784300.0,
        intExp: -125458.47,
        principalRec: 3050000.0,
        intRec: 754488.45,
        totalDist: 3804488.45,
        dueToBank: 909758.47,
        dueToClient: 2894729.9800000004,
      },
    };

    res.json(returnPackage);
  } catch (err) {
    console.error(err);
    res.status(500).send("Generating Report Calculations Failed");
  }
});

module.exports = router;
