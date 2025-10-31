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
WHERE d.debt_facility_id=$1 and dfo.start_date<=$2 and dfo.end_date>$2`;

// Query to get bank advance rates and valuations in effect for given facility_id $1

const bankMetrics = 
`SELECT * FROM bank_metrics bm
left join collateral c
	on c.collateral_id = bm.collateral_id
left join debt_facilities df
	on c.debt_facility_id = df.debt_facility_id
where df.debt_facility_id = $1`

// Query to get all internal valuations for given facility_id $1
const constIntValQuery = `
SELECT c.collateral_id, lm.start_date, lm.end_date, lm.internal_val FROM public.loan_metrics lm
left join loan_tranches lt
	on lm.tranche_id  = lt.tranche_id
left join collateral c
	on c.tranche_id = lt.tranche_id
left join debt_facilities df
	on c.debt_facility_id = df.debt_facility_id
WHERE df.debt_facility_id = $1`

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
    res.status(500).send("DB create loan_tranches query failed");
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

    res.status(200).send("Working");
  } catch (err) {
    console.error(err);
    res.status(500).send("DB create loan_tranches query failed");
  }
});

module.exports = router;
