function getBegAndEndAdvRates(
  allIdsStart,
  addedIds,
  allIdsEnd,
  collateralLien,
  bankMetricsStart,
  bankMetricsEnd,
  loanApprovalResults,
  facilityMetricsStart,
  facilityMetricsEnd,
) {
  // Query bankmetrics to populate advance rates
  let advanceRates = [];

  // Query facilitymetrics twice to determine advances rates in effect at beginnning and end of period

  // determine lien type of loan and populate it in collateralLien

  // For each collateralId that is in allIdsStart
  for (let i = 0; i < allIdsStart.length; i++) {
    const collateralId = allIdsStart[i];

    const lienTypeRow = collateralLien.rows.find((row) => row.collateral_id === collateralId);

    const lienType = lienTypeRow ? lienTypeRow.lien_type || null : null;

    const bankMetricStartRow =
      bankMetricsStart.rows.find((row) => row.collateral_id === collateralId) || null;

    const startIndLoanAdv = bankMetricStartRow ? bankMetricStartRow.advance_rate || null : null;

    let finalStartLoanAdv;

    if (startIndLoanAdv != null) {
      finalStartLoanAdv = startIndLoanAdv;
    } else if (lienType === "First Lien") {
      finalStartLoanAdv = facilityMetricsStart.rows[0].first_lien_advance_rate;
    } else if (lienType === "Second Lien") {
      finalStartLoanAdv = facilityMetricsStart.rows[0].second_lien_advance_rate;
    } else if (lienType === "Mezzanine") {
      finalStartLoanAdv = facilityMetricsStart.rows[0].mezzanine_advance_rate;
    }

    /// THIS SHOULD ONLY PUSH IF THE BEGINNING ADVANCE RATES DO NOT EXIST

    advanceRates.push({
      collateralId: collateralId,
      advanceRateBeg: finalStartLoanAdv,
      advanceRateEnd: null,
    });
  }

  // If asset was newly added, retrieve the advance rate:

  // let loanApprovalResults = [];

  for (let i = 0; i < addedIds.length; i++) {
    const collateralId = addedIds[i].id;
    let finalStartLoanAdv = null;
    const lienTypeRow = collateralLien.rows.find((row) => row.collateral_id === collateralId);

    const lienType = lienTypeRow ? lienTypeRow.lien_type || null : null;

    let fallBackAdvanceRate;
      
        if (lienType === "First Lien") {
          fallBackAdvanceRate = facilityMetricsStart.rows[0].first_lien_advance_rate;
        }
        if (lienType === "Second Lien") {
          fallBackAdvanceRate = facilityMetricsStart.rows[0].second_lien_advance_rate;
        }
        if (lienType === "Mezzanine") {
          fallBackAdvanceRate = facilityMetricsStart.rows[0].mezzanine_advance_rate;
        }
      
    



    for (let j = 0; j < loanApprovalResults.rows.length; j++) {
      if (loanApprovalResults.rows[j].collateral_id === addedIds[i].id) {
        finalStartLoanAdv = parseFloat(loanApprovalResults.rows[j].approved_advance_rate || fallBackAdvanceRate);

        break;
      } 
    }
    
    

    const existingAdvRate = advanceRates.find((items) => items.collateralId === collateralId);

    if (!existingAdvRate) {
      advanceRates.push({
        collateralId: addedIds[i].id,
        advanceRateBeg: finalStartLoanAdv,
        advanceRateEnd: null,
      });
    }
  }

  // For each collateralId that is in outstandingBal
  // IMPORTANT NOTE: IF THE ASSET DOES NOT EXIST AT THE END OF THE PERIOD, ADVANCE RATE IS SHOWN
  // AS NULL, SINCE IT IS NOT RELEVANT TO CALCULATIONS.


  for (let i = 0; i < allIdsEnd.length; i++) {
    let finalEndLoanAdv = null;
    // save lienType as lienType
    collateralId = allIdsEnd[i].collateralId;
    lienTypeRow = collateralLien.rows.find((row) => row.collateral_id === collateralId);

      lienType = lienTypeRow.lien_type || null;

    bankMetricEndRow =
      bankMetricsEnd.rows.find((row) => row.collateral_id === collateralId) || null;

      endIndLoanAdv = bankMetricEndRow.advance_rate || null;


    if (endIndLoanAdv) {
      finalEndLoanAdv = endIndLoanAdv;
    } else if (lienType === "First Lien") {
        finalEndLoanAdv = facilityMetricsEnd.rows[0].first_lien_advance_rate;
    } else if (lienType === "Second Lien") {
        finalEndLoanAdv = facilityMetricsEnd.rows[0].second_lien_advance_rate;
    } else if (lienType === "Mezzanine") {
        finalEndLoanAdv = facilityMetricsEnd.rows[0].mezzanine_advance_rate;
      }
    

    const existingAdvRate = advanceRates.find((items) => items.collateralId === collateralId);

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

  return advanceRates;
}

module.exports = {
  getBegAndEndAdvRates,
};
