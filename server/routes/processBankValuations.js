function getBegAndEndBankValuations(
  allIdsStart,
  allIdsEnd,
  additions,
  bankMetricsStart,
  bankMetricsEnd,
  loanApprovalResults,
) {
  let bankValuations = [];

  for (let i = 0; i < allIdsStart.length; i++) {
    collateralId = allIdsStart[i];

    bankMetricStartRow =
      bankMetricsStart.rows.find((row) => row.collateral_id === collateralId) || null;

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

  for (let i = 0; i < additions.length; i++) {
    startBankLoanVal = null;
    for (let j = 0; j < loanApprovalResults.rows.length; j++) {
      if (loanApprovalResults.rows[j].collateral_id === additions[i].collateralId) {
        startBankLoanVal = parseFloat(loanApprovalResults.rows[j].approved_valuation || 0);
      }
    }

    bankValuations.push({
      collateralId: additions[i].collateralId,
      bankValBeg: startBankLoanVal,
      bankValEnd: null,
    });
  }

  for (let i = 0; i < allIdsEnd.length; i++) {
    collateralId = allIdsEnd[i].collateralId;
    bankMetricEndRow =
      bankMetricsEnd.rows.find((row) => row.collateral_id === collateralId) || null;

    if (bankMetricEndRow) {
      endBankLoanVal = bankMetricEndRow.valuation || null;
    } else {
      endBankLoanVal = null;
    }

    const existingVal = bankValuations.find((items) => items.collateralId === collateralId);

    if (existingVal) {
      existingVal.bankValEnd = endBankLoanVal;
    } else {
      bankValuations.push({
        collateralId: collateralId,
        bankValBeg: null,
        bankValEnd: endBankLoanVal,
      });
    }
  }
  return bankValuations;
}

module.exports = {
  getBegAndEndBankValuations,
};
