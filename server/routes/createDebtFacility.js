const express = require("express");
const router = express.Router();
const pool = require("../db");

const createDebtFacilitySQL = `
insert into debt_facilities (debt_facility_name, lender_id, portfolio_id)
values ($1,$2,$3)
returning debt_facility_id
`;

const createDebtFacilityOptionsSQL = `
insert into debt_facility_options (debt_facility_id, start_date, end_date, overall_commitment_amount, is_overall_rate, overall_rate, is_asset_by_asset_advance, is_first_lien_advance_rate, first_lien_advance_rate, is_second_lien_advance_rate, second_lien_advance_rate, is_mezzanine_advance_rate, mezzanine_advance_rate, is_minimum_equity, minimum_equity_amount)
values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);

`;

router.post("/api/createdebtfacility", async (req, res) => {
  const {
    debtFacilityName,
    portfolioId,
    lenderId,
    startDate,
    endDate,
    overAllCommitmentAmount,
    isOverallRate,
    overallRate,
    isAssetByAssetAdvance,
    firstLienRate,
    secondLienRate,
    mezzRate,
    isMinEquity,
    minEquityAmount,
  } = req.body;
  console.log("Debt Facility Name: ", debtFacilityName);
  console.log("Portfolio ID: ", portfolioId);
  console.log("Lender ID: ", lenderId);
  console.log("Start Date: ", startDate);
  console.log("End Date", endDate);
  console.log("Overall Commitment: ", overAllCommitmentAmount);
  console.log("Is Overall Rate: ", isOverallRate);
  console.log("Overall Rate: ", overallRate);
  console.log("is Asset by Asset Advance: ", isAssetByAssetAdvance);
  console.log("First Lien Rate: ", firstLienRate);
  console.log("Second Line Rate: ", secondLienRate);
  console.log("Mezzanine Rate: ", mezzRate);
  console.log("Is Minimum Equity: ", isMinEquity);
  console.log("Minimum Equity Amount: ", minEquityAmount);

  try {
    result = await pool.query(createDebtFacilitySQL, [
      debtFacilityName,
      lenderId,
      portfolioId,
    ]);
    newDebtFacilityID = result.rows[0].debt_facility_id;
    console.log("New debt facility id: ", newDebtFacilityID);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB create debt_facility query failed");
  }

  try {
    const isFirstLienAdvanceRate = firstLienRate == null ? false : true;
    const isSecondLienAdvanceRate = secondLienRate == null ? false : true;
    const isMezzAdvanceRate = mezzRate == null ? false : true;
    await pool.query(createDebtFacilityOptionsSQL, [
      newDebtFacilityID,
      startDate,
      endDate,
      overAllCommitmentAmount,
      isOverallRate,
      overallRate,
      isAssetByAssetAdvance,
      isFirstLienAdvanceRate,
      firstLienRate,
      isSecondLienAdvanceRate,
      secondLienRate,
      isMezzAdvanceRate,
      mezzRate,
      isMinEquity,
      minEquityAmount,
    ]);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB create debt_facility_options query failed");
  }
});



module.exports = router;
