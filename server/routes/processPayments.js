function getPaymentInfo(everyIdInPeriod, paymentsResults) {
  let payments = [];

  let totalPrincipalInPeriod = 0;
  let totalInterestInPeriod = 0;

  for (let i = 0; i < everyIdInPeriod.length; i++) {
    totalPrincipalInPeriod = 0;
    totalInterestInPeriod = 0;

    for (let j = 0; j < paymentsResults.rows.length; j++) {
      if (paymentsResults.rows[j].collateral_id === everyIdInPeriod[i].id) {
        totalPrincipalInPeriod =
          totalPrincipalInPeriod + parseFloat(paymentsResults.rows[j].principal_received || 0);
        totalInterestInPeriod =
          totalInterestInPeriod + parseFloat(paymentsResults.rows[j].interest_received || 0);
      }
    }
    payments.push({
      collateralId: everyIdInPeriod[i].id,
      principalRec: totalPrincipalInPeriod,
      interestRec: totalInterestInPeriod,
    });
  }

  return payments;
}

module.exports = {
  getPaymentInfo,
};
