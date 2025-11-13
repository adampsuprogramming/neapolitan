const express = require("express");
const router = express.Router();
const pool = require("../db");

// Basic query for borrower and borrower id.  This is
// Selecting every borrower in the DB


const borrowerByFacility = `SELECT c.collateral_id, c.debt_facility_id, c.tranche_id, c.inclusion_date, c.removed_date, b.legal_name
FROM collateral c
LEFT JOIN loan_tranches lt
  ON lt.tranche_id =c.tranche_id
LEFT JOIN loan_agreements la
  ON lt.loan_agreement_id = la.loan_agreement_id
LEFT JOIN borrowers b
  ON b.borrower_id = la.borrower_id
WHERE debt_facility_id = $1`


router.get("/api/borrowerquerybyfacility", async (req, res) => {
  const { debtFacilityId } = req.query;
  try {
    const result = await pool.query(borrowerByFacility, [debtFacilityId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Borrower Query By Facility Has Failed");
  }
});

module.exports = router;
