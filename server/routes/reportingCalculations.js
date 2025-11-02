const express = require("express");
const router = express.Router();
const pool = require("../db");

const collateralQuery = `
select 
    inclusion_date, removed_date, collateral_id, tranche_id, loan_approval_id
    from collateral
    where debt_facility_id = $1
`;

const balancesQuery = `
select *
from collateral_balance cb
left join collateral c
	on c.collateral_id = cb.collateral_id
where c.debt_facility_id = $1
`;

// Query to get advance rates in effect for given facility_id $1 and at given date $2
const facilityQuery = `
SELECT d.portfolio_id, d.lender_id, d.debt_facility_id, dfo.start_date, dfo.end_date, dfo.is_overall_rate, dfo.overall_rate, dfo.is_first_lien_advance_rate, dfo.first_lien_advance_rate, 
dfo.is_second_lien_advance_rate, dfo.second_lien_advance_rate, dfo.is_mezzanine_advance_rate, dfo.mezzanine_advance_rate
FROM public.debt_facilities d
left join debt_facility_balances dfb
	on dfb.debt_facility_id  = d.debt_facility_id 
left join debt_facility_options dfo
	on dfo.debt_facility_id  = d.debt_facility_id 
WHERE d.debt_facility_id=$1 and dfo.start_date<=$2 and (dfo.end_date>$2 OR dfo.end_date IS NULL)`;

// Query to get bank advance rates and valuations in effect for given facility_id $1

const bankMetricsQuery = `SELECT * FROM bank_metrics bm
left join collateral c
	on c.collateral_id = bm.collateral_id
left join debt_facilities df
	on c.debt_facility_id = df.debt_facility_id
where df.debt_facility_id = $1 and bm.start_date<=$2 and (bm.end_date>$2 OR bm.end_date IS NULL)`;

// Query to get all internal valuations for given facility_id $1
const intValQuery = `
SELECT c.collateral_id, lm.start_date, lm.end_date, lm.internal_val FROM public.loan_metrics lm
left join loan_tranches lt
	on lm.tranche_id  = lt.tranche_id
left join collateral c
	on c.tranche_id = lt.tranche_id
left join debt_facilities df
	on c.debt_facility_id = df.debt_facility_id
WHERE df.debt_facility_id = $1 and lm.start_date<=$2 and (lm.end_date>$2 OR lm.end_date IS NULL)`;

const lienTypeQuery = `SELECT c.collateral_id, lt.lien_Type FROM public.loan_metrics lm
left join loan_tranches lt
	on lm.tranche_id  = lt.tranche_id
left join collateral c
	on c.tranche_id = lt.tranche_id
left join debt_facilities df
	on c.debt_facility_id = df.debt_facility_id
WHERE df.debt_facility_id = $1`;

const paymentQuery = `SELECT * FROM public.payments p
left join collateral c
	on c.collateral_id  = p.collateral_id
left join debt_facilities df
    on df.debt_facility_id = c.debt_facility_id
where df.debt_facility_id = $1 and p.payment_date >= $2 and p.payment_date <= $3
ORDER BY payments_id ASC `;

let startDateObject;
let endDateObject;
let facilityCollateral;

