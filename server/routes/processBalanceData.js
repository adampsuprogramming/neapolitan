function getFacilityBalanceAdditions(collateralBalances, addedIds, startDateObject, endDateObject) {
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
          amtAdded: parseFloat(collateralBalances.rows[i].outstanding_amount),
        });
      }
    }
  }

  return additions;
}

// Loops through collateral balance rows and removals to look for the collateral
// removed and the balance at removal.  Note that this DOES account for date added
// in the comparison, so removals is the date specific array

function getFacilityBalanceRemovals(
  collateralBalances,
  removedIds,
  startDateObject,
  endDateObject,
) {
  let removals = [];
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
          amtRemoved: parseInt(collateralBalances.rows[i].outstanding_amount),
        });
      }
    }
  }

  return removals;
}

function getStartOfPeriodBalances(allIdsStart, collateralBalances, startDateObject) {
  let startBalances = [];

  for (let i = 0; i < allIdsStart.length; i++) {
    let earliestDate = null;
    let earliestAmount = 0;
    for (let j = 0; j < collateralBalances.rows.length; j++) {
      if (collateralBalances.rows[j].collateral_id === allIdsStart[i]) {
        if (
          collateralBalances.rows[j].start_date <= startDateObject &&
          collateralBalances.rows[j].end_date >= startDateObject &&
          (earliestDate === null || collateralBalances.rows[j].start_date < earliestDate)
        ) {
          earliestDate = collateralBalances.rows[j].start_date;
          earliestAmount = collateralBalances.rows[j].outstanding_amount;
        }
      }
    }
    if (earliestDate !== null) {
      startBalances.push({
        collateralId: allIdsStart[i],
        startBalance: parseFloat(earliestAmount),
      });
    }
  }

  return startBalances;
}

function getEndOfPeriodBalances(allIdsEnd, collateralBalances, endDateObject) {
  let endBalances = [];

  for (let i = 0; i < allIdsEnd.length; i++) {
    let latestDate = null;
    let latestAmount = 0;
    for (let j = 0; j < collateralBalances.rows.length; j++) {
      if (collateralBalances.rows[j].collateral_id === allIdsEnd[i].collateralId) {
        if (
          collateralBalances.rows[j].start_date <= endDateObject &&
          (latestDate === null || collateralBalances.rows[j].start_date > latestDate)
        ) {
          latestDate = collateralBalances.rows[j].start_date;
          latestAmount = collateralBalances.rows[j].outstanding_amount;
        }
      }
    }
    if (latestDate !== null) {
      endBalances.push({
        collateralId: allIdsEnd[i].collateralId,
        endBalance: parseFloat(latestAmount),
      });
    }
  }

  return endBalances;
}

function getBegAndEndOustandings(startBalances, endBalances) {
  let outstandingBal = [];

  for (let i = 0; i < startBalances.length; i++) {
    outstandingBal.push({
      collateralId: startBalances[i].collateralId,
      balanceBeg: startBalances[i].startBalance,
      balanceEnd: null,
    });
  }

  for (let i = 0; i < endBalances.length; i++) {
    collateralId = endBalances[i].collateralId;
    const existingBal = outstandingBal.find((items) => items.collateralId === collateralId);

    if (existingBal) {
      existingBal.balanceEnd = endBalances[i].endBalance;
    } else {
      outstandingBal.push({
        collateralId: endBalances[i].collateralId,
        balanceBeg: null,
        balanceEnd: endBalances[i].endBalance,
      });
    }
  }

  return outstandingBal;
}

module.exports = {
  getFacilityBalanceAdditions,
  getFacilityBalanceRemovals,
  getStartOfPeriodBalances,
  getEndOfPeriodBalances,
  getBegAndEndOustandings,
};
