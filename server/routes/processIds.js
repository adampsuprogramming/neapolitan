function getIdsOfAdditions(facilityCollateral) {
  let addedIds = [];
  for (let i = 0; i < facilityCollateral.rows.length; i++) {
    if (facilityCollateral.rows[i].inclusion_date) {
      addedIds.push({
        id: facilityCollateral.rows[i].collateral_id,
        addedDate: facilityCollateral.rows[i].inclusion_date,
      });
    }
  }

  return addedIds;
}

function getIdsOfRemoved(facilityCollateral) {
  let removedIds = [];
  for (let i = 0; i < facilityCollateral.rows.length; i++) {
    if (facilityCollateral.rows[i].removed_date) {
      removedIds.push({
        id: facilityCollateral.rows[i].collateral_id,
        removalDate: facilityCollateral.rows[i].removed_date,
      });
    }
  }
  return removedIds;
}

function getIdsAtStartOfPeriod(facilityCollateral, startDateObject) {
  let allIdsStart = [];
  for (let i = 0; i < facilityCollateral.rows.length; i++) {
    if (facilityCollateral.rows[i].inclusion_date < startDateObject) {
      allIdsStart.push(facilityCollateral.rows[i].collateral_id);
    }
  }
  return allIdsStart;
}

function getIdsAtEndOfPeriod(facilityCollateral, endDateObject) {
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
  return allIdsEnd;
}

function getEveryIdInPeriod(facilityCollateral, startDateObject, endDateObject) {
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

  return everyIdInPeriod;
}

module.exports = {
  getIdsOfAdditions,
  getIdsOfRemoved,
  getIdsAtStartOfPeriod,
  getIdsAtEndOfPeriod,
  getEveryIdInPeriod,
};