router.get("/api/reportingCalculations", async (req, res) => {
  const { debtFacilityId, startDate, endDate } = req.query;

  startDateObject = new Date(startDate);
  endDateObject = new Date(endDate);

  // Populate facilityCollateral with query that houses entirety
  // of collateral record but only for debtFacilityid. Note that
  // this is not filtered for time interval at all
  try {
    facilityCollateral = await pool.query(collateralQuery, [debtFacilityId]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Facility collateral query failed");
  }

  try {
    // Populate collateralBalances with query that houses entirety
    // of collateral_balances record but only for debtFacilityid. Note
    // that this is not filtered for time interval at all
    const collateralBalances = await pool.query(balancesQuery, [
      debtFacilityId,
    ]);

    // The following populates addedIds[] with an array of id's and added dates for
    // the collateral in the facility (all collateral, not filtered by date)

    let addedIds = [];
    for (let i = 0; i < facilityCollateral.rows.length; i++) {
      if (facilityCollateral.rows[i].inclusion_date) {
        addedIds.push({
          id: facilityCollateral.rows[i].collateral_id,
          addedDate: facilityCollateral.rows[i].inclusion_date,
        });
      }
    }

    let additions = [];

    // Loops through collateral balance rows and additions to look for the collateral
    // added and the balance at addition.  Note that this DOES account for date added
    // in the comparison, so additions is the date specific array

    for (let i = 0; i < collateralBalances.rows.length; i++) {
      for (let j = 0; j < addedIds.length; j++) {
        if (
          collateralBalances.rows[i].collateral_id === addedIds[j].id &&
          collateralBalances.rows[i].start_date.toISOString() ===
            addedIds[j].addedDate.toISOString() &&
          addedIds[j].addedDate >= startDateObject &&
          addedIds[j].addedDate <= endDateObject
        ) {
          additions.push({
            collateralId: collateralBalances.rows[i].collateral_id,
            addedDate: collateralBalances.rows[i].start_date,
            amtAdded: collateralBalances.rows[i].outstanding_amount,
          });
        }
      }
    }

    console.log("additions:");
    for (let i = 0; i < additions.length; i++) {
      console.log(additions[i]);
    }

    // The following populates removedIds[] with an array of id's and removal dates for
    // the collateral in the facility (all collateral that has been removed, not filtered by date)

    let removedIds = [];
    for (let i = 0; i < facilityCollateral.rows.length; i++) {
      if (facilityCollateral.rows[i].removed_date) {
        removedIds.push({
          id: facilityCollateral.rows[i].collateral_id,
          removalDate: facilityCollateral.rows[i].removed_date,
        });
      }
    }
    let removals = [];

    // Loops through collateral balance rows and removals to look for the collateral
    // removed and the balance at removal.  Note that this DOES account for date added
    // in the comparison, so removals is the date specific array

    for (let i = 0; i < collateralBalances.rows.length; i++) {
      for (let j = 0; j < removedIds.length; j++) {
        if (
          collateralBalances.rows[i].collateral_id === removedIds[j].id &&
          collateralBalances.rows[i].end_date.toISOString() ===
            removedIds[j].removalDate.toISOString() &&
          removedIds[j].removalDate >= startDateObject &&
          removedIds[j].removalDate <= endDateObject
        ) {
          removals.push({
            collateralId: collateralBalances.rows[i].collateral_id,
            removalDate: collateralBalances.rows[i].end_date,
            amtRemoved: collateralBalances.rows[i].outstanding_amount,
          });
        }
      }
    }
    console.log("removals:");
    for (let i = 0; i < removals.length; i++) {
      console.log(removals[i]);
    }

    // Populate allIds with IDs that existed at start of period only
    let allIdsStart = [];
    for (let i = 0; i < facilityCollateral.rows.length; i++) {
      if (facilityCollateral.rows[i].inclusion_date <= startDateObject) {
        allIdsStart.push(facilityCollateral.rows[i].collateral_id);
      }
    }

    let startBalances = [];

    for (let i = 0; i < allIdsStart.length; i++) {
      let earliestDate = null;
      let earliestAmount = 0;
      for (let j = 0; j < collateralBalances.rows.length; j++) {
        if (collateralBalances.rows[j].collateral_id === allIdsStart[i]) {
          if (
            collateralBalances.rows[j].start_date >= startDateObject &&
            (earliestDate === null ||
              collateralBalances.rows[j].start_date < earliestDate)
          ) {
            earliestDate = collateralBalances.rows[j].start_date;
            earliestAmount = collateralBalances.rows[j].outstanding_amount;
          }
        }
      }
      if (earliestDate !== null) {
        startBalances.push({
          collateralId: allIdsStart[i],
          startBalance: earliestAmount,
        });
      }
    }

    console.log("starting balances:");
    for (let i = 0; i < startBalances.length; i++) {
      console.log(startBalances[i]);
    }

    // Populate allIds with IDs that existed at end of period only
    let allIdsEnd = [];
    for (let i = 0; i < facilityCollateral.rows.length; i++) {
      if (
        (!facilityCollateral.rows[i].removed_date ||
          facilityCollateral.rows[i].removed_date > endDateObject) &&
        facilityCollateral.rows[i].inclusion_date <= endDateObject
      ) {
        allIdsEnd.push({
          collateralId: facilityCollateral.rows[i].collateral_id,
          removedDate: facilityCollateral.rows[i].removed_date,
        });
      }
    }

    let endBalances = [];

    for (let i = 0; i < allIdsEnd.length; i++) {
      let latestDate = null;
      let latestAmount = 0;
      for (let j = 0; j < collateralBalances.rows.length; j++) {
        if (
          collateralBalances.rows[j].collateral_id === allIdsEnd[i].collateralId
        ) {
          if (
            collateralBalances.rows[j].start_date <= endDateObject &&
            (latestDate === null ||
              collateralBalances.rows[j].start_date > latestDate)
          ) {
            latestDate = collateralBalances.rows[j].start_date;
            latestAmount = collateralBalances.rows[j].outstanding_amount;
          }
        }
      }
      if (latestDate !== null) {
        endBalances.push({
          collateralId: allIdsEnd[i].collateralId,
          endBalance: latestAmount,
        });
      }
    }

    console.log("ending balances:");
    for (let i = 0; i < endBalances.length; i++) {
      console.log(endBalances[i]);
    }

    let everyIdInPeriod = [];

    for (let i = 0; i < facilityCollateral.rows.length; i++) {
      if (
        facilityCollateral.rows[i].inclusion_date <= endDateObject &&
        (!facilityCollateral.rows[i].removed_date ||
          facilityCollateral.rows[i].removed_date >= startDateObject)
      ) {
        everyIdInPeriod.push({
          id: facilityCollateral.rows[i].collateral_id,
        });
      }
    }

    for (let i = 0; i < everyIdInPeriod.length; i++) {
      console.log(everyIdInPeriod[i]);
    }

    let outstandingBal = [];
    let finalId;
    let finalStartBalance;
    let finalEndBalance;

    for (let i = 0; i < everyIdInPeriod.length; i++) {
      finalId = null;
      finalStartBalance = 0;
      finalEndBalance = 0;
      for (let j = 0; j < startBalances.length; j++) {
        for (let k = 0; k < endBalances.length; k++) {
          if (!finalId) {
            if (
              startBalances[j].collateralId === everyIdInPeriod[i].id ||
              endBalances[k].collateralId === everyIdInPeriod[i].id
            ) {
              finalId = everyIdInPeriod[i].id;
              if (startBalances[j].collateralId === finalId) {
                finalStartBalance = startBalances[j].startBalance;
              }
              if (endBalances[k].collateralId === finalId) {
                finalEndBalance = endBalances[k].endBalance;
              }
            }
          }
        }
      }
      outstandingBal.push({
        collateralId: finalId,
        balanceBeg: finalStartBalance,
        balanceEnd: finalEndBalance,
      });
    }

    console.log("final balances:");
    for (let i = 0; i < outstandingBal.length; i++) {
      console.log(outstandingBal[i]);
    }

    // **************************************** Advance Rates **************************************

    // Query bankmetrics to populate advance rates
    let advanceRates = [];

    let bankMetricsStart = [];
    let bankMetricsEnd = [];

    try {
      bankMetricsStart = await pool.query(bankMetricsQuery, [
        debtFacilityId,
        startDate,
      ]);
      console.log("bankMetrics ");
      for (let i = 0; i < bankMetricsStart.rows.length; i++) {
        console.log(bankMetricsStart.rows[i]);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Bank Metrics Query Failed");
    }

    try {
      bankMetricsEnd = await pool.query(bankMetricsQuery, [
        debtFacilityId,
        endDate,
      ]);
      console.log("bankMetrics End");
      for (let i = 0; i < bankMetricsEnd.rows.length; i++) {
        console.log(bankMetricsEnd.rows[i]);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Bank Metrics Query Failed");
    }

    // Query facilitymetrics twice to determine advances rates in effect at beginnning and end of period

    let facilityMetricsStart = [];
    let facilityMetricsEnd = [];

    try {
      facilityMetricsStart = await pool.query(facilityQuery, [
        debtFacilityId,
        startDate,
      ]);
      console.log("facilityQueryStart ");
      for (let i = 0; i < facilityMetricsStart.rows.length; i++) {
        console.log(facilityMetricsStart.rows[i]);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Facility Metrics Query Failed");
    }

    try {
      facilityMetricsEnd = await pool.query(facilityQuery, [
        debtFacilityId,
        endDate,
      ]);
      console.log("facilityQueryEnd");
      for (let i = 0; i < facilityMetricsEnd.rows.length; i++) {
        console.log(facilityMetricsEnd.rows[i]);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Facility Metrics Query Failed");
    }

    // determine lien type of loan and populate it in collateralLien

    collateralLien = [];

    try {
      collateralLien = await pool.query(lienTypeQuery, [debtFacilityId]);
      console.log("Lien Type");
      for (let i = 0; i < collateralLien.rows.length; i++) {
        console.log(collateralLien.rows[i]);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Lien Query Failed");
    }

    // For each collateralId that is in allIdsStart
    for (let i = 0; i < allIdsStart.length; i++) {
      collateralId = allIdsStart[i];
      lienTypeRow = collateralLien.rows.find(
        (row) => row.collateral_id === collateralId,
      );

      if (lienTypeRow) {
        lienType = lienTypeRow.lien_type || null;
      } else {
        lienType = null;
      }
      console.log(lienType);

      bankMetricStartRow =
        bankMetricsStart.rows.find(
          (row) => row.collateral_id === collateralId,
        ) || null;

      if (bankMetricStartRow) {
        startIndLoanAdv = bankMetricStartRow.advance_rate || null;
      } else {
        startIndLoanAdv = null;
      }
      console.log(startIndLoanAdv);

      if (startIndLoanAdv) {
        finalStartLoanAdv = startIndLoanAdv;
      } else {
        if (lienType === "First Lien") {
          finalStartLoanAdv =
            facilityMetricsStart.rows[0].first_lien_advance_rate;
        }
        if (lienType === "Second Lien") {
          finalStartLoanAdv =
            facilityMetricsStart.rows[0].second_lien_advance_rate;
        }
        if (lienType === "Mezzanine") {
          finalStartLoanAdv =
            facilityMetricsStart.rows[0].mezzanine_advance_rate;
        }
      }

      advanceRates.push({
        collateralId: collateralId,
        advanceRateBeg: finalStartLoanAdv,
        advanceRateEnd: null,
      });
    }

    // For each collateralId that is in outstandingBal
    for (let i = 0; i < allIdsEnd.length; i++) {
      // save lienType as lienType
      collateralId = allIdsEnd[i].collateralId;
      lienTypeRow = collateralLien.rows.find(
        (row) => row.collateral_id === collateralId,
      );

      if (lienTypeRow) {
        lienType = lienTypeRow.lien_type || null;
      } else {
        lienType = null;
      }
      console.log(lienType);

      bankMetricEndRow =
        bankMetricsEnd.rows.find((row) => row.collateral_id === collateralId) ||
        null;

      if (bankMetricEndRow) {
        endIndLoanAdv = bankMetricEndRow.advance_rate || null;
      } else {
        endIndLoanAdv = null;
      }
      console.log(endIndLoanAdv);

      if (endIndLoanAdv) {
        finalEndLoanAdv = endIndLoanAdv;
      } else {
        if (lienType === "First Lien") {
          finalEndLoanAdv = facilityMetricsEnd.rows[0].first_lien_advance_rate;
        }
        if (lienType === "Second Lien") {
          finalEndLoanAdv = facilityMetricsEnd.rows[0].second_lien_advance_rate;
        }
        if (lienType === "Mezzanine") {
          finalEndLoanAdv = facilityMetricsEnd.rows[0].mezzanine_advance_rate;
        }
      }

      const existingAdvRate = advanceRates.find(
        (items) => items.collateralId === collateralId,
      );

      if (existingAdvRate) {
        existingAdvRate.advanceRateEnd = finalEndLoanAdv;
      } else {
        advanceRates.push({
          collateralId: collateralId,
          advanceRateBeg: null,
          advanceRateEnd: finalEndLoanAdv,
        });
      }
    }

    for (let i = 0; i < advanceRates.length; i++) {
      console.log("FINAL ADV");
      console.log(advanceRates[i].collateralId);
      console.log(advanceRates[i].advanceRateBeg);
      console.log(advanceRates[i].advanceRateEnd);
    }

    // **************************************** bank valuations **************************************

    let bankValuations = [];

    for (let i = 0; i < allIdsStart.length; i++) {
      collateralId = allIdsStart[i];

      bankMetricStartRow =
        bankMetricsStart.rows.find(
          (row) => row.collateral_id === collateralId,
        ) || null;

      if (bankMetricStartRow) {
        startBankLoanVal = bankMetricStartRow.valuation || null;
      } else {
        startBankLoanVal = null;
      }

      bankValuations.push({
        collateralId: collateralId,
        bankValBeg: startBankLoanVal,
        bankValEnd: null,
      });
    }

    for (let i = 0; i < allIdsEnd.length; i++) {
      collateralId = allIdsEnd[i].collateralId;
      bankMetricEndRow =
        bankMetricsEnd.rows.find((row) => row.collateral_id === collateralId) ||
        null;

      if (bankMetricEndRow) {
        endBankLoanVal = bankMetricEndRow.valuation || null;
      } else {
        endBankLoanVal = null;
      }

      const existingVal = bankValuations.find(
        (items) => items.collateralId === collateralId,
      );

      if (existingVal) {
        existingVal.bankValEnd = endBankLoanVal;
      } else {
        bankValuations.push({
          collateralId: collateralId,
          bankValBeg: null,
          bankValEnd: endBankLoanVal,
        });
      }

      for (let i = 0; i < bankValuations.length; i++) {
        console.log("FINAL");
        console.log(bankValuations[i].collateralId);
        console.log(bankValuations[i].bankValBeg);
        console.log(bankValuations[i].bankValEnd);
      }
    }

    // **************************************** internal valuations **************************************

    let internalValuations = [];

    try {
      intValStart = await pool.query(intValQuery, [debtFacilityId, startDate]);
      console.log("intValMetrics ");
      for (let i = 0; i < intValStart.rows.length; i++) {
        console.log(intValStart.rows[i]);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Bank Metrics Query Failed");
    }

    try {
      intValEnd = await pool.query(intValQuery, [debtFacilityId, endDate]);
      console.log("intValMetrics End ");
      for (let i = 0; i < intValEnd.rows.length; i++) {
        console.log(intValEnd.rows[i]);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Bank Metrics Query Failed");
    }

    for (let i = 0; i < allIdsStart.length; i++) {
      collateralId = allIdsStart[i];

      intValStartRow =
        intValStart.rows.find((row) => row.collateral_id === collateralId) ||
        null;

      if (intValStartRow) {
        startIntVal = intValStartRow.internal_val || null;
      } else {
        startIntVal = null;
      }

      internalValuations.push({
        collateralId: collateralId,
        internalValBeg: startIntVal,
        internalValEnd: null,
      });
    }

    for (let i = 0; i < allIdsEnd.length; i++) {
      collateralId = allIdsEnd[i].collateralId;
      intValEndRow =
        intValEnd.rows.find((row) => row.collateral_id === collateralId) ||
        null;

      if (intValEndRow) {
        endIntVal = intValEndRow.internal_val || null;
      } else {
        endIntVal = null;
      }

      const existingIntVal = internalValuations.find(
        (items) => items.collateralId === collateralId,
      );

      if (existingIntVal) {
        existingIntVal.internalValEnd = endIntVal;
      } else {
        internalValuations.push({
          collateralId: collateralId,
          internalValBeg: null,
          internalValEnd: endIntVal,
        });
      }

      for (let i = 0; i < internalValuations.length; i++) {
        console.log("FINAL");
        console.log(internalValuations[i].collateralId);
        console.log(internalValuations[i].internalValBeg);
        console.log(internalValuations[i].internalValEnd);
      }
    }
    // **************************************** payments **************************************

    let payments = [];
    try {
      paymentsResults = await pool.query(paymentQuery, [
        debtFacilityId,
        startDate,
        endDate,
      ]);
    } catch (err) {
      console.error(err);
      res.status(500).send("Payments Query Failed");
    }

    let totalPrincipalInPeriod = 0;
    let totalInterestInPeriod = 0;

    for (let i = 0; i < everyIdInPeriod.length; i++) {
      totalPrincipalInPeriod = 0;
      totalInterestInPeriod = 0;

      for (let j = 0; j < paymentsResults.rows.length; j++) {
        if (paymentsResults.rows[j].collateral_id === everyIdInPeriod[i].id) {
          totalPrincipalInPeriod =
            totalPrincipalInPeriod +
            parseFloat(paymentsResults.rows[j].principal_received || 0);
          totalInterestInPeriod =
            totalInterestInPeriod +
            parseFloat(paymentsResults.rows[j].interest_received || 0);
        }
      }
      payments.push({
        collateralId: everyIdInPeriod[i].id,
        principalRec: totalPrincipalInPeriod,
        interestRec: totalInterestInPeriod,
      });
    }

    for (let i = 0; i < payments.length; i++) {
      console.log("Payments");
      console.log(payments[i].collateralId);
      console.log(payments[i].principalRec);
      console.log(payments[i].interestRec);
    }

    res.status(200).send("Working");
  } catch (err) {
    console.error(err);
    res.status(500).send("DB create loan_tranches query failed");
  }
});

module.exports = router;
