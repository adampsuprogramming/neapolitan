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
    const collateralId = allIdsStart[i];

    const bankMetricStartRow =
      bankMetricsStart.rows.find((row) => row.collateral_id === collateralId) || null;

    const startBankLoanVal = bankMetricStartRow ? bankMetricStartRow.valuation || null : null;

    bankValuations.push({
      collateralId: collateralId,
      bankValBeg: startBankLoanVal,
      bankValEnd: null,
    });
  }

  for (let i = 0; i < additions.length; i++) {
    let startBankLoanVal = null;
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
    const collateralId = allIdsEnd[i].collateralId;
    const bankMetricEndRow =
      bankMetricsEnd.rows.find((row) => row.collateral_id === collateralId) || null;

    const endBankLoanVal = bankMetricEndRow.valuation || null;

    const existingVal = bankValuations.find((items) => items.collateralId === collateralId);

    existingVal.bankValEnd = endBankLoanVal;
  }
  // NOTE: IF BANK METRICS HAS NULL FOR VALUATIONS, IT SHOULD RETURN NULL FOR ANY VALUATION OTHER THAN
  // A LOAN THAT WAS ORIGINATED IN THE PERIOD, WHICH WILL SHOULD ALWAYS DEFAULT TO THE ORIGINATION VALUATION
  // ON THE APPROVAL FORM.

  return bankValuations;
}

module.exports = {
  getBegAndEndBankValuations,
};
