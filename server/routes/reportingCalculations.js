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

router.get("/api/reportingCalculations", async (req, res) => {
  const { debtFacilityId, startDate, endDate, isFundsFlow, currentOutstandings, intExpDue } =
    req.query;
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
        balanceBeg: Math.round(rBalanceBeg) || 0,
        collAdded: Math.round(rCollAdded) || 0,
        collRemoved: Math.round(rCollRemoved) || 0,
        principalRec: Math.round(rPrincipalRec) || 0,
        balanceEnd: Math.round(rBalanceEnd) || 0,
        begValue: Math.round(rBegValue) || 0,
        chgDueToAdd: Math.round(rChgDueToAdd) || 0,
        chgDueToRepay: Math.round(rChgDueToRepay) || 0,
        chgDueToInternalVal: Math.round(rChgDueToInternalVal) || 0,
        addlChgBankVal: Math.round(rAddlChgBankVal) || 0,
        endValue: Math.round(rEndValue) || 0,
        begLevAvail: Math.round(rBegLevAvail) || 0,
        levAvailChgDueToAddition: Math.round(rLevAvailChgDueToAddition) || 0,
        levAvailChgDueToRepay: Math.round(rLevAvailChgDueToRepay) || 0,
        levAvailChgDueToVal: Math.round(rLevAvailChgDueToVal) || 0,
        levAvailChgDueToAdvRate: Math.round(rLevAvailChgDueToAdvRate) || 0,
        endLevAvail: Math.round(rEndLevAvail) || 0,
        bankValBeg: parseFloat(rBankValBeg) || 0,
        bankValEnd: parseFloat(rBankValEnd) || 0,
        internalValBeg: parseFloat(rInternalValBeg) || 0,
        internalValEnd: parseFloat(rInternalValEnd) || 0,
        advanceRateBeg: parseFloat(rAdvanceRateBeg) || 0,
        advanceRateEnd: parseFloat(rAdvanceRateEnd) || 0,
        intRec: rIntRec || 0,
      });
    }

    let totalEndLevAvail = 0;
    let totalPrincRec = 0;
    let totalIntRec = 0;

    for (let i = 0; i < report.length; i++) {
      totalEndLevAvail = totalEndLevAvail + report[i].endLevAvail;
      totalPrincRec = totalPrincRec + report[i].principalRec;
      totalIntRec = totalIntRec + report[i].intRec;
    }

    const currAvail = totalEndLevAvail - currentOutstandings;
    const totalDist = totalPrincRec + totalIntRec;
    let dueToBank;

    if (currAvail < 0) {
      dueToBank = intExpDue - currAvail;
    } else {
      dueToBank = intExpDue;
    }

    report.sort((a, b) => a.collateralName.localeCompare(b.collateralName));

    returnPackage = {
      collateralData: report,
      fundsFlowData: {
        currFacBal: currentOutstandings,
        endLevAvail: totalEndLevAvail,
        currAvail: currAvail,
        intExp: -intExpDue,
        principalRec: totalPrincRec,
        intRec: totalIntRec,
        totalDist: totalDist,
        dueToBank: dueToBank,
        dueToClient: totalDist - dueToBank,
      },
    };

    res.json(returnPackage);
  } catch (err) {
    console.error(err);
    res.status(500).send("Generating Report Calculations Failed");
  }
});

module.exports = router;
