const { getIntValForCollateral } = require("../routes/rollforwardQueries");

async function getBegAndEndInternalValuations(
  allIdsStart,
  allIdsEnd,
  additions,
  intValStart,
  intValEnd,
) {
  let internalValuations = [];

  for (let i = 0; i < allIdsStart.length; i++) {
    collateralId = allIdsStart[i];

    const intValStartRow =
      intValStart.rows.find((row) => row.collateral_id === collateralId) || null;

    startIntVal = intValStartRow ? intValStartRow.internal_val || null : null;

    internalValuations.push({
      collateralId: collateralId,
      internalValBeg: startIntVal,
      internalValEnd: null,
    });
  }

  for (let i = 0; i < additions.length; i++) {
    collateralId = additions[i].collateralId;
    inclusionDate = additions[i].addedDate;

    const intValStartOneColl = await getIntValForCollateral(collateralId, inclusionDate);

    internalValuations.push({
      collateralId: collateralId,
      internalValBeg: intValStartOneColl.rows[0].internal_val,
      internalValEnd: null,
    });
  }

  for (let i = 0; i < allIdsEnd.length; i++) {
    collateralId = allIdsEnd[i].collateralId;
    intValEndRow = intValEnd.rows.find((row) => row.collateral_id === collateralId) || null;

    endIntVal = intValEndRow ? intValEndRow.internal_val || null : null;

    const existingIntVal = internalValuations.find((items) => items.collateralId === collateralId);

    if (existingIntVal) {
      existingIntVal.internalValEnd = endIntVal;
    } else {
      internalValuations.push({
        collateralId: collateralId,
        internalValBeg: null,
        internalValEnd: endIntVal,
      });
    }
  }

  return internalValuations;
}

module.exports = {
  getBegAndEndInternalValuations,
};
